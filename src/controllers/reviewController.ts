import { Request, Response } from 'express';
import Review from '../models/reviewModel';
import mongoose from 'mongoose';

export const addGeneralReview = async (req: Request, res: Response) => {
	try {
		const { rating, comment, guestName, guestEmail, guestPhone } = req.body;
		const user = req.user?._id;

		if (!rating) return res.status(400).json({ message: 'Рейтинг обязателен' });

		let reviewData: any = { rating, comment };
		if (user) {
			reviewData.user = user;
		} else {
			if (guestName) reviewData.guestName = guestName;
			if (guestEmail) reviewData.guestEmail = guestEmail;
			if (guestPhone) reviewData.guestPhone = guestPhone;
		}

		const review = new Review(reviewData);
		await review.save();
		res.status(201).json(review);
	} catch (error) {
		console.error('Error in addGeneralReview:', error);
		res.status(400).json({ message: 'Ошибка при добавлении отзыва' });
	}
};

export const getAllReviews = async (req: Request, res: Response) => {
	try {
		const reviews = await Review.find({}).populate('user', 'name').sort({ createdAt: -1 });
		res.json(reviews);
	} catch (error) {
		console.error('Error in getAllReviews:', error);
		res.status(500).json({ message: 'Server error' });
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