import express from 'express';

// Controllers
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  getRegistrationCategories,
  getNationalities,
  logoutUser
} from '../controllers/userController.js';

// Middlewares
import dynamicUpload from '../middlewares/dynamicUpload.js';
import { protect } from '../middlewares/userAuth.js';

const router = express.Router();

// Auth routes
router.post('/register', dynamicUpload, registerUser);          // Register user with file uploads
router.post('/login', loginUser);                               // Login user
router.get('/logout', logoutUser);                              // Logout user
router.post('/forgot-password', forgotPassword);                // Send reset password email
router.post('/reset-password/:token', resetPassword);           // Reset password

// Protected routes
router.get('/profile', protect, getProfile);                    // Get user profile (requires auth)

// Public utility routes
router.get('/categories', getRegistrationCategories);           // Get registration categories
router.get('/nationalities', getNationalities);                 // Get nationalities

export default router;
