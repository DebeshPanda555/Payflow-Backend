import prisma from '../utils/prismaClient';
import { getIO } from '../sockets/socket';
import { logger } from '../config/logger';

export const transfer = async (senderId: string, recipientEmail: string, amount: number) => {
  if (!amount || amount <= 0) {
    throw new Error('Invalid transfer amount');
  }

  const recipient = await prisma.user.findUnique({ where: { email: recipientEmail } });
  if (!recipient) {
    throw new Error('Recipient not found');
  }
  if (recipient.id === senderId) {
    throw new Error('Cannot transfer to yourself');
  }

  // ACID transaction querying both wallets and ensuring balance sufficiency concurrently
  const transaction = await prisma.$transaction(async (tx: any) => {
    const senderWallet = await tx.wallet.findFirst({ where: { userId: senderId } });
    if (!senderWallet || senderWallet.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    const recipientWallet = await tx.wallet.findFirst({ where: { userId: recipient.id } });
    if (!recipientWallet) {
      throw new Error('Recipient wallet not initialized');
    }

    // Process movements natively
    await tx.wallet.update({
      where: { id: senderWallet.id },
      data: { balance: { decrement: amount } }
    });

    await tx.wallet.update({
      where: { id: recipientWallet.id },
      data: { balance: { increment: amount } }
    });

    const debitTx = await tx.transaction.create({
      data: {
        userId: senderId,
        walletId: senderWallet.id,
        amount: parseFloat(amount.toString()),
        type: 'DEBIT',
        status: 'COMPLETED',
        recipientId: recipient.id,
      }
    });
    
    return debitTx;
  });

  const senderUser = await prisma.user.findUnique({ where: { id: senderId } });

  // Relay original realtime push mechanism safely isolated from controller boundaries
  const io = getIO();
  io.emit(`payment_received_${recipient.id}`, {
    message: `You received $${amount} from ${senderUser?.email}!`,
    amount,
    sender: senderUser?.email
  });

  logger.info(`Transfer completed successfully: ${senderId} -> ${recipient.id} | Amount: $${amount}`);
  return transaction;
};

export const getHistory = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { userId: userId },
        { recipientId: userId }
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true, name: true } }
    }
  });
  return transactions;
};
