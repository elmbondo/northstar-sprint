import { PrismaClient } from '@prisma/client';

// Simple fallback mock database when database connection is not active or not configured
const MOCK_ORDERS = {
  'NS1001': {
    orderNumber: 'NS1001',
    status: 'Delivered',
    product: 'Classic Leather Tote',
    orderDate: '2026-08-05',
    estimatedDelivery: '2026-08-09',
    lastUpdated: '2026-08-09'
  },
  'NS1002': {
    orderNumber: 'NS1002',
    status: 'Shipped',
    product: 'Cashmere Crewneck Sweater',
    orderDate: '2026-08-09',
    estimatedDelivery: '2026-08-14',
    lastUpdated: '2026-08-11'
  },
  'NS1003': {
    orderNumber: 'NS1003',
    status: 'In Transit',
    product: 'Silk Slip Dress',
    orderDate: '2026-08-11',
    estimatedDelivery: '2026-08-16',
    lastUpdated: '2026-08-12'
  },
  'NS1004': {
    orderNumber: 'NS1004',
    status: 'Processing',
    product: 'Wool Flannel Trousers',
    orderDate: '2026-08-12',
    estimatedDelivery: '2026-08-18',
    lastUpdated: '2026-08-12'
  }
};

// In-memory fallback logs for testing when database is not connected
let MEMORY_LOGS = [];

let prisma;
if (process.env.DATABASE_URL) {
  prisma = new PrismaClient();
}

export default async function handler(req, res) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(455).json({ success: false, message: 'Method Not Allowed' });
  }

  // Retrieve order number from query or path rewrite
  // vercel.json rewrite sends /api/orders/:orderNumber to /api/orders?orderNumber=:orderNumber
  let orderNumber = req.query.orderNumber || '';
  
  if (!orderNumber) {
    // If not in query, try parsing from path (e.g. /api/orders/NS1001)
    const urlParts = req.url.split('?')[0].split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart !== 'orders') {
      orderNumber = lastPart;
    }
  }

  orderNumber = orderNumber.trim().toUpperCase();

  // 1. Validate the order number parameter
  if (!orderNumber) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an order number (e.g., NS1001).'
    });
  }

  const formatRegex = /^NS\d{4}$/;
  if (!formatRegex.test(orderNumber)) {
    // Log the lookup attempt with invalid format
    await logInteraction('Unknown order lookup', orderNumber, { reason: 'Invalid format pattern' });
    return res.status(400).json({
      success: false,
      message: 'Invalid order number format. It should start with NS followed by 4 digits (e.g., NS1001).'
    });
  }

  await logInteraction('Order lookup attempted', orderNumber);

  try {
    let orderRecord = null;

    if (prisma) {
      // If a database is configured, we query it. Any query failure will throw and return a 500 error,
      // avoiding silent fallback to hardcoded mock data.
      orderRecord = await prisma.order.findUnique({
        where: { orderNumber }
      });
    } else {
      // Fallback only if no database URL environment variable is defined
      orderRecord = MOCK_ORDERS[orderNumber] || null;
    }

    if (!orderRecord) {
      await logInteraction('Unknown order lookup', orderNumber);
      return res.status(404).json({
        success: false,
        message: 'We could not find that order. Please check the order number or contact support.'
      });
    }

    await logInteraction('Successful lookup', orderNumber);

    return res.status(200).json({
      success: true,
      order: {
        orderNumber: orderRecord.orderNumber,
        status: orderRecord.status,
        product: orderRecord.product,
        orderDate: orderRecord.orderDate,
        estimatedDelivery: orderRecord.estimatedDelivery,
        lastUpdated: orderRecord.lastUpdated
      }
    });

  } catch (error) {
    console.error('Server error during order lookup:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal error occurred. Please try again later.'
    });
  }
}

// Support interaction logging function
async function logInteraction(eventType, orderNumber = null, metadata = {}) {
  const timestamp = new Date();
  console.log(`[Support Interaction Log] ${timestamp.toISOString()} | Event: ${eventType} | Order: ${orderNumber || 'N/A'}`);
  
  if (prisma) {
    try {
      await prisma.supportLog.create({
        data: {
          eventType,
          orderNumber,
          timestamp,
          metadata: JSON.stringify(metadata)
        }
      });
      return;
    } catch (err) {
      console.error('Failed to log to database:', err.message);
    }
  }

  // Fallback memory logging
  MEMORY_LOGS.push({
    id: MEMORY_LOGS.length + 1,
    eventType,
    orderNumber,
    timestamp,
    metadata
  });
}

// Export memory logs internally for testing
export { MEMORY_LOGS };
