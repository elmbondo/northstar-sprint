import clientPromise from '../lib/mongodb.js';

export default async function ordersHandler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Retrieve order number from query or path rewrite
  let orderNumber = req.query.orderNumber || '';
  
  if (!orderNumber) {
    // Try parsing from path (e.g. /api/orders/NS1001)
    const urlParts = req.url.split('?')[0].split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart !== 'orders') {
      orderNumber = lastPart;
    }
  }

  orderNumber = orderNumber.trim().toUpperCase();

  // Validate the order number parameter
  if (!orderNumber) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an order number (e.g., NS1001).'
    });
  }

  const formatRegex = /^NS\d{4}$/;
  if (!formatRegex.test(orderNumber)) {
    try {
      await logInteraction('Unknown order lookup', orderNumber, { reason: 'Invalid format pattern' });
    } catch (e) {
      console.error('Failed to log interaction:', e.message);
    }
    return res.status(400).json({
      success: false,
      message: 'Invalid order number format. It should start with NS followed by 4 digits (e.g., NS1001).'
    });
  }

  try {
    await logInteraction('Order lookup attempted', orderNumber);
  } catch (e) {
    console.error('Failed to log interaction:', e.message);
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Database connection is not configured.');
    }

    const client = await clientPromise;
    if (!client) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please verify MONGODB_URI on Vercel.'
      });
    }
    const db = client.db();
    const orderRecord = await db.collection('orders').findOne({ orderNumber });

    if (!orderRecord) {
      try {
        await logInteraction('Unknown order lookup', orderNumber);
      } catch (e) {
        console.error('Failed to log interaction:', e.message);
      }
      return res.status(404).json({
        success: false,
        message: 'We could not find that order. Please check the order number or contact support.'
      });
    }

    try {
      await logInteraction('Successful lookup', orderNumber);
    } catch (e) {
      console.error('Failed to log interaction:', e.message);
    }

    return res.status(200).json({
      success: true,
      order: {
        orderNumber: orderRecord.orderNumber,
        status: orderRecord.status,
        product: orderRecord.productName || orderRecord.product,
        orderDate: orderRecord.orderDate,
        estimatedDelivery: orderRecord.expectedDelivery || orderRecord.estimatedDelivery,
        lastUpdated: orderRecord.lastUpdated || orderRecord.updatedAt
      }
    });

  } catch (error) {
    console.error('Server error during order lookup:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}

// Helper function to log interactions
async function logInteraction(eventType, orderNumber, metadata = {}) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const timestamp = new Date();
    
    await db.collection('support_logs').insertOne({
      requestType: eventType,
      orderNumber: orderNumber || null,
      customerMessage: metadata?.message || null,
      escalationStatus: metadata?.escalationStatus || 'Logged',
      createdAt: timestamp,
      metadata: metadata ? JSON.stringify(metadata) : null
    });
  } catch (err) {
    console.error('Error logging interaction:', err);
    throw err;
  }
}
