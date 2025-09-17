import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRegisteredUser = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.token) {
            token = token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, error: 'Not authorized, token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(403).json({ success: false, error: 'Access denied. Only registered dentists can apply for GSC.' });
        }

        req.user = user;
        // CRITICAL FIX: The console.log is now in the correct place
        console.log("req.user >>>", req.user);
        
        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        res.status(401).json({ success: false, error: 'Token is invalid or expired' });
    }
};