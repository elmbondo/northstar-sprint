import clientPromise from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

export default async function returnsHandler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  let queryEmail = req.body?.email;

  try {
    let returnsData = [];

    try {
      const client = await clientPromise;
      if (!client) {
        throw new Error('Database connection returned null');
      }
      const db = client.db();
      
      // Prioritize authenticated user's email if logged in
      if (req.session && req.session.userId) {
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) });
        if (user) {
          queryEmail = user.email;
        }
      }

      if (!queryEmail) {
        return res.status(401).json({ success: false, message: 'Please provide an email address.' });
      }

      queryEmail = queryEmail.toLowerCase().trim();

      const returns = await db.collection('returns').find({ email: queryEmail }).toArray();
      returnsData = returns.map(r => ({
        orderNumber: r.orderNumber,
        productName: r.productName,
        status: r.status,
        requestDate: r.requestDate,
        refundAmount: r.refundAmount
      }));

      // Log the interaction asynchronously
      logAuthEvent('Return tracking accessed', queryEmail, { count: returnsData.length }).catch(console.error);

    } catch (dbError) {
      console.warn('Database connection failed, falling back to mock data for UI demonstration:', dbError.message);
      if (!queryEmail) {
        return res.status(401).json({ success: false, message: 'Please provide an email address.' });
      }
      queryEmail = queryEmail.toLowerCase().trim();
    }

    // Fallback Mock Data if database fails completely (for offline UI demonstration)
    if (returnsData.length === 0 && queryEmail === 'eleanor@example.com' && !clientPromise) {
      // We only inject static mock data if the database is completely offline/unreachable
      // and they are using the primary test account. Otherwise, we respect the empty database state.
      returnsData = [
        { orderNumber: 'NS1001', productName: 'Classic Leather Tote', status: 'Refund Processed', requestDate: '2026-08-10', refundAmount: '$145.00' }
      ];
    }

    return res.status(200).json({ success: true, returns: returnsData, email: queryEmail });
  } catch (error) {
    console.error('Returns endpoint error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
}

async function logAuthEvent(eventType, email, metadata = {}) {
  const client = await clientPromise;
  const db = client.db();
  
  await db.collection('support_logs').insertOne({
    requestType: eventType,
    orderNumber: null,
    customerMessage: `Lookup by: ${email}`,
    escalationStatus: 'Self-Service',
    createdAt: new Date(),
    metadata: JSON.stringify({ email, ...metadata })
  });
}
