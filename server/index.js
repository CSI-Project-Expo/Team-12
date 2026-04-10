require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const tenantMiddleware = require('./middleware/tenantMiddleware');
const { protect } = require('./middleware/authMiddleware');

const app = express();

// 🔥 GLOBAL CORS FIX (works for everything)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

const startServer = async () => {
    try {
        await connectDB();

        // ✅ Body parser
        app.use(express.json({ limit: '50mb' }));
        app.use(express.urlencoded({ extended: true }));

        // ✅ Routes
        app.use('/api/auth', require('./routes/authRoutes'));
        app.use('/api/products', require('./routes/productRoutes'));
        app.use('/api/dashboard', require('./routes/dashboardRoutes'));
        app.use('/api/shops', require('./routes/shopRoutes'));
        app.use('/api/orders', require('./routes/orderRoutes'));
        app.use('/api/bills', require('./routes/billRoutes'));
        app.use('/api/reports', require('./routes/reportsRoutes'));
        app.use('/api/audit-logs', require('./routes/auditLogRoutes'));

        // 🔥 Chat route (protected)
        app.use('/api/chat', protect, tenantMiddleware, require('./routes/chatRoutes'));

        // ✅ Health check
        app.get('/', (req, res) => {
            res.send('Smart Inventory API is running...');
        });

        // ✅ Error handler
        app.use((err, req, res, next) => {
            console.error("Server Error:", err.message);
            res.status(500).json({ message: "Server error" });
        });

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Startup Error:', error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

startServer();