import { Response } from 'express';

export const sendSuccess = (res: Response, message: string, data: any = {}, statusCode: number = 200) => {
  return res.status(statusCode).json({ message, ...data });
};

export const sendError = (res: Response, error: string, details?: any, statusCode: number = 500) => {
  return res.status(statusCode).json({ error, details });
};
