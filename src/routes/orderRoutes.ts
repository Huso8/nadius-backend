import express from 'express';
import {
	getOrders,
	getOrder,
	createOrder,
	updateOrderStatus,
	getUserOrders
} from '../controllers/orderController';
import { auth } from '../middleware/authMiddleware';

const router = express.Router();

// Получить все заказы (только для админов)
router.get('/', auth, getOrders);

// Получить заказы текущего пользователя
router.get('/my-orders', auth, getUserOrders);

// Получить заказ по ID
router.get('/:id', auth, getOrder);

// Создать новый заказ
router.post('/', auth, createOrder);

// Обновить статус заказа (только для админов)
router.patch('/:id/status', auth, updateOrderStatus);

export default router; 