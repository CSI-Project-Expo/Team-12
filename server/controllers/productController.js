const Product = require('../models/Product');

// @desc    Get all products (non-deleted)
// @route   GET /api/products
// @access  Private
// SAFETY: Read-only — uses only find(), no writes/updates/deletes
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get low-stock products (stock < lowStockThreshold)
// @route   GET /api/products/low-stock
// @access  Private
// SAFETY: Read-only — uses only find() with $expr, no writes/updates/deletes
const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({
            isDeleted: false,
            $expr: { $lt: ['$stock', '$lowStockThreshold'] }
        })
            .sort({ stock: 1 })
            .select('-__v');

        res.json(products);
    } catch (error) {
        console.error('Error fetching low-stock products:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    getLowStockProducts
};
