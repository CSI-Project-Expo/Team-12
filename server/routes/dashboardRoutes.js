const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected, admin-only, and read-only (GET only)
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
