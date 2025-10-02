// src/routes/paymentRoutes.js

import express from 'express';
import { initiatePayment, handleCallback } from '../controllers/paymentController.js';

const router = express.Router();

// POST /api/payment/initiate - Initiates the booking and calls Instamojo
router.post('/initiate', initiatePayment);

// GET /api/payment/callback - Instamojo redirects here after payment attempt
router.get('/callback', handleCallback);

export default router;