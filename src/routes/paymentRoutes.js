// src/routes/paymentRoutes.js

import express from 'express';
import { initiatePayment, handleCallback,retryPayment } from '../controllers/paymentController.js';

const router = express.Router();

// POST /api/payment/initiate - Initiates the booking and calls Instamojo
router.post('/initiate', initiatePayment);

// POST /api/payment/retry/:bookingId - Retries a failed payment
router.post('/retry/:bookingId', retryPayment);

// GET /api/payment/callback - Instamojo redirects here after payment attempt
router.get('/callback', handleCallback);

export default router;