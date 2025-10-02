import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';

import hotelRoutes from './src/routes/hotelRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js'; // NEW
import paymentRoutes from './src/routes/paymentRoutes.js'; // NEW

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Hotel API Routes
app.use('/api/hotel', hotelRoutes);
// NEW Payment API Routes
app.use('/api/payment', paymentRoutes);

// Booking API Routes
app.use('/api/booking', bookingRoutes); // NEW

app.get('/', (req, res) => res.send('🎉 SWE Hotel Booking API is Running..........!!!!'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
