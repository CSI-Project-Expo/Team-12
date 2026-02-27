require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connection SUCCESSFUL!");
        process.exit(0);
    } catch (error) {
        console.error("MongoDB Connection FAILED:", error.message);
        process.exit(1);
    }
}

testConnection();
