import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getMarketPrices = async (req: Request, res: Response): Promise<any> => {
  try {
    // In a real application, this would fetch from a live API.
    // We simulate market fluctuations around base prices.
    
    const randomFluctuation = (base: number, volatility: number) => {
      const change = (Math.random() * volatility * 2) - volatility;
      return {
        price: Number((base + (base * change)).toFixed(2)),
        percentChange: Number((change * 100).toFixed(2))
      };
    };

    const gold = randomFluctuation(9200, 0.02); // 2% volatility
    const silver = randomFluctuation(110, 0.03); // 3% volatility
    const bitcoin = randomFluctuation(7500000, 0.05); // 5% volatility

    return sendSuccess(res, 'Market prices fetched', {
      gold,
      silver,
      crypto: bitcoin
    }, 200);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch market prices', error.message, 500);
  }
};
