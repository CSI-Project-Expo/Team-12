const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');

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

// @desc    Update product details (specifically for stock updates)
// @route   PUT /api/products/:id
// @access  Private (admin)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock, price } = req.body; // Can expand to other fields later

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Validate admin owns the product
        if (product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        const previousStock = product.stock;

        if (stock !== undefined) {
            product.stock = Number(stock);
        }

        if (price !== undefined) {
            product.price = Number(price);
        }

        const updatedProduct = await product.save();

        if (stock !== undefined && Number(stock) !== previousStock) {
            const diff = Number(stock) - previousStock;
            await AuditLog.create({
                userId: req.user._id,
                actionType: diff > 0 ? 'RESTOCK' : 'ADJUSTMENT',
                collectionName: 'Product',
                documentId: product._id,
                previousData: { stock: previousStock },
                newData: { stock: updatedProduct.stock, quantity: diff }
            });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Soft-delete a product
// @route   DELETE /api/products/:id
// @access  Private (admin)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Validate admin owns the product
        if (product.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        product.isDeleted = true;
        await product.save();

        // Audit log the deletion
        await AuditLog.create({
            userId: req.user._id,
            actionType: 'DELETE',
            collectionName: 'Product',
            documentId: product._id,
            previousData: { name: product.name, sku: product.sku, stock: product.stock },
            newData: { isDeleted: true }
        });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    getLowStockProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
