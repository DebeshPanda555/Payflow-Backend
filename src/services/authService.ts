import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prismaClient';
import { config } from '../config/env';

export const register = async (email: string, password: string, name: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      wallets: { create: { balance: 0, currency: "INR" } }
    },
  });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_SECRET, { expiresIn: '1d' });

  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_SECRET, { expiresIn: '1d' });

  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};
