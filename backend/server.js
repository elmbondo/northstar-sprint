import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

// Import API route handlers
import ordersHandler from './api/orders.js';
import logsHandler from './api/logs.js';
import { handleSignUp, handleSignIn, handleSignOut, handleMe } from './api/auth.js';

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

import clientPromise from './lib/mongodb.js';

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'northstar-super-secret-key-12345',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: clientPromise,
    collectionName: 'sessions',
    autoRemove: 'native'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Routes
app.get('/api/orders', async (req, res) => {
  try {
    await ordersHandler(req, res);
  } catch (err) {
    console.error('API error:', err.message);
    res.status(500).json({ success: false, message: 'API error: ' + err.message });
  }
});

app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    await ordersHandler(req, res);
  } catch (err) {
    console.error('API error:', err.message);
    res.status(500).json({ success: false, message: 'API error: ' + err.message });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    await logsHandler(req, res);
  } catch (err) {
    console.error('API error:', err.message);
    res.status(500).json({ success: false, message: 'API error: ' + err.message });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    await logsHandler(req, res);
  } catch (err) {
    console.error('API error:', err.message);
    res.status(500).json({ success: false, message: 'API error: ' + err.message });
  }
});

app.post('/api/auth/signup', handleSignUp);
app.post('/api/auth/signin', handleSignIn);
app.post('/api/auth/signout', handleSignOut);
app.get('/api/auth/me', handleMe);

import returnsHandler from './api/returns.js';
app.post('/api/returns', async (req, res) => {
  try {
    await returnsHandler(req, res);
  } catch (err) {
    console.error('API error:', err.message);
    res.status(500).json({ success: false, message: 'API error: ' + err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Start server only if not in production (Vercel Serverless Function compatibility)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📝 API endpoints: GET/POST /api/orders, GET/POST /api/logs`);
    console.log(`❤️  Health check: GET /health`);
  });
}

export default app;
