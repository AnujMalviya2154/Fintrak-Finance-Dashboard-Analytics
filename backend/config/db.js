import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // can't serve without a DB — fail fast
    }
};
