import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './config';

dotenv.config();

export const connectDB = async () => {
	try {
		// Проверяем, не подключены ли мы уже
		if (mongoose.connection.readyState === 1) {
			console.log('Already connected to MongoDB');
			return;
		}
		await mongoose.connect(config.mongoUri);
		console.log('Connected to MongoDB successfully');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

export default mongoose; 