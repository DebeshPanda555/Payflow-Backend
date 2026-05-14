import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prismaClient';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getAutopays = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const autopays = await prisma.autopay.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, 'Autopays fetched successfully', { autopays }, 200);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch autopays', error.message, 500);
  }
};

export const createAutopay = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { recipientEmail, amount, frequency } = req.body;

    if (!amount || amount <= 0 || !recipientEmail || !frequency) {
      return sendError(res, 'Invalid autopay details', 'Please provide valid amount, recipient email and frequency', 400);
    }

    const recipient = await prisma.user.findUnique({ where: { email: recipientEmail } });
    if (!recipient) {
      return sendError(res, 'Recipient not found', 'No user found with the provided email', 404);
    }

    if (recipient.id === userId) {
      return sendError(res, 'Invalid recipient', 'Cannot setup autopay to yourself', 400);
    }

    // Calculate next run date based on frequency
    const nextRunAt = new Date();
    if (frequency === 'DAILY') nextRunAt.setDate(nextRunAt.getDate() + 1);
    else if (frequency === 'WEEKLY') nextRunAt.setDate(nextRunAt.getDate() + 7);
    else if (frequency === 'MONTHLY') nextRunAt.setMonth(nextRunAt.getMonth() + 1);
    else return sendError(res, 'Invalid frequency', 'Frequency must be DAILY, WEEKLY, or MONTHLY', 400);

    const autopay = await prisma.autopay.create({
      data: {
        userId,
        recipientId: recipient.id,
        amount: parseFloat(amount.toString()),
        frequency,
        nextRunAt
      }
    });

    return sendSuccess(res, 'Autopay created successfully', { autopay }, 201);
  } catch (error: any) {
    return sendError(res, 'Failed to create autopay', error.message, 500);
  }
};

export const cancelAutopay = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const autopay = await prisma.autopay.findFirst({
      where: { id, userId }
    });

    if (!autopay) {
      return sendError(res, 'Autopay not found', 'No matching autopay found', 404);
    }

    const updated = await prisma.autopay.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    return sendSuccess(res, 'Autopay cancelled successfully', { autopay: updated }, 200);
  } catch (error: any) {
    return sendError(res, 'Failed to cancel autopay', error.message, 500);
  }
};
