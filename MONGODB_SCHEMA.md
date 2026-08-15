# MongoDB Collections Schema

This project uses **MongoDB Atlas** as the primary database. All data is fetched directly via the MongoDB Node.js driver (no Prisma).

## Collections

### 1. **orders**
Stores customer order information.

**Fields:**
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique, e.g., "NS1001"),
  customerName: String,
  productName: String,
  status: String ("Delivered" | "Shipped" | "In Transit" | "Processing"),
  orderDate: String (YYYY-MM-DD),
  expectedDelivery: String (YYYY-MM-DD),
  lastUpdated: String (YYYY-MM-DD),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Unique index on `orderNumber` (for fast lookups)

**Example:**
```javascript
{
  orderNumber: "NS1001",
  customerName: "Eleanor Vance",
  productName: "Classic Leather Tote",
  status: "Delivered",
  orderDate: "2026-08-05",
  expectedDelivery: "2026-08-09",
  lastUpdated: "2026-08-09",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### 2. **support_logs**
Stores customer support interactions and system events.

**Fields:**
```javascript
{
  _id: ObjectId,
  requestType: String (e.g., "Order lookup attempted", "Unknown order lookup", "Successful lookup"),
  orderNumber: String | null,
  customerMessage: String | null,
  escalationStatus: String,
  createdAt: Date,
  metadata: String (JSON stringified)
}
```

**Indexes:**
- Index on `createdAt` for time-series queries
- Index on `orderNumber` for filtering by order

**Example:**
```javascript
{
  requestType: "Order lookup attempted",
  orderNumber: "NS1001",
  customerMessage: null,
  escalationStatus: "Logged",
  createdAt: new Date(),
  metadata: "{\"reason\": \"customer_check\"}"
}
```

## Connection

**Environment Variable:**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?ssl=true&retryWrites=true&w=majority
```

**Client Usage:**
```javascript
import clientPromise from '../lib/mongodb.js';

const client = await clientPromise;
const db = client.db();
const collection = db.collection('orders');
```

## Seeding

Run seed script to populate initial data:
```bash
npm run db:seed
```

This uses `scripts/seed-mongo.js` to insert sample orders into the database.

## API Endpoints

### GET /api/orders?orderNumber=NS1001
Searches for an order by order number and logs the interaction.

**Response:**
```javascript
{
  success: true,
  order: {
    orderNumber: "NS1001",
    status: "Delivered",
    product: "Classic Leather Tote",
    orderDate: "2026-08-05",
    estimatedDelivery: "2026-08-09",
    lastUpdated: "2026-08-09"
  }
}
```

### POST /api/logs
Logs a customer support interaction.

**Request Body:**
```javascript
{
  eventType: "Order lookup attempted",
  orderNumber: "NS1001",
  metadata: { message: "Customer inquiry", escalationStatus: "Logged" }
}
```

### GET /api/logs
Retrieves last 50 support logs.

**Response:**
```javascript
{
  success: true,
  logs: [...]
}
```
