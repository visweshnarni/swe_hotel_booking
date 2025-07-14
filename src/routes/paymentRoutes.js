import express from 'express';
import { createPayment } from '../controllers/paymentController.js';
import { protect } from '../middlewares/userAuth.js';

const router = express.Router();

router.post('/', protect, createPayment);

export default router;
