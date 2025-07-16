import express from 'express';
import { signupBasic, loginBasic } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signupBasic);
router.post('/login', loginBasic);

export default router;
