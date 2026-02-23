const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    actionType: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'TRANSACTION']
    },
    collectionName: {
        type: String,
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    previousData: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    newData: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
}, {
    timestamps: { createdAt: 'timestamp', updatedAt: false } // Only need timestamp for logs
});

// Indexes prioritizing queries by user and time
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
