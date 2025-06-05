import dotenv from 'dotenv';
import { connectDB } from './config/database';
// import { seedDatabase } from './seed';
import app from './app';

dotenv.config();

// Принудительно устанавливаем порт 5000 для сервера
const PORT = 5000;

// Подключение к базе данных
connectDB()
	// .then(() => {
	// 	console.log('Connected to MongoDB');
	// 	// Запуск сидера только при первом запуске
	// 	return seedDatabase();
	// })
	.then(() => {
		app.listen(PORT);
	})
	.catch((error) => {
		console.error('Failed to start server:', error);
	}); 