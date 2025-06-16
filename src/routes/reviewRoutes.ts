import express from 'express';
import { addReview, getProductReviews, getProductRating } from '../controllers/reviewController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:productId', auth, addReview);
router.get('/:productId', getProductReviews);
router.get('/:productId/rating', getProductRating);

export default router; 