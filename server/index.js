require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const startServer = async () => {
    try {
        await connectDB();

        app.use(cors());
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

        app.get('/', (req, res) => {
            res.send('Smart Inventory API is running...');
        });

        // Global error handler — catches any unhandled errors from controllers
        app.use((err, req, res, next) => {
            console.error('Unhandled Error:', err.stack || err.message);
            const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
            res.status(statusCode).json({
                message: err.message || 'Internal Server Error',
                ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
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
    // Don't exit — just log. Let the global error handler deal with route-level errors.
});

startServer();
