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
        console.log('\n--- verifyBill INVOKED ---');
        console.log('Verification code received:', code);

        if (!code) {
            return res.status(400).json({ success: false, message: 'QR string is required' });
        }

        const parts = code.split('-');
        console.log('Code parts:', parts);

        let shopId;
        let qrQuery = code;

        if (parts.length === 3) {
            shopId = parts[0];
            console.log('Format: Modern (3 parts). ShopId:', shopId);
        } else if (parts.length === 2) {
            // Legacy for some generated test codes: random-saleId
            // We can't easily find the shop without the prefix unless we search all tenants
            // Let's assume the current user's shop if they are logged in? 
            // No, verifyBill should be public. 
            console.warn('Format: Legacy (2 parts). Missing shopId prefix.');
            return res.status(400).json({
                success: false,
                message: 'This QR code is in an old format. Please generate a new one.'
            });
        } else {
            console.warn('Invalid code format. Parts:', parts.length);
            return res.status(400).json({ success: false, message: 'Invalid QR code format.' });
        }

        // Dynamically connect to the shop's tenant DB
        const getTenantConnection = require('../utils/tenantConnection');
        let shopTenantDb;
        try {
            shopTenantDb = getTenantConnection(shopId);
        } catch (dbErr) {
            console.error('Database connection error for shopId:', shopId, dbErr.message);
            return res.status(404).json({ success: false, message: 'Invalid Shop ID in QR code.' });
        }

        if (!shopTenantDb) {
            console.error('No tenant database found for shopId:', shopId);
            return res.status(404).json({ success: false, message: 'Shop record not found.' });
        }

        const ShopBill = shopTenantDb.model('Bill');
        const ShopSale = shopTenantDb.model('Sale');
        const ShopProduct = shopTenantDb.model('Product');
        const User = require('../models/User'); // Global model

        console.log('Searching for bill in tenant DB...');
        const bill = await ShopBill.findOne({ qrString: code });

        if (!bill) {
            console.log('Bill NOT FOUND in database.');
            return res.status(404).json({
                success: false,
                message: 'Verification failed: Bill record not found in system.'
            });
        }

        console.log('Bill FOUND. Fetching sale details...');
        const sale = await ShopSale.findById(bill.saleId)
            .populate({ path: 'customerId', model: User, select: 'name email' });

        if (!sale) {
            console.log('Sale record NOT FOUND for billId:', bill._id);
            return res.status(404).json({ success: false, message: 'Sale record not found for this bill.' });
        }

        console.log('Sale found. Mapping products...');
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

        console.log('Verification SUCCESSFUL.');
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
        console.error('CRITICAL: Bill verification error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error during verification.' });
    }
};

module.exports = { createBill, verifyBill };
