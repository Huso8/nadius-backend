import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order, { IOrder } from '../models/orderModel';
import Product from '../models/productModel';

export const createOrder = async (req: Request, res: Response) => {
	try {
		const {
			items,
			deliveryAddress,
			contactInfo,
			comment
		} = req.body;

		if (!items || items.length === 0) {
			return res.status(400).json({ message: 'В заказе нет товаров' });
		}

		const productItems = items.map((item: any) => ({
			product: item.productId,
			quantity: item.quantity,
			price: item.price,
		}));

		const productIds = items.map((item: any) => item.productId);
		const products = await Product.find({ '_id': { $in: productIds } });

		const totalAmount = items.reduce((acc: number, item: any) => {
			const product = products.find(p => p._id.toString() === item.productId);
			return product ? acc + (product.price * item.quantity) : acc;
		}, 0);

		const orderData: Partial<IOrder> = {
			products: productItems,
			deliveryAddress,
			contactInfo,
			totalAmount,
			comment,
		};

		if (req.user) {
			orderData.user = new mongoose.Types.ObjectId(req.user._id);
		}

		const order = new Order(orderData);
		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	} catch (error) {
		console.error('Ошибка при создании заказа:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};

export const getOrders = async (req: Request, res: Response) => {
	try {
		if (req.user?.role !== 'admin') {
			return res.status(403).json({ message: 'Доступ запрещен' });
		}
		const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
		res.json(orders);
	} catch (error) {
		console.error('Ошибка при получении заказов:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};

export const getOrder = async (req: Request, res: Response) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate('products.product', 'name price image');

		if (!order) {
			return res.status(404).json({ message: 'Заказ не найден' });
		}

		res.json(order);
	} catch (error) {
		console.error('Ошибка при получении заказа:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};

export const getUserOrders = async (req: Request, res: Response) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Требуется авторизация' });
		}
		const orders = await Order.find({ user: req.user._id }).populate('products.product').sort({ createdAt: -1 });
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка сервера' });
	}
};

export const updateOrderStatus = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!status || !['pending', 'processing', 'on_the_way', 'completed', 'cancelled'].includes(status)) {
			return res.status(400).json({ message: 'Неверный статус заказа' });
		}

		if (req.user?.role !== 'admin') {
			return res.status(403).json({ message: 'Доступ запрещен' });
		}

		const order = await Order.findById(id);

		if (order) {
			order.status = status;
			await order.save();
			res.json(order);
		} else {
			res.status(404).json({ message: 'Заказ не найден' });
		}
	} catch (error) {
		console.error('Ошибка при обновлении статуса заказа:', error);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
}; 