import { Router } from 'express';
import { getMarketPrices } from '../controllers/marketController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getMarketPrices);

export default router;
