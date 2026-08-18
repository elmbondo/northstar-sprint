# Eugene Wema - Week 2 Learning & Blocker Journal

## Unfamiliar Tool
Webhook verification

## Objective
Build a small JavaScript webhook receiver that accepts an inventory update and returns a successful response.

## Time Box
Day 1-2

## Day 1

### Learning Goal
Understand how webhook verification works using HMAC-SHA256 signatures and implement a basic receiver that validates incoming inventory update events.

### Resources Consulted
- Node.js crypto module documentation for HMAC-SHA256
- Express.js middleware pattern for API endpoints
- Common webhook verification patterns (signature-based validation)

### What I Tried
1. Created a webhook receiver endpoint at `/api/webhooks/inventory`
2. Implemented HMAC-SHA256 signature verification using the crypto module
3. Added validation for the `X-Webhook-Signature` header
4. Implemented request payload validation (required fields: event_type, data.sku, data.quantity)
5. Created error handling for various failure scenarios
6. Used `crypto.timingSafeEqual()` to prevent timing attacks during signature comparison

### Blockers
1. Initial signature comparison threw an error when comparing buffers of different lengths
   - Occurred when invalid signatures were provided
   - Solution: Wrapped `timingSafeEqual()` in try-catch to handle length mismatches gracefully

### How I Resolved Them
1. Identified the issue in Test 2 (Invalid signature test)
   - The `timingSafeEqual()` function throws if buffers have different byte lengths
   - Added try-catch block around the comparison
   - Now returns 401 Unauthorized for any signature mismatch

### Time Spent
2 hours (research, implementation, testing, bug fixing)

## Day 2

### Learning Goal
Implement comprehensive test coverage for the webhook receiver and verify all response scenarios work correctly (valid requests, invalid signatures, missing fields, wrong event types).

### What I Tried
1. Created a standalone test suite (`backend/test-webhooks.js`) that tests the webhook handler directly
2. Designed 7 test cases covering:
   - Valid webhook with correct signature
   - Invalid signature
   - Missing signature header
   - Missing required fields
   - Wrong event type
   - Invalid HTTP method
   - Missing event_type field
3. Fixed the signature comparison bug discovered during testing
4. Re-ran all tests to confirm they pass

### Blockers
1. Initial server startup failed due to MongoDB connection error
   - The existing session store tried to connect to MongoDB and crashed the server
   - Solution: Created standalone test suite that doesn't require the server to run

### How I Resolved Them
1. Rather than fix the server's MongoDB issue (which is outside the prototype scope), created a standalone test file that tests the webhook handler directly
2. This approach allowed testing without external dependencies
3. All 7 tests now pass successfully

### Time Spent
1.5 hours (test creation, debugging, verification)

## Prototype Result

### Expected Behaviour
The webhook receiver should accept an inventory update and return a successful response.

### Actual Behaviour
✓ The webhook receiver correctly:
1. Accepts POST requests at `/api/webhooks/inventory`
2. Validates the `X-Webhook-Signature` header
3. Verifies the signature using HMAC-SHA256
4. Returns 200 OK for valid requests with correct inventory data
5. Returns 401 Unauthorized for invalid or missing signatures
6. Returns 400 Bad Request for missing required fields
7. Returns 405 Method Not Allowed for non-POST requests
8. Handles edge cases gracefully without crashing

### Evidence
Test suite ran 7 automated tests, all passed:

```
======================================================================
TEST SUMMARY: 7/7 tests passed
======================================================================

TEST 1: Valid webhook request with correct signature
✓ PASSED - Returns 200 with success message and received data

TEST 2: Invalid signature
✓ PASSED - Returns 401 Unauthorized

TEST 3: Missing X-Webhook-Signature header
✓ PASSED - Returns 401 Unauthorized with "Missing header" message

TEST 4: Missing required field (data.sku)
✓ PASSED - Returns 400 Bad Request with field validation error

TEST 5: Wrong event type
✓ PASSED - Returns 400 Bad Request with "Unknown event type" message

TEST 6: Invalid HTTP method (GET)
✓ PASSED - Returns 405 Method Not Allowed

TEST 7: Missing event_type field
✓ PASSED - Returns 400 Bad Request with field validation error

✓ ALL TESTS PASSED
```

**Test Command:**
```bash
cd backend
node test-webhooks.js
```

**Example Valid Request:**
```javascript
// Signature calculated as HMAC-SHA256(payload, webhook_secret)
POST /api/webhooks/inventory
X-Webhook-Signature: [calculated-signature]

{
  "event_type": "inventory_update",
  "data": {
    "sku": "PROD-12345",
    "quantity": 50
  }
}

// Response:
{
  "success": true,
  "message": "Inventory update received and verified successfully.",
  "received_at": "2026-08-18T12:38:31.861Z",
  "sku": "PROD-12345",
  "quantity": 50
}
```

## Key Lessons
1. **HMAC Signatures**: HMAC-SHA256 provides a simple, effective way to verify webhook authenticity without storing shared state
2. **Timing Attacks**: Using `crypto.timingSafeEqual()` prevents attackers from guessing secrets through response timing analysis
3. **Error Handling**: Proper error responses (without exposing sensitive details) help distinguish between different failure modes
4. **Testing Strategy**: Creating standalone test suites allows testing functions without external dependencies or complex server setups
5. **Buffer Operations**: When comparing buffers, always handle cases where lengths might differ to avoid runtime errors
6. **Signature Format**: Webhooks commonly use the format: calculate HMAC of the raw body, convert to hex, pass in a header
7. **Request Validation**: Always validate payload structure before processing to prevent downstream errors
8. **Environment Variables**: Secrets should be loaded from `.env` files which are never committed to version control

## Remaining Questions
1. How should the webhook receiver store or process the inventory updates? (Currently just logs and acknowledges)
2. Should there be retry logic if the webhook is received but processing fails?
3. How should we handle webhook events that arrive out of order?
4. What's the best way to audit/log all webhook events for compliance?
5. Should the webhook receiver support multiple event types beyond just inventory_update?
