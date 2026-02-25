const express = require('express');
const router = express.Router();
const { getDailySales, getMonthlyRevenue, getTopProducts, getSalesBreakdown } = require('../controllers/reportsController');
const { protect, admin } = require('../middleware/authMiddleware');

// All reports routes are admin-only and read-only
router.get('/sales-daily', protect, admin, getDailySales);
router.get('/revenue-monthly', protect, admin, getMonthlyRevenue);
router.get('/top-products', protect, admin, getTopProducts);
router.get('/sales-breakdown', protect, admin, getSalesBreakdown);

module.exports = router;
