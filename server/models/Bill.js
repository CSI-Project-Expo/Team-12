const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    saleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true,
        index: true
    },
    qrString: {
        type: String,
        required: true,
        unique: true
    },
    emailSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = billSchema;