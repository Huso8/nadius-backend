import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
	throw new Error('JWT_SECRET must be defined in environment variables');
}

if (!process.env.MONGODB_URI) {
	throw new Error('MONGODB_URI must be defined in environment variables');
}

export const config = {
	port: process.env.PORT,
	mongoUri: process.env.MONGODB_URI,
	yandexApi: process.env.YANDEX_API_KEY,
	jwtSecret: process.env.JWT_SECRET
};

