import { Router } from 'express';
import { getWalletBalance, addMoney } from '../controllers/walletController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/me', authenticate, getWalletBalance);
router.post('/fund', authenticate, addMoney);

export default router;
