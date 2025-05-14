import express from 'express';
import cors from 'cors';

const app = express();

// Настройки CORS
app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:3000',
	credentials: true
}));

// Парсинг JSON
app.use(express.json());

export default app;