const express = require('express');
const router = express.Router();
const { getShops, getShopProducts } = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and read-only (GET only)
router.get('/', protect, getShops);
router.get('/:id/products', protect, getShopProducts);

module.exports = router;
