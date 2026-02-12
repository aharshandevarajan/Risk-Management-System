const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

/**
 * Middleware to authenticate requests using the Authorization: Bearer <token> header.
 * Attaches `req.user` with the minimal user info (id, role, name, email).
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found for this token' });
    }

    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Factory to authorize a set of allowed roles for a route.
 * Usage: authorizeRoles('Admin', 'Security Analyst')
 */
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: 'You do not have permission to perform this action' });
  }

  next();
};

module.exports = {
  authenticate,
  authorizeRoles,
};

