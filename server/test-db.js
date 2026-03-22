require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    console.log("Testing connection to:", process.env.MONGO_URI.replace(/:([^:@]{3,})@/, ':***@'));
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ SUCCESS: Successfully connected to MongoDB Atlas!");
        process.exit(0);
    } catch (err) {
        console.error("❌ FAILED: Could not connect to Atlas.", err.message);
        process.exit(1);
    }
}

testConnection();
