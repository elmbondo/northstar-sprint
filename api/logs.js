import { PrismaClient } from '@prisma/client';
import { MEMORY_LOGS } from './orders.js';

let prisma;
if (process.env.DATABASE_URL) {
  prisma = new PrismaClient();
}

export default async function handler(req, res) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle logging a new interaction (POST)
  if (req.method === 'POST') {
    const { eventType, orderNumber, metadata } = req.body || {};

    if (!eventType) {
      return res.status(400).json({ success: false, message: 'Event type is required.' });
    }

    try {
      const timestamp = new Date();
      console.log(`[Support Interaction Log] ${timestamp.toISOString()} | Event: ${eventType} | Order: ${orderNumber || 'N/A'}`);

      if (prisma) {
        try {
          const log = await prisma.supportLog.create({
            data: {
              eventType,
              orderNumber: orderNumber || null,
              timestamp,
              metadata: metadata ? JSON.stringify(metadata) : null
            }
          });
          return res.status(201).json({ success: true, log });
        } catch (dbErr) {
          console.error('Failed to log to database, writing to memory:', dbErr.message);
        }
      }

      // Memory fallback
      const log = {
        id: MEMORY_LOGS.length + 1,
        eventType,
        orderNumber: orderNumber || null,
        timestamp,
        metadata: metadata || {}
      };
      MEMORY_LOGS.push(log);
      return res.status(201).json({ success: true, log });

    } catch (err) {
      console.error('Error logging support interaction:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  // Handle listing logs (GET)
  if (req.method === 'GET') {
    try {
      let logs = [];
      if (prisma) {
        try {
          logs = await prisma.supportLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 50
          });
        } catch (dbErr) {
          console.error('Database query failed for logs, using memory logs:', dbErr.message);
          logs = [...MEMORY_LOGS].reverse();
        }
      } else {
        logs = [...MEMORY_LOGS].reverse();
      }

      return res.status(200).json({ success: true, logs });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
