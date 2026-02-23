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
        unique: true,
        index: true
    },
    emailSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

billSchema.index({ qrString: 1 }, { unique: true });
billSchema.index({ saleId: 1 });

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
