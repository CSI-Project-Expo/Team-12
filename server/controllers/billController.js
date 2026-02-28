const Bill = require('../models/Bill');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');
const crypto = require('crypto');

// @desc    Create a new bill and generate unique QR string
// @route   POST /api/bills
// @access  Private (admin)
const createBill = async (req, res) => {
    try {
        const { saleId } = req.body;

        if (!saleId) {
            return res.status(400).json({ success: false, message: 'Sale ID is required' });
        }

        // Generate a proper unique QR string
        const qrString = crypto.randomBytes(16).toString('hex') + '-' + saleId.toString();

        const newBill = new Bill({
            saleId,
            qrString,
            emailSent: false
        });

        // Make sure await newBill.save() is called BEFORE sending response
        await newBill.save();

        res.status(201).json({
            success: true,
            message: 'Bill created successfully',
            bill: newBill
        });
    } catch (error) {
        console.error('Bill creation error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to create bill' });
    }
};

// @desc    Verify a bill by its QR string
// @route   GET /api/bills/verify/:code
// @access  Private (admin)
// SAFETY: Read-only
const verifyBill = async (req, res) => {
    try {
        const { code } = req.params;

        if (!code) {
            return res.status(400).json({ success: false, message: 'QR string is required' });
        }

        // Use: const bill = await Bill.findOne({ qrString: req.params.code });
        const bill = await Bill.findOne({ qrString: code });

        if (!bill) {
            return res.status(404).json({ success: false, message: 'Bill not found. Invalid QR code.' });
        }

        // Get the associated sale with populated product details
        const sale = await Sale.findById(bill.saleId).populate('customerId', 'name email');

        if (!sale) {
            return res.status(404).json({ success: false, message: 'Sale record not found for this bill.' });
        }

        // Get product names for each item
        const itemsWithNames = await Promise.all(
            sale.items.map(async (item) => {
                const product = await Product.findById(item.productId).select('name sku');
                return {
                    productName: product?.name || 'Unknown Product',
                    sku: product?.sku || 'N/A',
                    quantity: item.quantity,
                    priceAtSale: item.priceAtSale,
                    subtotal: item.quantity * item.priceAtSale
                };
            })
        );

        res.json({
            success: true,
            verified: true,
            bill: {
                id: bill._id,
                qrString: bill.qrString,
                createdAt: bill.createdAt
            },
            sale: {
                id: sale._id,
                totalAmount: sale.totalAmount,
                status: sale.status,
                createdAt: sale.createdAt,
                customer: sale.customerId ? {
                    name: sale.customerId.name,
                    email: sale.customerId.email
                } : null,
                items: itemsWithNames
            }
        });
    } catch (error) {
        console.error('Bill verification error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to verify bill' });
    }
};

module.exports = { createBill, verifyBill };
