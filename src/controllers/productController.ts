import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении продуктов' });
	}
};

export const getProduct = async (req: Request, res: Response) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Продукт не найден' });
		}
		res.json(product);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при получении продукта' });
	}
};

export const createProduct = async (req: Request, res: Response) => {
	try {
		const product = new Product(req.body);
		const savedProduct = await product.save();
		res.status(201).json(savedProduct);
	} catch (error) {
		res.status(400).json({ message: 'Ошибка при создании продукта' });
	}
};

export const updateProduct = async (req: Request, res: Response) => {
	try {
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
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			return res.status(404).json({ message: 'Продукт не найден' });
		}
		res.json({ message: 'Продукт успешно удален' });
	} catch (error) {
		res.status(500).json({ message: 'Ошибка при удалении продукта' });
	}
}; 