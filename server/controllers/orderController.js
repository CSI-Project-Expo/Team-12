const mongoose = require('mongoose');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

// @desc    Create a new order (sale) with stock deduction
// @route   POST /api/orders
// @access  Private (user only)
const createOrder = async (req, res) => {
    const { shopId, items, customerName, customerEmail, customerPhone } = req.body;

    if (!shopId || !items || items.length === 0) {
        return res.status(400).json({ message: 'Shop ID and at least one item are required' });
    }

    try {
        let totalAmount = 0;
        const saleItems = [];

        // Validate stock and calculate totals
        for (const item of items) {
            const product = await Product.findOne({
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
        }

        // Deduct stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }

        // Create the sale/order
        const sale = await Sale.create({
            customerId: req.user._id,
            items: saleItems,
            totalAmount,
            status: 'completed',
            createdBy: new mongoose.Types.ObjectId(shopId)
        });

        res.status(201).json({
            orderId: sale._id,
            totalAmount: sale.totalAmount,
            status: sale.status,
            itemCount: saleItems.length
        });

    } catch (error) {
        console.error('Order creation error:', error.message);
        res.status(500).json({ message: 'Failed to create order. Please try again.' });
    }
};

module.exports = {
    createOrder
};
