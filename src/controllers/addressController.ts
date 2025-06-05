import { Request, Response } from 'express';
import axios from 'axios';

const YANDEX_API_KEY = process.env.YANDEX_API_KEY || '18f073a4-54af-4678-9260-bf48dd2a0d69';

export const getAddressSuggestions = async (req: Request, res: Response) => {
	try {
		const { query } = req.query;

		if (!query || typeof query !== 'string') {
			return res.status(400).json({ message: 'Query parameter is required' });
		}

		const url = 'https://suggest-maps.yandex.ru/v1/suggest';
		const params = {
			apikey: YANDEX_API_KEY,
			text: query,
			lang: 'ru_RU',
			results: 5,
			type: 'address'
		};

		const response = await axios.get(url, {
			params,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});

		if (!response.data || !response.data.results) {
			return res.json({ results: [] });
		}

		const results = response.data.results.map((item: any) => ({
			title: item.title,
			subtitle: item.subtitle,
			lat: item.point?.lat,
			lon: item.point?.lon
		}));

		res.json({ results });
	} catch (error: unknown) {
		console.error('Error fetching address suggestions:', error);
		if (axios.isAxiosError(error)) {
			console.error('Axios error details:', {
				status: error.response?.status,
				statusText: error.response?.statusText,
				data: error.response?.data
			});
		}
		res.status(500).json({
			message: 'Ошибка при получении подсказок адресов',
			error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
		});
	}
}; 