import express from 'express';
import { upload } from '../middleware/uploadMiddleware';
import {
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct
} from '../controllers/productController';

const router = express.Router();

// Получить все продукты
router.get('/', getProducts);

// Получить продукт по ID
router.get('/:id', getProduct);

// Создать новый продукт
router.post('/', upload.single('image'), createProduct);

// Обновить продукт
router.put('/:id', updateProduct);

// Удалить продукт
router.delete('/:id', deleteProduct);

export default router; 