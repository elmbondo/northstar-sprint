# Webhook Verification Prototype - Testing Guide

## Overview
This prototype demonstrates webhook verification using HMAC-SHA256 signature validation. The webhook receiver is located at:

```
POST /api/webhooks/inventory
```

## Setup

1. The webhook secret is configured in `backend/.env`:
   ```
   WEBHOOK_SECRET=test-webhook-secret-change-in-production
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   # or
   node server.js
   ```

3. The webhook endpoint will be available at:
   ```
   http://localhost:3000/api/webhooks/inventory
   ```

## How Webhook Verification Works

### Request Format

```http
POST /api/webhooks/inventory HTTP/1.1
Content-Type: application/json
X-Webhook-Signature: <HMAC-SHA256-SIGNATURE>

{
  "event_type": "inventory_update",
  "data": {
    "sku": "PROD-12345",
    "quantity": 50
  }
}
```

### Signature Calculation

The `X-Webhook-Signature` header is calculated as:

```
X-Webhook-Signature = HMAC-SHA256(request_body, WEBHOOK_SECRET)
```

Where:
- `request_body` = Raw JSON body as string
- `WEBHOOK_SECRET` = The secret from `.env` file

### Example Signature Calculation (Node.js)

```javascript
const crypto = require('crypto');

const webhookSecret = 'test-webhook-secret-change-in-production';
const payload = JSON.stringify({
  "event_type": "inventory_update",
  "data": {
    "sku": "PROD-12345",
    "quantity": 50
  }
});

const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(payload)
  .digest('hex');

console.log('Signature:', signature);
```

## Test Cases

### Test 1: Valid Webhook Request

**Expected Result**: ✅ Success response with status 200

**Command** (using curl):
```bash
WEBHOOK_SECRET="test-webhook-secret-change-in-production"
PAYLOAD='{"event_type":"inventory_update","data":{"sku":"PROD-12345","quantity":50}}'
SIGNATURE=$(node -e "const crypto = require('crypto'); const sig = crypto.createHmac('sha256', '$WEBHOOK_SECRET').update('$PAYLOAD').digest('hex'); console.log(sig);")

curl -X POST http://localhost:3000/api/webhooks/inventory \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Inventory update received and verified successfully.",
  "received_at": "2026-08-18T12:34:56.789Z",
  "sku": "PROD-12345",
  "quantity": 50
}
```

### Test 2: Invalid Signature

**Expected Result**: ❌ Failure response with status 401

**Command** (using curl with wrong signature):
```bash
PAYLOAD='{"event_type":"inventory_update","data":{"sku":"PROD-12345","quantity":50}}'

curl -X POST http://localhost:3000/api/webhooks/inventory \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: invalid-signature-12345" \
  -d "$PAYLOAD"
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Webhook signature verification failed. Invalid or tampered payload."
}
```

### Test 3: Missing Signature Header

**Expected Result**: ❌ Failure response with status 401

**Command** (using curl without signature header):
```bash
PAYLOAD='{"event_type":"inventory_update","data":{"sku":"PROD-12345","quantity":50}}'

curl -X POST http://localhost:3000/api/webhooks/inventory \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Missing X-Webhook-Signature header"
}
```

### Test 4: Missing Required Fields

**Expected Result**: ❌ Failure response with status 400

**Command** (missing sku field):
```bash
WEBHOOK_SECRET="test-webhook-secret-change-in-production"
PAYLOAD='{"event_type":"inventory_update","data":{"quantity":50}}'
SIGNATURE=$(node -e "const crypto = require('crypto'); const sig = crypto.createHmac('sha256', '$WEBHOOK_SECRET').update('$PAYLOAD').digest('hex'); console.log(sig);")

curl -X POST http://localhost:3000/api/webhooks/inventory \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Missing required field: data.sku"
}
```

### Test 5: Wrong Event Type

**Expected Result**: ❌ Failure response with status 400

**Command** (using wrong event_type):
```bash
WEBHOOK_SECRET="test-webhook-secret-change-in-production"
PAYLOAD='{"event_type":"user_update","data":{"sku":"PROD-12345","quantity":50}}'
SIGNATURE=$(node -e "const crypto = require('crypto'); const sig = crypto.createHmac('sha256', '$WEBHOOK_SECRET').update('$PAYLOAD').digest('hex'); console.log(sig);")

curl -X POST http://localhost:3000/api/webhooks/inventory \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Unknown event type: user_update. Expected: inventory_update"
}
```

### Test 6: Invalid HTTP Method

**Expected Result**: ❌ Method Not Allowed response with status 405

**Command** (using GET instead of POST):
```bash
curl -X GET http://localhost:3000/api/webhooks/inventory
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Method Not Allowed. Use POST for webhook events."
}
```

## Security Notes

1. **Never commit real secrets**: The `.env` file is already in `.gitignore` and should never be committed.
2. **Constant-time comparison**: The prototype uses `crypto.timingSafeEqual()` to prevent timing attacks.
3. **Signature verification**: Only payloads with valid signatures are processed.
4. **HTTPS in production**: Always use HTTPS for webhooks in production to prevent man-in-the-middle attacks.

## Key Learnings

1. HMAC-SHA256 signatures provide a simple way to verify webhook authenticity.
2. The receiver must use the exact same secret and calculation method as the sender.
3. Timing-safe comparison prevents attackers from using response time to guess the secret.
4. Request validation (field presence, type checking) prevents processing invalid data.
5. Proper error messages (without exposing sensitive details) help with debugging.
