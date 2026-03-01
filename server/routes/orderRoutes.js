const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');

// Protected — user creates an order
router.post('/', protect, tenantMiddleware, createOrder);

// Protected (Admin) — get shop's orders
router.get('/', protect, tenantMiddleware, admin, getOrders);

module.exports = router;
