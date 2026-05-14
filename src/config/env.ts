import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5001,
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
