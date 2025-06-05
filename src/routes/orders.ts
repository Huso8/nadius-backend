import express, { Request, Response } from 'express';
import Order from '../models/Order';
import { auth, adminAuth } from '../middleware/auth';
import { getUserOrders, createOrder } from '../controllers/orderController';

const router = express.Router();

// Получить заказы пользователя
router.get('/user', auth, getUserOrders);

// Получить все заказы (только для админов)
router.get('/', adminAuth, async (req: Request, res: Response) => {
	try {
		const orders = await Order.find()
			.populate('items.product')
			.populate('user', 'name email');
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении заказов' });
	}
});

// Получить заказ по ID
router.get('/:id', auth, async (req: Request, res: Response) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate('items.product')
			.populate('user', 'name email');
		if (!order) {
			return res.status(404).json({ message: 'Заказ не найден' });
		}
		// Проверяем, является ли пользователь админом или владельцем заказа
		if (req.user?.role !== 'admin' && order.user._id.toString() !== req.user?.userId) {
			return res.status(403).json({ message: 'Доступ запрещен' });
		}
		res.json(order);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении заказа' });
	}
});

// Создать новый заказ
router.post('/', auth, createOrder);

// Обновить статус заказа
router.patch('/:id/status', auth, async (req: Request, res: Response) => {
	try {
		// Проверяем, является ли пользователь админом
		if (req.user?.role !== 'admin') {
			return res.status(403).json({ message: 'Доступ запрещен' });
		}
		const { status } = req.body;
		const order = await Order.findByIdAndUpdate(
			req.params.id,
			{ status },
			{ new: true }
		).populate('items.product');

		if (!order) {
			return res.status(404).json({ message: 'Заказ не найден' });
		}
		res.json(order);
	} catch (error) {
		res.status(400).json({ message: 'Ошибка при обновлении статуса заказа' });
	}
});

export default router; 