const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crypto = require('crypto');
const QRCode = require('qrcode');
const User = require('./models/User');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
const Bill = require('./models/Bill');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stockflow')
    .then(async () => {
        try {
            console.log('Connected to DB');
            const admin = await User.findOne({ role: 'admin' });
            const user = await User.findOne({ role: 'user' });
            const product = await Product.findOne({ createdBy: admin._id, isDeleted: false });

            if (!admin) { console.log('Admin user missing'); process.exit(1); }
            if (!user) { console.log('Regular user missing'); process.exit(1); }
            if (!product) { console.log('Product missing for admin:', admin._id); process.exit(1); }

            const sale = await Sale.create({
                customerId: user._id,
                items: [{
                    productId: product._id,
                    quantity: 1,
                    priceAtSale: product.price
                }],
                totalAmount: product.price,
                status: 'completed',
                createdBy: admin._id
            });

            const qrString = `${admin._id.toString()}-${crypto.randomBytes(16).toString('hex')}-${sale._id.toString()}`;
            console.log('Generating bill for sale:', sale._id, 'with qrString:', qrString);

            await Bill.create({ saleId: sale._id, qrString, emailSent: false });

            QRCode.toFile('./true-qr.png', qrString, function (err) {
                if (err) throw err;
                console.log('Real QR code generated at ./true-qr.png with string:', qrString);
                process.exit(0);
            });
        } catch (error) {
            console.error('Error:', error);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('DB Error:', err);
        process.exit(1);
    });
