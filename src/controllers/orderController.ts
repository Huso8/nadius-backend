import { Request, Response } from 'express';
import Order from '../models/Order';

export const getOrders = async (req: Request, res: Response) => {
	try {
		const orders = await Order.find()
			.populate('products.product')
			.populate('user', 'name email')
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
		const { items, deliveryAddress, contactInfo, comment } = req.body;
		const userId = req.user?.userId;

		if (!userId) {
			return res.status(401).json({ message: 'Требуется авторизация' });
		}

		if (!items || !Array.isArray(items) || items.length === 0) {
			return res.status(400).json({ message: 'Необходимо указать товары в заказе' });
		}

		if (!deliveryAddress || !deliveryAddress.address) {
			return res.status(400).json({ message: 'Необходимо указать адрес доставки' });
		}

		if (!contactInfo || !contactInfo.name || !contactInfo.email || !contactInfo.phone) {
			return res.status(400).json({ message: 'Необходимо указать контактную информацию' });
		}

		const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

		const order = new Order({
			user: userId,
			products: items.map(item => ({
				product: item.productId,
				quantity: item.quantity,
				price: item.price
			})),
			totalAmount,
			deliveryAddress,
			contactInfo,
			comment,
			status: 'pending'
		});

		const savedOrder = await order.save();
		const populatedOrder = await Order.findById(savedOrder._id)
			.populate('products.product')
			.populate('user', 'email name');

		res.status(201).json({
			data: populatedOrder
		});
	} catch (error) {
		console.error('Error creating order:', error);
		res.status(500).json({ message: 'Ошибка при создании заказа' });
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
			return res.status(401).json({ message: 'Требуется авторизация' });
		}

		const orders = await Order.find({ user: userId })
			.populate('products.product')
			.sort({ createdAt: -1 });
		res.json(orders);
	} catch (error) {
		console.error('Error fetching user orders:', error);
		res.status(500).json({ message: 'Ошибка при получении заказов' });
	}
}; 