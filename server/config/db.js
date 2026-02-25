const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Suppress Mongoose strictQuery deprecation warning
mongoose.set('strictQuery', true);

const connectDB = async (retries = 3) => {
    let mongoUri = process.env.MONGO_URI;

    // Use in-memory DB for development if no MONGO_URI is provided
    if ((!mongoUri || mongoUri.trim() === '') && process.env.NODE_ENV === 'development') {
        console.log('No MONGO_URI found — using MongoDB Memory Server for development...');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
    }

    if (!mongoUri || mongoUri.trim() === '') {
        console.error('ERROR: MONGO_URI is not defined. Set it in your .env file.');
        process.exit(1);
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const conn = await mongoose.connect(mongoUri);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
            if (attempt === retries) {
                console.error('All connection attempts exhausted. Exiting.');
                process.exit(1);
            }
            // Wait before retrying (1s, 2s, 3s...)
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
    }
};

module.exports = connectDB;
