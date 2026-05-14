import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prismaClient';
import { sendSuccess, sendError } from '../utils/apiResponse';

const generateCardNumber = () => {
  let num = '4111'; // Visa starting prefix for mockup
  for (let i = 0; i < 12; i++) {
    num += Math.floor(Math.random() * 10).toString();
  }
  return num;
};

const generateCVV = () => {
  return Math.floor(100 + Math.random() * 900).toString(); // 3 digits
};

const generateExpiry = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 3); // 3 years validity
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${month}/${year}`;
};

export const getCards = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const cards = await prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, 'Cards fetched successfully', { cards }, 200);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch cards', error.message, 500);
  }
};

export const createCard = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { type, fundingType, accountType } = req.body;
    // Generate card details
    const cardNumber = generateCardNumber();
    const expiry = generateExpiry();
    const cvv = generateCVV();

    const card = await prisma.card.create({
      data: {
        userId,
        cardNumber,
        expiry,
        cvv,
        type: type || 'VIRTUAL',
        fundingType: fundingType || 'DEBIT',
        accountType: accountType || 'CHECKING',
        spendingLimit: 5000,
      }
    });

    return sendSuccess(res, 'Card created successfully', { card }, 201);
  } catch (error: any) {
    return sendError(res, 'Failed to create card', error.message, 500);
  }
};

export const toggleFreezeCard = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const card = await prisma.card.findUnique({
      where: { id }
    });

    if (!card || card.userId !== userId) {
      return sendError(res, 'Card not found', undefined, 404);
    }

    const newStatus = card.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';

    const updatedCard = await prisma.card.update({
      where: { id },
      data: { status: newStatus }
    });

    return sendSuccess(res, `Card ${newStatus.toLowerCase()} successfully`, { card: updatedCard }, 200);
  } catch (error: any) {
    return sendError(res, 'Failed to update card status', error.message, 500);
  }
};

export const deleteCard = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const card = await prisma.card.findUnique({
      where: { id }
    });

    if (!card || card.userId !== userId) {
      return sendError(res, 'Card not found', undefined, 404);
    }

    await prisma.card.delete({
      where: { id }
    });

    return sendSuccess(res, 'Card reported lost and deleted successfully', {}, 200);
  } catch (error: any) {
    return sendError(res, 'Failed to delete card', error.message, 500);
  }
};
