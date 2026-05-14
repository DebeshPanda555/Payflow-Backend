import { Router } from 'express';
import { getCards, createCard, toggleFreezeCard, deleteCard } from '../controllers/cardController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getCards);
router.post('/new', authenticate, createCard);
router.put('/:id/freeze', authenticate, toggleFreezeCard);
router.delete('/:id', authenticate, deleteCard);

export default router;
