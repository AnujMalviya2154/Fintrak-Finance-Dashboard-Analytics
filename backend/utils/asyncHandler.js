// Wraps an async route handler so any thrown error / rejected promise is forwarded
// to the central error handler instead of crashing the request. Express 5 does this
// natively too, but wrapping keeps the intent explicit and removes every try/catch.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
