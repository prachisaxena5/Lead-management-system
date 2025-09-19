import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'vercel.app', // Allows all subdomains of vercel.app
  'render.com', // Allows all subdomains of render.com
  'localhost:5000' // For local development, if needed
];

const corsOptions = {
  origin: (origin, callback) => {
    // Check if the request's origin matches one of our allowed patterns
    const isOriginAllowed = allowedOrigins.some(allowedOrigin => origin && origin.endsWith(allowedOrigin));
    if (isOriginAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/leads', leadRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
