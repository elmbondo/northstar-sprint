import dns from 'dns';
// Force DNS lookup to use Google DNS at the absolute entry point to bypass local OS bugs
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { MongoClient } from 'mongodb';
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
    productName: 'Silk Slip Dress',
    status: 'In Transit',
    orderDate: '2026-08-11',
    expectedDelivery: '2026-08-16',
    lastUpdated: '2026-08-12',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    orderNumber: 'NS1004',
    customerName: 'Marcus Vance',
    productName: 'Wool Flannel Trousers',
    status: 'Processing',
    orderDate: '2026-08-12',
    expectedDelivery: '2026-08-18',
    lastUpdated: '2026-08-12',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri, { family: 4 });
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
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.close();
  }
}

seed();
