const express = require('express');
const router = express.Router();
const { scanImage, getHistory } = require('../controllers/ocrController');
// const { protect } = require('../middleware/authMiddleware'); // Uncomment if routes should be protected

// Endpoint: POST /api/scan
router.post('/', scanImage);

// Endpoint: GET /api/scan/history
router.get('/history', getHistory);

module.exports = router;
