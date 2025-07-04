import { Request, Response } from 'express';
import Review from '../models/reviewModel';
import mongoose from 'mongoose';

export const addReview = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;
		const { rating, comment } = req.body;
		const user = req.user?.userId;

		if (!user) return res.status(401).json({ message: 'Необходима авторизация' });
		if (!productId || !rating) return res.status(400).json({ message: 'Некорректные данные' });

		if (!mongoose.Types.ObjectId.isValid(productId)) {
			return res.status(400).json({ message: 'Некорректный ID продукта' });
		}

		// Проверяем, есть ли уже отзыв от этого пользователя
		const existingReview = await Review.findOne({ product: productId, user });
		if (existingReview) {
			return res.status(400).json({ message: 'Вы уже оставили отзыв на этот товар' });
		}

		const review = new Review({
			product: productId,
			user,
			rating,
			comment
		});
		await review.save();
		res.status(201).json(review);
	} catch (error) {
		console.error('Error in addReview:', error);
		res.status(400).json({ message: 'Ошибка при добавлении отзыва' });
	}
};

export const getProductReviews = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(productId)) {
			return res.status(400).json({ message: 'Некорректный ID продукта' });
		}

		const reviews = await Review.find({ product: productId }).populate('user', 'name');
		res.json(reviews);
	} catch (error) {
		console.error('Error in getProductReviews:', error);
		res.status(500).json({ message: 'Ошибка при получении отзывов' });
	}
};

export const getProductRating = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(productId)) {
			return res.status(400).json({ message: 'Некорректный ID продукта' });
		}

		const reviews = await Review.find({ product: productId });
		if (reviews.length === 0) {
			return res.json({ rating: 0, count: 0 });
		}

		const rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
		const result = {
			rating: Number(rating.toFixed(1)),
			count: reviews.length
		};
		res.json(result);
	} catch (error) {
		console.error('Error in getProductRating:', error);
		if (error instanceof Error) {
			res.status(500).json({
				message: 'Ошибка при получении рейтинга',
				error: error.message
			});
		} else {
			res.status(500).json({ message: 'Ошибка при получении рейтинга' });
		}
	}
}; 