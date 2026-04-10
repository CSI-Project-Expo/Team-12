require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const tenantMiddleware = require('./middleware/tenantMiddleware');
const { protect } = require('./middleware/authMiddleware');

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://stock-smart-blond.vercel.app",
    "https://stocksmart-seven.vercel.app"
];

const startServer = async () => {
    try {
        await connectDB();

        // ✅ CORS (clean + correct)
        app.use(cors({
            origin: allowedOrigins,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            credentials: true
        }));

        // ✅ 🔥 VERY IMPORTANT: handle preflight requests
        app.options('*', cors());

        // ✅ Body parsers
        app.use(express.json({ limit: '50mb' }));
        app.use(express.urlencoded({ limit: '50mb', extended: true }));

        // ✅ Routes
        app.use('/api/auth', require('./routes/authRoutes'));
        app.use('/api/products', require('./routes/productRoutes'));
        app.use('/api/dashboard', require('./routes/dashboardRoutes'));
        app.use('/api/shops', require('./routes/shopRoutes'));
        app.use('/api/orders', require('./routes/orderRoutes'));
        app.use('/api/bills', require('./routes/billRoutes'));
        app.use('/api/reports', require('./routes/reportsRoutes'));
        app.use('/api/audit-logs', require('./routes/auditLogRoutes'));

        // ✅ Chat route (protected + tenant aware)
        app.use('/api/chat', protect, tenantMiddleware, require('./routes/chatRoutes'));

        // ✅ Health check
        app.get('/', (req, res) => {
            res.send('Smart Inventory API is running...');
        });

        // ✅ Global error handler
        app.use((err, req, res, next) => {
            console.error('Unhandled Error:', err.stack || err.message);
            res.status(500).json({
                message: err.message || 'Internal Server Error'
            });
        });

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// ✅ Catch unhandled promises
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message || err);
});

startServer();