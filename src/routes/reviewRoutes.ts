import express from 'express';
import {
	addProductReview,
	getProductReviews,
	getProductRating,
	getAllReviews,
	addGeneralReview
} from '../controllers/reviewController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/all', getAllReviews);
router.post('/', addGeneralReview);

router.post('/:productId', auth, addProductReview);
router.get('/:productId', getProductReviews);
router.get('/:productId/rating', getProductRating);

export default router; 