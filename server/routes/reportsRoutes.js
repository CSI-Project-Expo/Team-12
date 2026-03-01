const express = require('express');
const router = express.Router();
const { getDailySales, getMonthlyRevenue, getTopProducts, getSalesBreakdown } = require('../controllers/reportsController');
const { protect, admin } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');

// All reports routes are admin-only and read-only
router.get('/sales-daily', protect, tenantMiddleware, admin, getDailySales);
router.get('/revenue-monthly', protect, tenantMiddleware, admin, getMonthlyRevenue);
router.get('/top-products', protect, tenantMiddleware, admin, getTopProducts);
router.get('/sales-breakdown', protect, tenantMiddleware, admin, getSalesBreakdown);

module.exports = router;
