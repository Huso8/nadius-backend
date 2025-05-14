import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
	userId: string;
	role: string;
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

		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Неверный токен авторизации' });
	}
};

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await auth(req, res, () => {
			if (req.user?.role !== 'admin') {
				return res.status(403).json({ message: 'Доступ запрещен' });
			}
			next();
		});
	} catch (error) {
		res.status(401).json({ message: 'Неверный токен авторизации' });
	}
}; 