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

// Use regular expressions to match any subdomain of these hosting services.
// This is the most robust way to handle dynamic URLs.
const vercelRegex = /\.vercel\.app$/;
const renderRegex = /\.onrender\.com$/;

const allowedOrigins = [
  'http://localhost:5173', // For local frontend development
  'https://lead-management-system-uttk.onrender.com', //backend URL
  vercelRegex,
  renderRegex
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or local file requests)
    if (!origin) return callback(null, true);

    // Check if the origin matches any string in our list
    const isStaticMatch = allowedOrigins.includes(origin);

    // Check if the origin matches any of our regex patterns
    const isRegexMatch = allowedOrigins.some(allowedOrigin => {
      // Ensure the element is a RegExp before calling test
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isStaticMatch || isRegexMatch) {
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
