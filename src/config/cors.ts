import cors from 'cors';

const allowedOrigins = [
	'https://www.nadius.ru',
	'https://nadius.ru',
	'https://api.nadius.ru',
	'http://localhost:3000',
	'http://localhost:5173',
	'http://127.0.0.1:3000',
	'http://127.0.0.1:5173'
];

export const corsOptions: cors.CorsOptions = {
	origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
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