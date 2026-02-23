const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    priceAtSale: {
        type: Number,
        required: [true, 'Price at sale is required to maintain historical accuracy'],
        min: [0, 'Price cannot be negative']
    }
}, { _id: false }); // Prevent creating separate ObjectIds for subdocuments unless necessary

const saleSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional if walk-in customers don't have accounts
    },
    items: {
        type: [saleItemSchema],
        validate: [
            {
                validator: function (items) {
                    return items.length > 0;
                },
                message: 'A sale must have at least one item'
            }
        ]
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount cannot be negative']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes for common queries
saleSchema.index({ createdAt: -1 });
saleSchema.index({ customerId: 1 });
saleSchema.index({ status: 1 });

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;
