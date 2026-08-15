try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore DNS set errors in serverless environments
}

import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '..', '.env') });

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect().catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        return null;
      });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect().catch(err => {
      console.error('MongoDB Connection Error:', err.message);
      return null;
    });
  }
} else {
  console.warn('MONGODB_URI environment variable is missing.');
  clientPromise = Promise.resolve(null);
}

export default clientPromise;
