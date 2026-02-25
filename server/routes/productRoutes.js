const express = require('express');
const router = express.Router();
const { getAllProducts, getLowStockProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/', protect, getAllProducts);
router.get('/low-stock', protect, getLowStockProducts);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
