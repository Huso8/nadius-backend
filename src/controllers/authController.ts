import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import User from '../models/userModel';
import Order from '../models/orderModel';

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password, name } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
		}

		const user = new User({
			email,
			password,
			name
		});
		await user.save();

		const token = jwt.sign({ _id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '24h' });
		res.status(201).json({
			data: {
				token,
				user: {
					id: user._id,
					email: user.email,
					name: user.name,
					role: user.role
				}
			}
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ message: 'Ошибка при регистрации' });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Неверный email или пароль' });
		}
		const isMatch = await user.comparePassword(password);

		if (!isMatch) {
			console.log('Password does not match');
			return res.status(401).json({ message: 'Неверный email или пароль' });
		}

		const token = jwt.sign({ _id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '24h' });
		res.json({
			data: {
				token,
				user: {
					id: user._id,
					email: user.email,
					name: user.name,
					role: user.role
				}
			}
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ message: 'Ошибка при входе' });
	}
};

export const me = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.user?._id);
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		// Привязываем гостевые заказы к пользователю по email и телефону
		await Order.updateMany(
			{
				user: { $exists: false },
				'contactInfo.email': user.email,
				'contactInfo.phone': user.phone
			},
			{ $set: { user: user._id } }
		);

		res.json({
			data: {
				id: user._id,
				email: user.email,
				name: user.name,
				role: user.role
			}
		});
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении данных пользователя' });
	}
}; 