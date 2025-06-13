import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/database';
import { corsOptions } from './config/cors';
import { config } from './config/config';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import reviewRoutes from './routes/reviewRoutes';
import addressRoutes from './routes/addressRoutes';

dotenv.config();
const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Настройка статических файлов
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/address', addressRoutes);

// Подключение к базе данных и запуск сервера
connectDB()
	.then(() => {
		app.listen(config.port, () => {
			console.log(`Server is running on port ${config.port}`);
		});
	})
	.catch((error) => {
		console.error('Failed to start server:', error);
		process.exit(1);
	});

export default app; 