import express from 'express';
import {
	getAllReviews,
	addGeneralReview
} from '../controllers/reviewController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/all', getAllReviews);
router.post('/', addGeneralReview);
router.post('/general', auth, addGeneralReview);

export default router; 