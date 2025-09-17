import jwt from 'jsonwebtoken';
import BasicUser from '../models/BasicUser.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, error: 'Not authorized, token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // CRITICAL FIX: Try to find the user in the main `User` collection first
        const fullUser = await User.findById(userId).select('-password');
        if (fullUser) {
            req.user = fullUser;
            return next();
        }
        
        // If not a full user, check if they are a basic user who has not applied yet
        const basicUser = await BasicUser.findById(userId).select('-password');
        if (basicUser) {
            req.user = basicUser;
            return next();
        }

        // If not found in either collection, the user does not exist
        return res.status(404).json({ success: false, error: 'User not found' });
    } catch (err) {
        console.error('Auth error:', err.message);
        res.status(401).json({ success: false, error: 'Token is invalid or expired' });
    }
};
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

// // import jwt from 'jsonwebtoken';
// // import User from '../models/User.js';

// // // Middleware to protect routes and attach user to request
// // export const protect = async (req, res, next) => {
// //   try {
// //     // 1. Get token from cookie
// //     const token = req.cookies?.token;

// //     if (!token) {
// //       return res.status(401).json({ success: false, error: 'Not authorized, token missing in cookies' });
// //     }

// //     // 2. Verify token
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     // 3. Attach user to request object
// //     const user = await User.findById(decoded.id).select('-password');
// //     if (!user) {
// //       return res.status(404).json({ success: false, error: 'User not found' });
// //     }

// //     req.user = user;
// //     next();
// //   } catch (err) {
// //     console.error('Auth error:', err.message);
// //     res.status(401).json({ success: false, error: 'Token is invalid or expired' });
// //   }
// // };
