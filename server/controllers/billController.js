const User = require('../models/User');
const crypto = require('crypto');

// @desc    Create a new bill and generate unique QR string
// @route   POST /api/bills
// @access  Private (admin)
const createBill = async (req, res) => {
    const { Product, Sale, Bill, AuditLog } = req.tenantDb || {};
    try {
        const { saleId } = req.body;

        if (!saleId) {
            return res.status(400).json({ success: false, message: 'Sale ID is required' });
        }

        // Generate a proper unique QR string with shopId prefix
        const shopId = req.user._id.toString();
        const qrString = `${shopId}-${crypto.randomBytes(16).toString('hex')}-${saleId.toString()}`;

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
// @access  Public
// SAFETY: Read-only
const verifyBill = async (req, res) => {
    try {
        const { code } = req.params;
        console.log('--- verifyBill INVOKED ---');
        console.log('Verification code:', code);

        if (!code) {
            return res.status(400).json({ success: false, message: 'QR string is required' });
        }

        const parts = code.split('-');
        console.log('Code parts:', parts);

        if (parts.length !== 3) {
            console.warn('Invalid code format. Expected 3 parts, got:', parts.length);
            return res.status(404).json({ success: false, message: 'Invalid QR code format.' });
        }

        const shopId = parts[0];
        console.log('Target Shop ID parsed:', shopId);

        // Dynamically connect to the shop's tenant DB based on the parsed shopId
        const getTenantConnection = require('../utils/tenantConnection');
        const shopTenantDb = getTenantConnection(shopId);

        if (!shopTenantDb) {
            console.error('Failed to get tenant connection for shopId:', shopId);
            return res.status(500).json({ success: false, message: 'Internal Server Error: Database connection failed.' });
        }

        const ShopBill = shopTenantDb.model('Bill');
        const ShopSale = shopTenantDb.model('Sale');
        const ShopProduct = shopTenantDb.model('Product');
        const User = require('../models/User'); // Global model

        // Use: const bill = await Bill.findOne({ qrString: req.params.code });
        const bill = await ShopBill.findOne({ qrString: code });
        console.log('Bill lookup result:', bill ? 'FOUND' : 'NOT FOUND');

        if (!bill) {
            return res.status(404).json({ success: false, message: 'Bill not found. Invalid QR code.' });
        }

        // Get the associated sale with populated customer details
        const sale = await ShopSale.findById(bill.saleId).populate({ path: 'customerId', model: User, select: 'name email' });
        console.log('Sale lookup result:', sale ? 'FOUND' : 'NOT FOUND');

        if (!sale) {
            return res.status(404).json({ success: false, message: 'Sale record not found for this bill.' });
        }

        // Get product names for each item
        const itemsWithNames = await Promise.all(
            sale.items.map(async (item) => {
                const product = await ShopProduct.findById(item.productId).select('name sku');
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
