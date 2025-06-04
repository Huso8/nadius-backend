import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { seedDatabase } from './seed';
import app from './app';

dotenv.config();

// Принудительно устанавливаем порт 5000 для сервера
const PORT = 5000;

const startServer = async () => {
	try {
		// Подключаемся к базе данных
		await connectDB();

		// Запускаем сидер только в development
		// if (process.env.NODE_ENV === 'development') {
		// 	await seedDatabase();
		// }

		// Запускаем сервер
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

startServer(); 