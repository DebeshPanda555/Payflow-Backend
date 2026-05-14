import { Router } from 'express';
import { getAutopays, createAutopay, cancelAutopay } from '../controllers/autopayController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getAutopays);
router.post('/', authenticate, createAutopay);
router.put('/:id/cancel', authenticate, cancelAutopay);

export default router;
