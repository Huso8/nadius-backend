import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import authRoutes from './routes/authRoutes';
import reviewRoutes from './routes/reviewRoutes';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
		const allowedOrigins = [
			'https://www.nadius.ru',
			'https://nadius.ru',
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
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
	exposedHeaders: ['Content-Range', 'X-Content-Range'],
	credentials: true,
	maxAge: 86400 // 24 часа
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error('Error details:', {
		message: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method
	});
	res.status(500).json({
		message: 'Что-то пошло не так!',
		error: process.env.NODE_ENV === 'development' ? err.message : undefined
	});
});

export default app; 