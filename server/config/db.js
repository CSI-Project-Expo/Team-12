const mongoose = require('mongoose');

// Suppress Mongoose strictQuery deprecation warning
mongoose.set('strictQuery', true);

const connectDB = async (retries = 3) => {
    const mongoUri = process.env.MONGO_URI;

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