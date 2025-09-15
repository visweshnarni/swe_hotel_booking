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

// Public routes that don't require authentication
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/logout', logoutUser);
router.get('/categories', getRegistrationCategories);
router.get('/nationalities', getNationalities);


// === PROTECTED ROUTES ===
// These routes can only be accessed by a logged-in user.
// The `protect` middleware is the first handler to ensure authentication.

router.post(
  '/register', 
  protect, 
  dynamicUpload, 
  registerUser
);
// The order is crucial:
// 1. `protect`: Verifies the user's login status and attaches `req.user`.
// 2. `dynamicUpload`: Processes the form data and files.
// 3. `registerUser`: Updates the user profile using the data from the previous two middlewares.

router.get('/profile', protect, getProfile); 


export default router;