import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    // Preserving exact frontend contract payload
    return res.status(201).json({ token: result.token, user: result.user });
  } catch (error: any) {
    const statusCode = error.message === 'User already exists' ? 400 : 500;
    return res.status(statusCode).json({ error: error.message === 'User already exists' ? error.message : 'Registration failed', details: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    // Preserving exact frontend contract payload
    return res.status(200).json({ token: result.token, user: result.user });
  } catch (error: any) {
    const statusCode = error.message === 'Invalid email or password' ? 400 : 500;
    return res.status(statusCode).json({ error: error.message === 'Invalid email or password' ? error.message : 'Login failed', details: error.message });
  }
};
