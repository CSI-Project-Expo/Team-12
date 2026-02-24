const express = require('express');
const router = express.Router();
const { getAllProducts, getLowStockProducts } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and read-only (GET only)
router.get('/', protect, getAllProducts);
router.get('/low-stock', protect, getLowStockProducts);

module.exports = router;
