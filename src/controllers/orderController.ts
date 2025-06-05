import { Request, Response } from 'express';
import Order from '../models/Order';

export const getOrders = async (req: Request, res: Response) => {
	try {
		const orders = await Order.find()
			.populate({
				path: 'items.product',
				select: 'name price image'
			})
			.sort({ createdAt: -1 });
		res.json(orders);
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.status(500).json({ message: 'Ошибка при получении заказов' });
	}
};

export const getOrder = async (req: Request, res: Response) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate('items.product');
		if (!order) {
			return res.status(404).json({ message: 'Заказ не найден' });
		}
		res.json(order);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении заказа' });
	}
};

export const createOrder = async (req: Request, res: Response) => {
	try {
		console.log('Полученные данные заказа:', JSON.stringify(req.body, null, 2));
		console.log('Данные пользователя:', JSON.stringify(req.user, null, 2));

		if (!req.user?.userId) {
			console.error('Отсутствует userId в req.user');
			return res.status(401).json({ message: 'Необходима авторизация' });
		}

		const order = new Order({
			user: req.user.userId,
			items: req.body.items,
			totalAmount: req.body.totalAmount,
			deliveryAddress: req.body.deliveryAddress,
			contactInfo: req.body.contactInfo,
			comment: req.body.comment
		});

		console.log('Созданный объект заказа:', JSON.stringify(order, null, 2));

		const savedOrder = await order.save();
		console.log('Сохраненный заказ:', JSON.stringify(savedOrder, null, 2));

		const populatedOrder = await Order.findById(savedOrder._id)
			.populate('items.product')
			.populate('user', 'name email');
		console.log('Заказ после популяции:', JSON.stringify(populatedOrder, null, 2));

		res.status(201).json(populatedOrder);
	} catch (error) {
		console.error('Ошибка при создании заказа:', error);
		if (error instanceof Error) {
			console.error('Детали ошибки:', {
				message: error.message,
				stack: error.stack
			});
		}
		res.status(400).json({
			message: 'Ошибка при создании заказа',
			error: error instanceof Error ? error.message : 'Неизвестная ошибка'
		});
	}
};

export const updateOrderStatus = async (req: Request, res: Response) => {
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
};

export const getUserOrders = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.userId;
		console.log('getUserOrders - userId:', userId);
		console.log('getUserOrders - req.user:', req.user);

		if (!userId) {
			return res.status(401).json({ message: 'Необходима авторизация' });
		}

		const orders = await Order.find({ user: userId })
			.populate({
				path: 'items.product',
				select: 'name price image'
			})
			.populate({
				path: 'user',
				select: 'name email'
			})
			.sort({ createdAt: -1 });

		console.log('getUserOrders - найденные заказы:', orders);
		res.json(orders);
	} catch (error) {
		console.error('Ошибка при получении заказов пользователя:', error);
		res.status(500).json({ message: 'Ошибка при получении заказов пользователя' });
	}
}; 