import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { isNonEmptyString } from '../utils/validators.js';

const createToken = (userId) =>
    jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.TOKEN_EXPIRES });

// REGISTER A USER
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
        throw new AppError('Please fill all the fields', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!validator.isEmail(normalizedEmail)) {
        throw new AppError('Please enter a valid email', 400);
    }
    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters long', 400);
    }

    if (await User.findOne({ email: normalizedEmail })) {
        throw new AppError('User already exists', 409);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashed });
    const token = createToken(user._id);

    res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email },
        message: 'User registered successfully'
    });
});

// LOGIN A USER
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        throw new AppError('Both fields are required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Same message whether the email or the password is wrong — avoids user enumeration.
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Invalid credentials', 401);
    }

    const token = createToken(user._id);
    res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email },
        message: 'User logged in successfully'
    });
});

// GET USER DETAILS — req.user is already loaded by authMiddleware (no extra DB hit).
export const getCurrentUser = asyncHandler(async (req, res) => {
    const { _id, name, email } = req.user;
    res.json({ success: true, user: { id: _id, name, email } });
});

// UPDATE USER PROFILE
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!isNonEmptyString(name) || !isNonEmptyString(email)) {
        throw new AppError('Please fill all the fields with valid information', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!validator.isEmail(normalizedEmail)) {
        throw new AppError('Please enter a valid email', 400);
    }

    const exists = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user._id } });
    if (exists) {
        throw new AppError('Email already in use by another account', 409);
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name: name.trim(), email: normalizedEmail },
        { new: true, runValidators: true }
    ).select('name email');

    res.json({ success: true, user, message: 'Profile updated successfully' });
});

// CHANGE PASSWORD
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!isNonEmptyString(currentPassword) || !isNonEmptyString(newPassword) || newPassword.length < 8) {
        throw new AppError('Password is invalid or too short', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
        throw new AppError('User not found', 404);
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
        throw new AppError('Current password is incorrect', 403);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
});
