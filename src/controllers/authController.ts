import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			JWT_SECRET,
			{ expiresIn: '24h' }
		);

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
			return res.status(401).json({ message: 'Неверный email или пароль' });
		}

		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			JWT_SECRET,
			{ expiresIn: '24h' }
		);

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
		res.status(500).json({ message: 'Ошибка при входе' });
	}
};

export const me = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.user?.userId);
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

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