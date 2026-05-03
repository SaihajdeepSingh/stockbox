// middleware/auth.js — Authentication middleware (Syllabus: Lecture 25-28, 41-44)
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT-based auth guard for API routes
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
  }

  try {
    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // Attach fresh user data to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'User not found or deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, error: 'Invalid token.' });
  }
};

// Role-based access control (RBAC) — e.g. admin only
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Forbidden: insufficient permissions.' });
  }
  next();
};

// Error-handling middleware (Syllabus: Lecture 25-28) — must have 4 params
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.stack || err.message);
  const status  = err.status || err.statusCode || 500;
  const message = err.expose ? err.message : 'Internal server error';
  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

module.exports = { requireAuth, requireRole, errorHandler };
