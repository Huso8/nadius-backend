import express, { Request, Response } from 'express';
import Product from '../models/Product';
import mongoose from 'mongoose';
import { upload } from '../middleware/upload';

const router = express.Router();

// Получить все продукты
router.get('/', async (req: Request, res: Response) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении продуктов' });
	}
});

// Получить продукт по ID
router.get('/:id', async (req: Request, res: Response) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Некорректный ID продукта' });
		}
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Продукт не найден' });
		}
		res.json(product);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении продукта' });
	}
});

// Создать новый продукт
router.post('/', upload.single('image'), async (req: Request & { file?: Express.Multer.File }, res: Response) => {
	try {
		const { name, description, price, category } = req.body;

		// Проверяем, существует ли уже товар с таким именем
		const existingProduct = await Product.findOne({ name });
		if (existingProduct) {
			return res.status(400).json({ message: 'Товар с таким названием уже существует' });
		}

		const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;

		const product = new Product({
			name,
			description,
			price,
			category,
			imageUrl
		});

		await product.save();
		res.status(201).json(product);
	} catch (error) {
		res.status(400).json({ message: 'Ошибка при создании продукта' });
	}
});

// Обновить продукт
router.put('/:id', async (req: Request, res: Response) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Некорректный ID продукта' });
		}
		const product = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!product) {
			return res.status(404).json({ message: 'Продукт не найден' });
		}
		res.json(product);
	} catch (error) {
		res.status(400).json({ message: 'Ошибка при обновлении продукта' });
	}
});

// Удалить продукт
router.delete('/:id', async (req: Request, res: Response) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({ message: 'Некорректный ID продукта' });
		}
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Продукт не найден' });
		}
		res.json({ message: 'Продукт успешно удален' });
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при удалении продукта' });
	}
});

export default router; 