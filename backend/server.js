import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints: GET/POST /api/orders, GET/POST /api/logs`);
  console.log(`❤️  Health check: GET /health`);
});
