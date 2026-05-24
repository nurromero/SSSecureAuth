import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security Middleware (Uge 06 - Web sårbarheder) ---
app.use(helmet());                  // Sets secure HTTP headers
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());


// Rate limiting - protects against brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,        // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SSSecureAuth API is running' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
