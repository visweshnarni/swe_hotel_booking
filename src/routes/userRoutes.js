const express = require('express');
const router = express.Router();

// Controllers
const { registerUser, loginUser, forgotPassword, resetPassword, getProfile, getRegistrationCategories, getNationalities } = require('../controllers/userController');

// Middlewares
const dynamicUpload = require('../middlewares/dynamicUpload');
const { protect } = require('../middlewares/userAuth');



// Auth routes
router.post('/register', dynamicUpload, registerUser);          // Register user with file uploads
router.post('/login', loginUser);                               // Login
router.post('/forgot-password', forgotPassword);                // Send reset password email
router.post('/reset-password/:token', resetPassword);           // Reset password

// Protected routes
router.get('/profile', protect, getProfile);                    // Get user profile (requires auth)

// Public utility routes
router.get('/categories', getRegistrationCategories);            // Get registration categories
router.get('/nationalities', getNationalities);                  // Get nationalities


module.exports = router;
