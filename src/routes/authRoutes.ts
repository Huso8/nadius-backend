import express from 'express';
import { register, login, me, getUsers, deleteUser } from '../controllers/authController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

// Admin routes
router.get('/users', auth, getUsers);
router.delete('/users/:id', auth, deleteUser);

export default router;