import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import connectDB from './src/config/db.js';

import hotelRoutes from './src/routes/hotelRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js'; // NEW
import paymentRoutes from './src/routes/paymentRoutes.js'; // NEW


dotenv.config();

const app = express();


const allowedOrigins = [
  'https://accommodation.synergymeetings.in',
  'http://localhost:3000' // keep this for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if you send cookies/auth headers
}));

app.use(express.json());
app.use(cookieParser());

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
