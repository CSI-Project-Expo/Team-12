const Bill = require('../models/Bill');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Verify a bill by its QR string
// @route   GET /api/bills/verify/:qrString
// @access  Private (admin)
// SAFETY: Read-only
const verifyBill = async (req, res) => {
    try {
        const { qrString } = req.params;

        if (!qrString) {
            return res.status(400).json({ success: false, message: 'QR string is required' });
        }

        // Find the bill by QR string
        const bill = await Bill.findOne({ qrString });

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

module.exports = { verifyBill };
