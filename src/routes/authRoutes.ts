import express from 'express';
import { register, login, me } from '../controllers/authController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

export default router;