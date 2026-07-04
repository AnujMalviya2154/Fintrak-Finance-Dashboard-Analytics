import AppError from '../utils/AppError.js';
import { isProd } from '../config/env.js';

// Unmatched route → 404 as a normal error flowing to the handler below.
export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// The ONE place that formats error responses. Keeps controllers free of try/catch
// and guarantees every failure returns the same { success, message } shape the UI
// can rely on.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Server error';

  // Translate common Mongoose errors into clean 4xx responses.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate value for ${Object.keys(err.keyValue || {}).join(', ')}`;
  }

  // Log full details server-side; never leak stack traces to clients.
  if (!isProd) console.error(err);

  res.status(statusCode).json({ success: false, message });
};
