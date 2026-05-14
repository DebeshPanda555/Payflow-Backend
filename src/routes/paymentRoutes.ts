import { Router } from 'express';
import { transferMoney, getTransactionHistory } from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/transfer', authenticate, transferMoney);
router.get('/transactions', authenticate, getTransactionHistory);

export default router;
