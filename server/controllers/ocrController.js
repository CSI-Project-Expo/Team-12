const ocrService = require('../services/ocrService');
const ScanHistory = require('../models/ScanHistory');

const scanImage = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ success: false, message: 'Image data is required' });
        }

        console.log('Received image for OCR processing');

        // Extract text
        const extractedText = await ocrService.extractTextFromBase64(image);

        // Save to DB
        const newRecord = new ScanHistory({
            extractedText: extractedText,
            userId: req.user ? req.user._id : null
        });

        await newRecord.save();

        res.status(200).json({
            success: true,
            message: 'Image processed successfully',
            text: extractedText,
            recordId: newRecord._id
        });
    } catch (error) {
        console.error('Scan Controller Error:', error);
        res.status(500).json({ success: false, message: 'OCR processing failed', error: error.message });
    }
};

const getHistory = async (req, res) => {
    try {
        // If requires auth, adjust accordingly
        const history = await ScanHistory.find().sort({ scannedAt: -1 }).limit(50);
        res.status(200).json({ success: true, history });
    } catch (error) {
        console.error('Scan History Controller Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch scan history', error: error.message });
    }
};

module.exports = {
    scanImage,
    getHistory
};
