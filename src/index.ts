import dotenv from 'dotenv';
import { connectDB } from './config/database';
import app from './app';

dotenv.config();

// Принудительно устанавливаем порт 5000 для сервера
const PORT = 5000;

// Подключение к базе данных
connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error('Failed to start server:', error);
		process.exit(1);
	}); 