import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // DDoS mitigation: limit heavily per window
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 300, 
  message: { error: 'Calm down! Rate limit exceeded.' },
  standardHeaders: true,
  legacyHeaders: false,
});
