import { Router } from 'express';
import { updateProfile, changePassword } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

export default router;
