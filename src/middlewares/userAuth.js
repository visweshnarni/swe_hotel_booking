// import jwt from 'jsonwebtoken';
// // Import the correct model here
// import BasicUser from '../models/BasicUser.js';

// // Middleware to protect routes and attach user to request
// export const protect = async (req, res, next) => {
//     try {
//         const token = req.cookies?.token;

//         if (!token) {
//             return res.status(401).json({ success: false, error: 'Not authorized, token missing in cookies' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Change this line to use the correct model
//         const user = await BasicUser.findById(decoded.id).select('-password');
        
//         if (!user) {
//             return res.status(404).json({ success: false, error: 'User not found' });
//         }

//         req.user = user;
//         next();
//     } catch (err) {
//         console.error('Auth error:', err.message);
//         res.status(401).json({ success: false, error: 'Token is invalid or expired' });
//     }
// };

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes and attach user to request
export const protect = async (req, res, next) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authorized, token missing in cookies' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ success: false, error: 'Token is invalid or expired' });
  }
};
