const Product = require('../models/Product');

// @desc    Get all products for the logged-in admin (non-deleted)
// @route   GET /api/products
// @access  Private (admin)
const getAllProducts = async (req, res) => {
    try {
        const filter = { isDeleted: false };

        // If the user is an admin, only show their own products
        if (req.user && req.user.role === 'admin') {
            filter.createdBy = req.user._id;
        }

        const products = await Product.find(filter)
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
        const filter = {
            isDeleted: false,
            $expr: { $lt: ['$stock', '$lowStockThreshold'] }
        };

        if (req.user && req.user.role === 'admin') {
            filter.createdBy = req.user._id;
        }

        const products = await Product.find(filter)
            .sort({ stock: 1 })
            .select('-__v');

        res.json(products);
    } catch (error) {
        console.error('Error fetching low-stock products:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (admin)
const createProduct = async (req, res) => {
    try {
        const { name, sku, category, price, stock, lowStockThreshold } = req.body;

        if (!name || !sku || price === undefined || stock === undefined) {
            return res.status(400).json({ message: 'Name, SKU, price, and stock are required' });
        }

        const product = await Product.create({
            name,
            sku,
            category: category || '',
            price: Number(price),
            stock: Number(stock),
            lowStockThreshold: Number(lowStockThreshold) || 5,
            createdBy: req.user._id
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error.message);

        if (error.code === 11000) {
            return res.status(400).json({ message: 'A product with this SKU already exists' });
        }

        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    getLowStockProducts,
    createProduct
};
