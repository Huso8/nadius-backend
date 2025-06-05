import express from 'express';
import { getAddressSuggestions } from '../controllers/addressController';

const router = express.Router();

// Маршрут для подсказок адресов
router.get('/suggest', getAddressSuggestions);

export default router; 