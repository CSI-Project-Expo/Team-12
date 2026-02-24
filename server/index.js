require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const startServer = async () => {
    try {
        await connectDB();

        app.use(cors());
        app.use(express.json());

        app.use('/api/auth', require('./routes/authRoutes'));
        app.use('/api/products', require('./routes/productRoutes'));
        app.use('/api/dashboard', require('./routes/dashboardRoutes'));

        app.get('/', (req, res) => {
            res.send('Smart Inventory API is running...');
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

startServer();
