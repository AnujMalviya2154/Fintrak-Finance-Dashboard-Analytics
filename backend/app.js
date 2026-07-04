import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { securityHeaders, createRateLimiter } from './middleware/security.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import userRouter from './routes/userRoute.js';
import incomeRouter from './routes/incomeRoute.js';
import expenseRouter from './routes/expenseRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';

// Builds and exports the Express app WITHOUT connecting to the DB or listening.
// Keeping this separate from server.js makes the app importable in tests (e.g. supertest).
const app = express();

app.set('trust proxy', 1); // correct req.ip behind a proxy (Render/Heroku/etc.)

// Security & body parsing
app.use(securityHeaders);
app.use(
    cors({
        origin: env.CLIENT_ORIGINS || true, // reflect origin in dev; lock down via CLIENT_ORIGINS in prod
        credentials: true,
    })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// General rate limit across the API surface
app.use('/api', createRateLimiter({ windowMs: 15 * 60 * 1000, max: 600 }));

// Health check
app.get('/', (req, res) => res.json({ success: true, message: 'API Working!' }));

// Routes
app.use('/api/user', userRouter);
app.use('/api/income', incomeRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/dashboard', dashboardRouter);

// 404 + centralized error handling — MUST be registered last.
app.use(notFound);
app.use(errorHandler);

export default app;
