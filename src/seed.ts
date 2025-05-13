import Product from './models/Product';
import Review from './models/Review';
import User from './models/User';
import Order from './models/Order';

export const seedDatabase = async () => {
	try {
		// Очистка существующих данных
		await Product.deleteMany({});
		await Review.deleteMany({});
		await User.deleteMany({});
		await Order.deleteMany({});

		// Создание тестовых продуктов
		const products = await Product.insertMany([
			{ name: 'Пицца Маргарита', description: 'Классическая пицца с томатами и моцареллой', price: 500, category: 'Пицца', image: 'https://example.com/margherita.jpg' },
			{ name: 'Бургер Классический', description: 'Сочный бургер с говяжьей котлетой', price: 350, category: 'Бургеры', image: 'https://example.com/burger.jpg' },
			{ name: 'Салат Цезарь', description: 'Свежий салат с курицей и соусом Цезарь', price: 250, category: 'Салаты', image: 'https://example.com/caesar.jpg' }
		]);

		// Создание тестового пользователя
		const user = await User.create({
			email: 'test@example.com',
			password: 'password123',
			name: 'Test User'
		});

		// Создание тестовых отзывов
		await Review.insertMany([
			{ product: products[0]._id, user: user._id, rating: 5, comment: 'Отличная пицца!' },
			{ product: products[1]._id, user: user._id, rating: 4, comment: 'Хороший бургер' },
			{ product: products[2]._id, user: user._id, rating: 3, comment: 'Неплохой салат' }
		]);

		// Создание тестового заказа
		await Order.create({
			user: user._id,
			products: [{ product: products[0]._id, quantity: 2 }],
			totalAmount: 1000,
			status: 'pending'
		});

		console.log('Database seeded successfully');
	} catch (error) {
		console.error('Error seeding database:', error);
	}
};

seedDatabase(); 