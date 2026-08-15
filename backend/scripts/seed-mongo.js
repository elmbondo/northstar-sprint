import dns from 'dns';
// Force DNS lookup to use Google DNS at the absolute entry point to bypass local OS bugs
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '..', '.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Please define the MONGODB_URI environment variable in .env');
  process.exit(1);
}

const orders = [
  {
    orderNumber: 'NS1001',
    customerName: 'Eleanor Vance',
    email: 'eleanor@example.com',
    productName: 'Classic Leather Tote',
    status: 'Delivered',
    orderDate: '2026-08-05',
    expectedDelivery: '2026-08-09',
    lastUpdated: '2026-08-09',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    orderNumber: 'NS1002',
    customerName: 'Julian Sterling',
    email: 'julian@example.com',
    productName: 'Cashmere Crewneck Sweater',
    status: 'Shipped',
    orderDate: '2026-08-09',
    expectedDelivery: '2026-08-14',
    lastUpdated: '2026-08-11',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    orderNumber: 'NS1003',
    customerName: 'Sienna Brooks',
    email: 'sienna@example.com',
    productName: 'Silk Slip Dress',
    status: 'In Transit',
    orderDate: '2026-08-11',
    expectedDelivery: '2026-08-16',
    lastUpdated: '2026-08-12',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const returns = [
  {
    email: 'eleanor@example.com',
    orderNumber: 'NS1001',
    productName: 'Classic Leather Tote',
    status: 'Refund Processed',
    requestDate: '2026-08-10',
    refundAmount: '$145.00',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'eleanor@example.com',
    orderNumber: 'NS1005',
    productName: 'Silk Scarf',
    status: 'In Transit',
    requestDate: '2026-08-12',
    refundAmount: 'Pending ($45.00)',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'julian@example.com',
    orderNumber: 'NS1002',
    productName: 'Cashmere Crewneck Sweater',
    status: 'Reviewing',
    requestDate: '2026-08-13',
    refundAmount: 'Pending ($120.00)',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  const options = {
    tls: true,
    tlsAllowInvalidCertificates: true,
    family: 4,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  };
  const client = new MongoClient(uri, options);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('Seeding orders...');
    for (const order of orders) {
      await db.collection('orders').updateOne(
        { orderNumber: order.orderNumber },
        { $set: order },
        { upsert: true }
      );
    }
    console.log('Database successfully seeded with orders.');

    console.log('Seeding returns...');
    for (const r of returns) {
      await db.collection('returns').updateOne(
        { orderNumber: r.orderNumber },
        { $set: r },
        { upsert: true }
      );
    }
    console.log('Database successfully seeded with returns.');

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.close();
  }
}

seed();
