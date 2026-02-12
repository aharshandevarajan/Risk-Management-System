/**
 * Centralized error handler to standardize API error responses.
 * Make sure to `next(err)` from controllers when something unexpected happens.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    message,
  });
};

module.exports = errorHandler;

