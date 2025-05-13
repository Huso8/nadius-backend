import { Request, Response } from 'express';
import Order from '../models/Order';

export const getOrders = async (req: Request, res: Response) => {
	try {
		const orders = await Order.find().populate('items.product');
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении заказов' });
	}
};

export const getOrder = async (req: Request, res: Response) => {
	try {
		const order = await Order.findById(req.params.id).populate('items.product');
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
		const order = new Order(req.body);
		const savedOrder = await order.save();
		const populatedOrder = await Order.findById(savedOrder._id).populate('items.product');
		res.status(201).json(populatedOrder);
	} catch (error) {
		res.status(400).json({ message: 'Ошибка при создании заказа' });
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
		if (!userId) {
			return res.status(401).json({ message: 'Необходима авторизация' });
		}
		const orders = await Order.find({ user: userId }).populate('items.product');
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении заказов пользователя' });
	}
}; 