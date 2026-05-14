import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prismaClient';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getWalletBalance = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;

    let wallet = await prisma.wallet.findFirst({
      where: { userId, currency: 'INR' }
    });

    if (!wallet) {
      wallet = await prisma.wallet.findFirst({
        where: { userId }
      });
    }

    if (!wallet) {
      // Create a default wallet if none exists
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          currency: 'INR'
        }
      });
    }

    return sendSuccess(res, 'Wallet fetched successfully', { wallet }, 200);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch wallet', error.message, 500);
  }
};

export const addMoney = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { amount, currency } = req.body;

    if (!amount || amount <= 0) {
      return sendError(res, 'Invalid amount', 'Amount must be greater than 0', 400);
    }

    let wallet = await prisma.wallet.findFirst({
      where: { userId, currency: currency || 'INR' }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, balance: amount, currency: currency || 'INR' }
      });
    } else {
      wallet = await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } }
      });
    }

    await prisma.transaction.create({
      data: {
        userId,
        walletId: wallet.id,
        amount: parseFloat(amount.toString()),
        type: 'CREDIT',
        status: 'COMPLETED',
        category: 'Deposit',
        description: 'Self-deposit via Add Money'
      }
    });

    return sendSuccess(res, 'Money added successfully', { wallet }, 200);
  } catch (error: any) {
    return sendError(res, 'Failed to add money', error.message, 500);
  }
};
