import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';

import { errorHandler } from './middleware/error.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));
app.use('/uploads', express.static(path.join(publicDir, 'uploads')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/message', messageRoutes);

// Healthcheck endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Saraha Anonymous Platform API is healthy and operational!',
    timestamp: new Date().toISOString()
  });
});

// Fallback for HTML pages routing
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// 404 Not Found Middleware
app.use(notFoundHandler);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
