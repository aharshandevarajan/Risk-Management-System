const mongoose = require('mongoose');

/**
 * Centralized error handler: validation, security, and logging.
 * Use next(err) from controllers for unexpected errors.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const logContext = { path: req.path, method: req.method };

  // Mongoose validation error (schema / required / enum)
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    console.error(`[${timestamp}] ValidationError`, logContext, messages);
    return res.status(400).json({ message: messages.join('; ') });
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err instanceof mongoose.Error.CastError) {
    console.error(`[${timestamp}] CastError`, logContext, err.message);
    return res.status(400).json({ message: 'Invalid request data' });
  }

  // JWT / auth
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    console.error(`[${timestamp}] Auth error`, logContext, err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';

  console.error(`[${timestamp}] API Error`, logContext, err.message);

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;

