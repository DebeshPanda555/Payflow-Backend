import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prismaClient';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { GoogleGenAI, Type, Schema } from '@google/genai';

export const getInsights = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;

    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return sendSuccess(res, 'Fallback Insights Generated', {
        insights: [
          { type: 'Insight', text: 'You need to add GEMINI_API_KEY to your .env file to enable real-time AI analysis.' },
          { type: 'Forecast', text: 'Once your API key is added, I will analyze your transactions and provide custom financial forecasts.' }
        ]
      }, 200);
    }

    // Fetch user's transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit context
    });

    if (transactions.length === 0) {
      return sendSuccess(res, 'Default Insights Generated', {
        insights: [
          { type: 'Insight', text: 'You have no transactions yet. Start adding income or expenses to receive personalized insights!' },
          { type: 'Forecast', text: 'Your financial forecast will appear here once you begin spending.' }
        ]
      }, 200);
    }

    // Prepare data for Gemini
    let totalIncome = 0;
    let totalExpense = 0;
    const categories: Record<string, number> = {};

    transactions.forEach((tx: any) => {
      if (tx.type === 'CREDIT') totalIncome += tx.amount;
      if (tx.type === 'DEBIT') {
        totalExpense += tx.amount;
        const cat = tx.category || 'Other';
        categories[cat] = (categories[cat] || 0) + tx.amount;
      }
    });

    const txSummary = `
      Total Income: ${totalIncome}
      Total Expenses: ${totalExpense}
      Category Breakdown: ${JSON.stringify(categories)}
      Recent Transactions (up to 50): ${JSON.stringify(transactions.map((t: any) => ({ amount: t.amount, type: t.type, category: t.category, date: t.createdAt })))}
    `;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Define the expected JSON schema output
    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ['Insight', 'Forecast']
          },
          text: {
            type: Type.STRING
          }
        },
        required: ['type', 'text']
      }
    };

    const prompt = `You are an expert financial advisor AI assistant for a fintech app called PayFlow. 
    Analyze the following user transaction data and provide exactly two concise, highly personalized statements:
    1. One actionable "Insight" about their spending habits (e.g., a trend you noticed, a category they spend a lot on).
    2. One "Forecast" about their financial future for the rest of the month based on this data.
    
    Data:
    ${txSummary}
    
    Keep the statements extremely brief (1-2 sentences max), professional, and encouraging.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    if (!response.text) {
        throw new Error("AI returned empty response");
    }

    const insights = JSON.parse(response.text);

    return sendSuccess(res, 'AI Insights Generated successfully', { insights }, 200);

  } catch (error: any) {
    console.error("AI Insight Error:", error);
    return sendError(res, 'Failed to generate AI insights', error.message, 500);
  }
};

export const chatWithAI = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { messages } = req.body; // Array of { role: 'user' | 'assistant', content: string }

    if (!process.env.GEMINI_API_KEY) {
      return sendSuccess(res, 'Chat response generated', {
        reply: "I am currently running in offline mock mode. To chat with me and analyze your data, please add your `GEMINI_API_KEY` to the `.env` file."
      }, 200);
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const userWallets = await prisma.wallet.findMany({
      where: { userId }
    });

    const txSummary = `
      Wallets: ${JSON.stringify(userWallets.map((w: any) => ({ currency: w.currency, balance: w.balance })))}
      Recent Transactions (up to 50): ${JSON.stringify(transactions.map((t: any) => ({ amount: t.amount, type: t.type, category: t.category, date: t.createdAt })))}
    `;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Gemini chat API formatting
    const systemInstruction = `You are an expert financial advisor AI assistant for a fintech app called PayFlow. 
    You are chatting with the user. You have access to their live financial data.
    Be extremely helpful, concise, and professional. 
    Never reveal raw JSON. Answer their questions directly.
    User Data Context:
    ${txSummary}`;

    const formattedContents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      { role: "model", parts: [{ text: "Understood. I will act as the PayFlow AI Assistant using this data." }] }
    ];

    for (const msg of messages) {
      formattedContents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: formattedContents
    });

    if (!response.text) {
        throw new Error("AI returned empty response");
    }

    return sendSuccess(res, 'Chat response generated', { reply: response.text }, 200);

  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return sendError(res, 'Failed to generate chat response', error.message, 500);
  }
};
