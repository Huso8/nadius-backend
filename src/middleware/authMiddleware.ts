import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

interface JwtPayload {
	userId: string;
	role: string;
	iat?: number;
	exp?: number;
}

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			return res.status(401).json({ message: 'Требуется авторизация' });
		}

		const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

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