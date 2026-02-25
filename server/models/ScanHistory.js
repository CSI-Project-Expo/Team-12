const mongoose = require('mongoose');

const scanHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional, in case users can scan without logging in
    },
    imageUrl: {
        type: String, // Can store base64 string or a URL if uploaded to a storage service
        required: false
    },
    extractedText: {
        type: String,
        required: true
    },
    scannedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('ScanHistory', scanHistorySchema);
