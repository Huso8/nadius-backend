import express from 'express';
import Order from '../models/Order';
import { auth } from '../middleware/auth';
import { getUserOrders } from '../controllers/orderController';

const router = express.Router();

// Получить заказы пользователя
router.get('/my', auth, getUserOrders);

// Получить все заказы
router.get('/', async (req, res) => {
	try {
		const orders = await Order.find().populate('items.product');
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении заказов' });
	}
});

// Получить заказ по ID
router.get('/:id', async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate('items.product');
		if (!order) {
			return res.status(404).json({ message: 'Заказ не найден' });
		}
		res.json(order);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении заказа' });
	}
});

// Создать новый заказ
router.post('/', async (req, res) => {
	try {
		const order = new Order(req.body);
		const savedOrder = await order.save();
		const populatedOrder = await Order.findById(savedOrder._id).populate('items.product');
		res.status(201).json(populatedOrder);
	} catch (error) {
		res.status(400).json({ message: 'Ошибка при создании заказа' });
	}
});

// Обновить статус заказа
router.patch('/:id/status', async (req, res) => {
	try {
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