// An error we intentionally throw from controllers/middleware. The central error
// handler translates it into a clean HTTP response. `isOperational` distinguishes
// these expected errors from unexpected bugs (which must not leak details to clients).
export default class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }
}
