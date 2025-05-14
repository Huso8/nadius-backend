import express from 'express';
import Product from '../models/Product';
import mongoose from 'mongoose';

const router = express.Router();

// Получить все продукты
router.get('/', async (req, res) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении продуктов' });
	}
});

// Получить продукт по ID
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
	try {
		const product = new Product(req.body);
		const savedProduct = await product.save();
		res.status(201).json(savedProduct);
	} catch (error) {
		res.status(400).json({ message: 'Ошибка при создании продукта' });
	}
});

// Обновить продукт
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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