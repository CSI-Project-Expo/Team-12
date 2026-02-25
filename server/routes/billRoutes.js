const express = require('express');
const router = express.Router();
const { verifyBill } = require('../controllers/billController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET /api/bills/verify/:qrString — admin verifies a customer's bill
router.get('/verify/:qrString', protect, admin, verifyBill);

module.exports = router;
