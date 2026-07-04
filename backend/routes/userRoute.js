import express from 'express';
import { registerUser, loginUser, getCurrentUser, updateProfile, changePassword } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/security.js';

const userRouter = express.Router();

// Stricter limit on the unauthenticated auth surface to blunt brute-force / credential stuffing.
const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 40,
    message: 'Too many auth attempts, please try again later.',
});

// Public routes
userRouter.post('/register', authLimiter, registerUser);
userRouter.post('/login', authLimiter, loginUser);

// Protected routes
userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.put('/password', authMiddleware, changePassword);

export default userRouter;
