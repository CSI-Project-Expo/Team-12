const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;

        if (process.env.NODE_ENV === 'development' && !mongoUri) {
            console.log('Using MongoDB Memory Server...');
            const mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
        }

        const conn = await mongoose.connect(mongoUri || 'mongodb://localhost:27017/smart-inventory');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
