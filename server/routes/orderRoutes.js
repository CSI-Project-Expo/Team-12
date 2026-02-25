const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected — user creates an order
router.post('/', protect, createOrder);

// Protected (Admin) — get shop's orders
router.get('/', protect, admin, getOrders);

module.exports = router;
