"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const socket_1 = require("../sockets/socket");
const logger_1 = require("../config/logger");
const transfer = async (senderId, recipientEmail, amount) => {
    if (!amount || amount <= 0) {
        throw new Error('Invalid transfer amount');
    }
    const recipient = await prismaClient_1.default.user.findUnique({ where: { email: recipientEmail } });
    if (!recipient) {
        throw new Error('Recipient not found');
    }
    if (recipient.id === senderId) {
        throw new Error('Cannot transfer to yourself');
    }
    // ACID transaction querying both wallets and ensuring balance sufficiency concurrently
    const transaction = await prismaClient_1.default.$transaction(async (tx) => {
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
    const senderUser = await prismaClient_1.default.user.findUnique({ where: { id: senderId } });
    // Relay original realtime push mechanism safely isolated from controller boundaries
    const io = (0, socket_1.getIO)();
    io.emit(`payment_received_${recipient.id}`, {
        message: `You received $${amount} from ${senderUser?.email}!`,
        amount,
        sender: senderUser?.email
    });
    logger_1.logger.info(`Transfer completed successfully: ${senderId} -> ${recipient.id} | Amount: $${amount}`);
    return transaction;
};
exports.transfer = transfer;
