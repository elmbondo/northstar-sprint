import clientPromise from '../lib/mongodb.js';

export default async function logsHandler(req, res) {
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

      if (!process.env.MONGODB_URI) {
        throw new Error('Database connection is not configured.');
      }

      const client = await clientPromise;
      const db = client.db();
      const result = await db.collection('support_logs').insertOne({
        requestType: eventType,
        orderNumber: orderNumber || null,
        customerMessage: metadata?.message || null,
        escalationStatus: metadata?.escalationStatus || 'Logged',
        createdAt: timestamp,
        metadata: metadata ? JSON.stringify(metadata) : null
      });

      return res.status(201).json({ success: true, log: { _id: result.insertedId, eventType, orderNumber, timestamp } });

    } catch (err) {
      console.error('Error logging support interaction:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  // Handle listing logs (GET)
  if (req.method === 'GET') {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('Database connection is not configured.');
      }
      const client = await clientPromise;
      const db = client.db();
      const logs = await db.collection('support_logs')
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      return res.status(200).json({ success: true, logs });
    } catch (err) {
      console.error('Error fetching support logs:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
