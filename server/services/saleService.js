const mongoose = require('mongoose');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Bill = require('../models/Bill');
const AuditLog = require('../models/AuditLog');
const crypto = require('crypto');

/**
 * Perform atomic stock reduction for a single product.
 * This guarantees stock will never go below 0 due to concurrent requests.
 * 
 * @param {mongoose.Types.ObjectId} productId 
 * @param {number} quantity 
 * @param {mongoose.ClientSession} session 
 * @returns {Promise<Object>} The updated product
 * @throws {Error} If stock is insufficient or product not found
 */
const reduceStockAtomically = async (productId, quantity, session) => {
    // $gte ensures we only match the document if it has enough stock
    // findOneAndUpdate is atomic at the database level
    const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true, session }
    );

    if (!updatedProduct) {
        // We could not find a product with that ID that also has enough stock
        // This could also mean the product doesn't exist, but typically in an
        // inventory app at this stage, it means insufficient stock.
        const productExists = await Product.findById(productId).session(session);
        if (!productExists) {
            throw new Error(`Product with ID ${productId} not found`);
        }
        throw new Error(`Insufficient stock for product ${productExists.name}`);
    }

    return updatedProduct;
};

/**
 * Creates a complete sale via a MongoDB transaction.
 * Guarantees All-or-Nothing execution for Stock, Sale, Bill, and Audit Logs.
 * 
 * @param {Object} saleData - The incoming sale data
 * @param {mongoose.Types.ObjectId} [saleData.customerId] - Optional customer ID
 * @param {Array<{productId: string, quantity: number}>} saleData.items - Items to buy
 * @param {mongoose.Types.ObjectId} userId - ID of the user (admin/cashier) creating the sale
 * @returns {Promise<Object>} Resulting sale and bill
 */
const createSaleTransaction = async (saleData, userId) => {
    const session = await mongoose.startSession();

    // Start the transaction
    session.startTransaction();

    try {
        const { customerId, items } = saleData;

        if (!items || items.length === 0) {
            throw new Error('A sale must have at least one item');
        }

        let totalAmount = 0;
        const processedItems = [];

        // 1. Process items, verify prices, and reduce stock atomically
        for (const item of items) {
            const { productId, quantity } = item;

            // Fetch current product to get the accurate price (to store in priceAtSale)
            const currentProduct = await Product.findById(productId).session(session);
            if (!currentProduct) {
                throw new Error(`Product ${productId} not found`);
            }

            // Atomically reduce stock
            await reduceStockAtomically(productId, quantity, session);

            const priceAtSale = currentProduct.price;
            const itemTotal = priceAtSale * quantity;
            totalAmount += itemTotal;

            processedItems.push({
                productId: currentProduct._id,
                quantity,
                priceAtSale
            });
        }

        // 2. Create the Sale Document
        const [newSale] = await Sale.create([{
            customerId: customerId || null,
            items: processedItems,
            totalAmount,
            status: 'completed',
            createdBy: userId
        }], { session });

        // 3. Create the Bill Document
        // Generate a unique string for the QR. In production, this might be a signed JWT 
        // or a verifiable hash containing the sale ID and total.
        const qrString = crypto.randomBytes(16).toString('hex') + '-' + newSale._id.toString();

        const [newBill] = await Bill.create([{
            saleId: newSale._id,
            qrString,
            emailSent: false
        }], { session });

        // 4. Create an Audit Log for the transaction
        await AuditLog.create([{
            userId,
            actionType: 'TRANSACTION',
            collectionName: 'Sale',
            documentId: newSale._id,
            previousData: null,
            newData: {
                saleId: newSale._id,
                totalAmount,
                itemsCount: processedItems.length
            }
        }], { session });

        // 5. Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return { success: true, sale: newSale, bill: newBill };

    } catch (error) {
        // If anything fails, abort the transaction completely
        // All stock changes, inserting records, etc., are rolled back
        await session.abortTransaction();
        session.endSession();

        throw error;
    }
};

module.exports = {
    reduceStockAtomically,
    createSaleTransaction
};
