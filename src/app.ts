import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import authRoutes from './routes/authRoutes';
import reviewRoutes from './routes/reviewRoutes';
import addressRoutes from './routes/addressRoutes';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		const allowedOrigins = [
			'https://www.nadius.ru',
			'https://nadius.ru',
			'https://api.nadius.ru',
			'http://localhost:3000',
			'http://localhost:5173',
			'http://127.0.0.1:3000',
			'http://127.0.0.1:5173'
		];

		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('CORS: Not allowed by CORS policy'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
};

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

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.status(500).json({
		message: 'Что-то пошло не так!',
		error: process.env.NODE_ENV === 'development' ? err.message : undefined
	});
});

export default app; 