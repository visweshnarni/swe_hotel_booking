const express = require('express');
const router = express.Router();
const dynamicUpload = require('../middlewares/dynamicUpload');
const { registerUser, getRegistertaionCategory, loginUser, forgotPassword, getProfile, resetPassword } = require('../controllers/userController');
const { protect } = require('../middlewares/userAuth');

router.post('/register', dynamicUpload, registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protect, getProfile);
router.get('/categories', getRegistertaionCategory);

module.exports = router;

