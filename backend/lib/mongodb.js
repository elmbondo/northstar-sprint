import dns from 'dns';
// Force DNS lookup to use Google DNS at the absolute entry point to bypass local OS bugs
dns.setServers(['8.8.8.8', '8.8.4.4']);

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

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env or environment variables');
}

const options = {
  tls: true,
  tlsAllowInvalidCertificates: true, // Bypass strict local certificate issues
  family: 4,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = Promise.resolve().then(() => client.connect());
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
