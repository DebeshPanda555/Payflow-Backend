import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as paymentService from '../services/paymentService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const transferMoney = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { amount, recipientEmail } = req.body;
    const senderId = req.user.id;

    const transaction = await paymentService.transfer(senderId, recipientEmail, amount);

    return sendSuccess(res, 'Transfer successful', { transaction }, 200);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : (error.message.includes('Invalid') || error.message.includes('Insufficient') ? 400 : 500);
    return sendError(res, 'Transfer failed', error.message, status);
  }
};

export const getTransactionHistory = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    
    const transactions = await paymentService.getHistory(userId);

    return sendSuccess(res, 'Transactions fetched successfully', { transactions }, 200);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch transactions', error.message, 500);
  }
};
