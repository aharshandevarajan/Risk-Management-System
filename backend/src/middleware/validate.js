const { validationResult } = require('express-validator');

/**
 * Middleware to run express-validator and return 400 with validation errors.
 * Use after validation chains on routes.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg || `${e.path}: invalid`);
    return res.status(400).json({ message: messages.join('; ') });
  }
  next();
};

module.exports = { validate };
