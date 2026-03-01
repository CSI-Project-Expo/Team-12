require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const startServer = async () => {
    try {
        await connectDB();

        // ✅ Fixed CORS configuration (allows all Vercel deployments and localhost)
        app.use(cors({
            origin: function (origin, callback) {
                // Allow requests with no origin (Postman, curl, etc.)
                if (!origin) return callback(null, true);

                // Allow any Vercel deployment or localhost
                if (origin.includes("vercel.app") || origin.includes("localhost")) {
                    return callback(null, true);
                }

                return callback(new Error("Not allowed by CORS"));
            },
            credentials: true
        }));

        app.use(express.json({ limit: '50mb' }));
        app.use(express.urlencoded({ limit: '50mb', extended: true }));

        app.use('/api/auth', require('./routes/authRoutes'));
        app.use('/api/products', require('./routes/productRoutes'));
        app.use('/api/dashboard', require('./routes/dashboardRoutes'));
        app.use('/api/shops', require('./routes/shopRoutes'));
        app.use('/api/orders', require('./routes/orderRoutes'));
        app.use('/api/bills', require('./routes/billRoutes'));
        app.use('/api/reports', require('./routes/reportsRoutes'));
        app.use('/api/audit-logs', require('./routes/auditLogRoutes'));
        app.use('/api/chat', require('./routes/chatRoutes'));

        app.get('/', (req, res) => {
            res.send('Smart Inventory API is running...');
        });

        // Global error handler
        app.use((err, req, res, next) => {
            console.error('Unhandled Error:', err.stack || err.message);
            res.status(500).json({
                message: err.message || 'Internal Server Error'
            });
        });

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Catch unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message || err);
});

startServer();