const express = require('express');
const router = express.Router();
const { getAllProducts, getLowStockProducts, createProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/', protect, getAllProducts);
router.get('/low-stock', protect, getLowStockProducts);
router.post('/', protect, admin, createProduct);

module.exports = router;
