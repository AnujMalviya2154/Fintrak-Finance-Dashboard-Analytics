import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { env } from '../config/env.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Verifies the Bearer token and attaches the current user (password excluded via the
// model's `select: false`) to req.user. Throws 401 on any failure; the central error
// handler formats the response.
const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Not authorized, token missing', 401);
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
        payload = jwt.verify(token, env.JWT_SECRET);
    } catch {
        // Expected for expired/tampered tokens — don't log a noisy stack trace.
        throw new AppError('Token invalid or expired', 401);
    }

    const user = await User.findById(payload.id);
    if (!user) {
        throw new AppError('User no longer exists', 401);
    }

    req.user = user;
    next();
});

export default authMiddleware;
