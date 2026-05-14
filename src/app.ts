import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import walletRoutes from './routes/walletRoutes';
import autopayRoutes from './routes/autopayRoutes';
import aiRoutes from './routes/aiRoutes';
import cardRoutes from './routes/cardRoutes';
import userRoutes from './routes/userRoutes';
import marketRoutes from './routes/marketRoutes';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(helmet());
app.use(morgan('common')); // Use common format for production safety mapping
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter purely to /api routes
app.use('/api', apiLimiter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/autopay', autopayRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/market', marketRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'PayFlow backend is running optimally.' });
});

app.get('/', (req, res) => {
  res.redirect('/api/docs');
});

app.use(errorHandler);

export default app;
