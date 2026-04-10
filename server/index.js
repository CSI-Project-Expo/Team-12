require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const tenantMiddleware = require('./middleware/tenantMiddleware');
const { protect } = require('./middleware/authMiddleware');

const app = express();

// ✅ 1. Manual headers — belt
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// ✅ 2. cors package — suspenders
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    optionsSuccessStatus: 200
}));

// ✅ 3. Handle OPTIONS manually
app.use((req, res, next) => {
    if (req.method === "OPTIONS") return res.status(200).end();
    next();
});

// ✅ 4. Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ 5. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/shops', require('./routes/shopRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/reports', require('./routes/reportsRoutes'));
app.use('/api/audit-logs', require('./routes/auditLogRoutes'));
app.use('/api/chat', protect, tenantMiddleware, require('./routes/chatRoutes'));

// ✅ 6. Health check
app.get('/', (req, res) => res.send('Smart Inventory API is running...'));

// ✅ 7. Global error handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({ message: "Server error" });
});

// ✅ 8. Connect DB then start
const startServer = async () => {
    try {
        await connectDB();
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