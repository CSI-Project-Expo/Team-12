const mongoose = require('mongoose');

// Suppress Mongoose strictQuery deprecation warning
mongoose.set('strictQuery', true);

const connectDB = async (retries = 3) => {
    let mongoUri = process.env.MONGO_URI;

    if (process.env.USE_MEMORY_DB === 'true') {
        try {
            console.log('Starting MongoDB Memory Server...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            process.env.MONGO_URI = mongoUri; // Update global variable for tenant connections
            console.log(`Using MongoDB Memory Server at ${mongoUri}`);
        } catch (err) {
            console.error('Failed to start memory server:', err);
        }
    }

    if (!mongoUri || mongoUri.trim() === '') {
        console.error('ERROR: MONGO_URI is not defined.');
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
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
    }
};

module.exports = connectDB;