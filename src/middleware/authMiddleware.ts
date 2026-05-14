import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { sendError } from '../utils/apiResponse';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Unauthorized: No token provided', undefined, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error: any) {
    return sendError(res, 'Unauthorized: Invalid token', error.message, 401);
  }
};
