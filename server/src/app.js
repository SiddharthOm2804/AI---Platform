import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', resumeRoutes);

// Error Handler
app.use(errorHandler);

export default app;
