import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Настройка хранилища для multer
const storage = multer.diskStorage({
	destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
		cb(null, path.join(__dirname, '../../public/uploads/products'));
	},
	filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
		// Создаем уникальное имя файла
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	}
});

// Фильтр файлов
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
	// Разрешаем только изображения
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(new Error('Только изображения разрешены!'));
	}
};

// Создаем middleware для загрузки
export const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024 // Ограничение размера файла до 5MB
	}
}); 