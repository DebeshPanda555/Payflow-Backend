import { Response } from 'express';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prismaClient';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const updateProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email }
    });

    return sendSuccess(res, 'Profile updated successfully', { user: { id: user.id, name: user.name, email: user.email } }, 200);
  } catch (error: any) {
    if (error.code === 'P2002') {
        return sendError(res, 'Email already in use', undefined, 400);
    }
    return sendError(res, 'Failed to update profile', error.message, 500);
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return sendError(res, 'User not found', undefined, 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return sendError(res, 'Incorrect current password', undefined, 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return sendSuccess(res, 'Password changed successfully', {}, 200);
  } catch (error: any) {
    return sendError(res, 'Failed to change password', error.message, 500);
  }
};
