const express = require('express');
const router = express.Router();
const { getShops, getShopProducts } = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');

// All routes are protected and read-only (GET only)
router.get('/', protect, tenantMiddleware, getShops);
router.get('/:id/products', protect, tenantMiddleware, getShopProducts);

module.exports = router;
