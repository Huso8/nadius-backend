import express from 'express';
import { getAddressSuggestions } from '../controllers/addressController';

const router = express.Router();

router.get('/suggest', getAddressSuggestions);

export default router; 