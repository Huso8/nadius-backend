import { Request, Response } from 'express';
import axios from 'axios';

const YANDEX_API_KEY = '18f073a4-54af-4678-9260-bf48dd2a0d69';

export const getAddressSuggestions = async (req: Request, res: Response) => {
	try {
		const { query } = req.query;

		if (!query || typeof query !== 'string') {
			return res.status(400).json({ message: 'Query parameter is required' });
		}

		console.log('Fetching suggestions for query:', query);
		console.log('Using API key:', YANDEX_API_KEY);

		const url = 'https://geocode-maps.yandex.ru/1.x/';
		const params = {
			apikey: YANDEX_API_KEY,
			geocode: `Москва, ${query}`,
			format: 'json',
			results: 5,
			lang: 'ru_RU',
			kind: 'house'
		};

		console.log('Request URL:', url);
		console.log('Request params:', params);

		const response = await axios.get(url, {
			params,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});

		console.log('Response status:', response.status);
		console.log('Response headers:', response.headers);
		console.log('Response data:', response.data);

		if (!response.data || !response.data.response || !response.data.response.GeoObjectCollection) {
			console.log('No results in response');
			return res.json({ results: [] });
		}

		const results = response.data.response.GeoObjectCollection.featureMember.map((item: any) => ({
			title: item.GeoObject.name,
			subtitle: item.GeoObject.description,
			lat: item.GeoObject.Point.pos.split(' ')[1],
			lon: item.GeoObject.Point.pos.split(' ')[0]
		}));

		res.json({ results });
	} catch (error: unknown) {
		console.error('Error fetching address suggestions:', error);
		if (axios.isAxiosError(error)) {
			console.error('Axios error details:', {
				status: error.response?.status,
				statusText: error.response?.statusText,
				data: error.response?.data,
				headers: error.response?.headers,
				config: {
					url: error.config?.url,
					params: error.config?.params,
					headers: error.config?.headers
				}
			});
		}
		res.status(500).json({
			message: 'Ошибка при получении подсказок адресов',
			error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
		});
	}
}; 