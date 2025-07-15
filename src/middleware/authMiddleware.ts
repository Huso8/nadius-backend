import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

// Define the user payload structure
interface UserPayload {
	_id: string;
	role: string;
}

// Augment the Express Request type globally
declare global {
	namespace Express {
		interface Request {
			user?: UserPayload;
		}
	}
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			return res.status(401).json({ message: 'Требуется авторизация' });
		}

		// Verify the token and cast to our defined payload type
		const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;

		req.user = decoded;
		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ message: 'Неверный токен авторизации' });
		}
		if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ message: 'Срок действия токена истек' });
		}
		res.status(401).json({ message: 'Ошибка авторизации' });
	}
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');

		if (token) {
			const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
			req.user = decoded;
		}

		next();
	} catch (error) {
		// В случае ошибки с токеном (например, истек срок),
		// мы не прерываем запрос, а просто не добавляем пользователя.
		// Можно добавить логирование для отладки.
		console.error("Optional auth error:", error);
		next();
	}
};

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		auth(req, res, () => {
			if (!req.user) {
				return res.status(401).json({ message: 'Требуется авторизация' });
			}
			if (req.user.role !== 'admin') {
				return res.status(403).json({ message: 'Доступ запрещен' });
			}
			next();
		});
	} catch (error) {
		res.status(401).json({ message: 'Ошибка авторизации' });
	}
}; 