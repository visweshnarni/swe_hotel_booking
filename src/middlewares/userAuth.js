const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and attach user to request
exports.protect = async (req, res, next) => {
  let token;

  // Extract Bearer token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data excluding password
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ success: false, error: 'Token is invalid or expired' });
  }
};
