import { Request, Response } from 'express';
import axios from 'axios';

export const getAddressSuggestions = async (req: Request, res: Response) => {
	try {
		const { query } = req.query;
		const YANDEX_API_KEY = process.env.YANDEX_API_KEY;

		if (!YANDEX_API_KEY) {
			return res.status(500).json({ message: 'API ключ не настроен' });
		}

		if (!query || typeof query !== 'string') {
			return res.status(400).json({ message: 'Необходим поисковый запрос' });
		}

		const url = 'https://geocode-maps.yandex.ru/1.x/';
		const params = {
			apikey: YANDEX_API_KEY,
			format: 'json',
			geocode: query,
			lang: 'ru_RU',
			results: 5
		};

		const response = await axios.get(url, { params });

		if (!response.data.response.GeoObjectCollection.featureMember.length) {
			return res.json({ results: [] });
		}

		const suggestions = response.data.response.GeoObjectCollection.featureMember.map((item: any) => ({
			title: item.GeoObject.name,
			subtitle: item.GeoObject.metaDataProperty.GeocoderMetaData.text,
			lat: item.GeoObject.Point.pos.split(' ')[1],
			lon: item.GeoObject.Point.pos.split(' ')[0]
		}));

		res.json({ results: suggestions });
	} catch (error) {
		console.error('Error fetching address suggestions:', error);
		res.status(500).json({ message: 'Ошибка при получении подсказок адреса' });
	}
}; 