import { Router } from 'express';
import { getInsights, chatWithAI } from '../controllers/aiController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/insights', authenticate, getInsights);
router.post('/chat', authenticate, chatWithAI);

export default router;
