const mongoose = require('mongoose');
const crypto = require('crypto');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const getTenantConnection = require('../utils/tenantConnection');

// @desc    Create a new order (sale) with stock deduction + bill generation
// @route   POST /api/orders
// @access  Private (user only)
const createOrder = async (req, res) => {
    const { shopId, items, customerName, customerEmail, customerPhone } = req.body;

    if (!shopId || !items || items.length === 0) {
        return res.status(400).json({ message: 'Shop ID and at least one item are required' });
    }

    try {
        // We must pull the models dynamically from the Target Shop's tenant DB, 
        // NOT the requesting buyer's tenant DB.
        const shopTenantDb = getTenantConnection(shopId);
        const ShopProduct = shopTenantDb.model('Product');
        const ShopSale = shopTenantDb.model('Sale');
        const ShopBill = shopTenantDb.model('Bill');
        const ShopAuditLog = shopTenantDb.model('AuditLog');

        let totalAmount = 0;
        const saleItems = [];
        const emailItems = [];

        // Validate stock and calculate totals
        for (const item of items) {
            const product = await ShopProduct.findOne({
                _id: item.productId,
                createdBy: shopId,
                isDeleted: false
            });

            if (!product) {
                return res.status(400).json({
                    message: `Product not found: ${item.productId}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
                });
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            saleItems.push({
                productId: product._id,
                quantity: item.quantity,
                priceAtSale: product.price
            });

            emailItems.push({
                name: product.name,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Deduct stock and log
        for (const item of items) {
            const updatedProd = await ShopProduct.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            }, { new: true });

            await ShopAuditLog.create({
                userId: new mongoose.Types.ObjectId(shopId), // log under admin's store
                actionType: 'SALE_DEDUCTION',
                collectionName: 'Product',
                documentId: item.productId,
                previousData: { stock: updatedProd.stock + item.quantity },
                newData: { stock: updatedProd.stock, quantity: -item.quantity }
            });
        }

        // Create the sale/order
        const sale = await ShopSale.create({
            customerId: req.user._id,
            items: saleItems,
            totalAmount,
            status: 'completed',
            createdBy: new mongoose.Types.ObjectId(shopId)
        });

        // Generate a bill with unique QR string for verification and prefix the shopId
        const qrString = `${shopId}-${crypto.randomBytes(16).toString('hex')}-${sale._id.toString()}`;
        const bill = new ShopBill({
            saleId: sale._id,
            qrString,
            emailSent: false
        });

        // Save it inside the bill document as qrString
        await bill.save();

        res.status(201).json({
            orderId: sale._id,
            totalAmount: sale.totalAmount,
            status: sale.status,
            itemCount: saleItems.length,
            qrString: bill.qrString
        });

        // Send email silently in the background
        const customerDetails = {
            name: customerName || (req.user && req.user.name) || 'Customer',
            email: customerEmail || (req.user && req.user.email)
        };

        const safeOrderId = sale._id.toString();

        if (customerDetails.email) {
            sendOrderConfirmationEmail(customerDetails, safeOrderId, emailItems, totalAmount, bill.qrString).catch(err => {
                console.error('Unexpected error wrapping email service:', err);
            });
        }

    } catch (error) {
        console.error('Order creation error:', error.message);
        res.status(500).json({ message: 'Failed to create order. Please try again.' });
    }
};

// @desc    Get all orders for the logged-in admin's shop
// @route   GET /api/orders
// @access  Private (admin)
const getOrders = async (req, res) => {
    const { Product, Sale, Bill, AuditLog } = req.tenantDb || {};
    try {
        const User = require('../models/User'); // Import the main DB User model for cross-population

        const orders = await Sale.find({ createdBy: req.user._id })
            .populate({ path: 'customerId', model: User, select: 'name email' })
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ message: 'Failed to fetch orders.' });
    }
};

module.exports = {
    createOrder,
    getOrders
};
