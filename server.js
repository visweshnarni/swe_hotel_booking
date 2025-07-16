import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';
import userRoutes from './src/routes/userRoutes.js';
import gscRoutes from './src/routes/gscRoutes.js';
import nocRoutes from './src/routes/nocRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
// For __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/certificates', gscRoutes);
app.use('/api/certificates', nocRoutes);
app.use('/api/payment', paymentRoutes);


app.get('/', (req, res) => res.send('🎉 Telangana Dental Council API is Running..........!!!!'));

// Start server
const PORT = process.env.PORT || 5000;


const startServer = async () => {
  await connectDB(); // Ensure DB is connected before starting server

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();