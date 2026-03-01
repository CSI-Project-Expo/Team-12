const express = require('express');
const router = express.Router();
const { createBill, verifyBill } = require('../controllers/billController');
const { protect, admin } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');

// 🔹 Create bill (Admin only)
router.post('/', protect, tenantMiddleware, admin, createBill);

// 🔹 Verify bill by QR string (Public)
router.get('/verify/:code', verifyBill);

module.exports = router;