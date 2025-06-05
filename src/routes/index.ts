import express from 'express';
import productRoutes from './products';
import orderRoutes from './orders';
import authRoutes from './authRoutes';
import reviewRoutes from './reviewRoutes';
import addressRoutes from './addressRoutes';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/auth', authRoutes);
router.use('/reviews', reviewRoutes);
router.use('/address', addressRoutes);

export default router; 