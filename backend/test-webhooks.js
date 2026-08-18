/**
 * Standalone webhook handler test
 * Tests the webhook verification without requiring the full server
 */

import crypto from 'crypto';
import webhooksHandler from './api/webhooks.js';

// Set up test environment
process.env.WEBHOOK_SECRET = 'test-webhook-secret-change-in-production';

/**
 * Helper to create mock request and response objects
 */
function createMockRequest(method, body, headers = {}) {
  return {
    method,
    body,
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    url: '/api/webhooks/inventory'
  };
}

function createMockResponse() {
  const response = {
    statusCode: 200,
    body: null,
    headers: {},
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.body = JSON.stringify(data, null, 2);
      console.log(`[Status ${this.statusCode}] ${this.body}`);
      return this;
    },
    end: function() {
      return this;
    }
  };
  return response;
}

/**
 * Helper to calculate webhook signature
 */
function calculateSignature(payload) {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  const bodyString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto
    .createHmac('sha256', webhookSecret)
    .update(bodyString)
    .digest('hex');
}

/**
 * Test Runner
 */
async function runTests() {
  console.log('='.repeat(70));
  console.log('WEBHOOK VERIFICATION PROTOTYPE - TEST SUITE');
  console.log('='.repeat(70));
  console.log();

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Valid webhook request
  console.log('TEST 1: Valid webhook request with correct signature');
  console.log('-'.repeat(70));
  totalTests++;
  const payload1 = {
    event_type: 'inventory_update',
    data: {
      sku: 'PROD-12345',
      quantity: 50
    }
  };
  const signature1 = calculateSignature(payload1);
  const req1 = createMockRequest('POST', payload1, { 'x-webhook-signature': signature1 });
  const res1 = createMockResponse();
  await webhooksHandler(req1, res1);
  if (res1.statusCode === 200) {
    console.log('✓ PASSED\n');
    passedTests++;
  } else {
    console.log('✗ FAILED\n');
  }

  // Test 2: Invalid signature
  console.log('TEST 2: Invalid signature');
  console.log('-'.repeat(70));
  totalTests++;
  const payload2 = {
    event_type: 'inventory_update',
    data: {
      sku: 'PROD-12345',
      quantity: 50
    }
  };
  const req2 = createMockRequest('POST', payload2, { 'x-webhook-signature': 'invalid-signature-12345' });
  const res2 = createMockResponse();
  await webhooksHandler(req2, res2);
  if (res2.statusCode === 401) {
    console.log('✓ PASSED\n');
    passedTests++;
  } else {
    console.log('✗ FAILED\n');
  }

  // Test 3: Missing signature header
  console.log('TEST 3: Missing X-Webhook-Signature header');
  console.log('-'.repeat(70));
  totalTests++;
  const payload3 = {
    event_type: 'inventory_update',
    data: {
      sku: 'PROD-12345',
      quantity: 50
    }
  };
  const req3 = createMockRequest('POST', payload3, {});
  const res3 = createMockResponse();
  await webhooksHandler(req3, res3);
  if (res3.statusCode === 401) {
    console.log('✓ PASSED\n');
    passedTests++;
  } else {
    console.log('✗ FAILED\n');
  }

  // Test 4: Missing required field (SKU)
  console.log('TEST 4: Missing required field (data.sku)');
  console.log('-'.repeat(70));
  totalTests++;
  const payload4 = {
    event_type: 'inventory_update',
    data: {
      quantity: 50
    }
  };
  const signature4 = calculateSignature(payload4);
  const req4 = createMockRequest('POST', payload4, { 'x-webhook-signature': signature4 });
  const res4 = createMockResponse();
  await webhooksHandler(req4, res4);
  if (res4.statusCode === 400) {
    console.log('✓ PASSED\n');
    passedTests++;
  } else {
    console.log('✗ FAILED\n');
  }

  // Test 5: Wrong event type
  console.log('TEST 5: Wrong event type');
  console.log('-'.repeat(70));
  totalTests++;
  const payload5 = {
    event_type: 'user_update',
    data: {
      sku: 'PROD-12345',
      quantity: 50
    }
  };
  const signature5 = calculateSignature(payload5);
  const req5 = createMockRequest('POST', payload5, { 'x-webhook-signature': signature5 });
  const res5 = createMockResponse();
  await webhooksHandler(req5, res5);
  if (res5.statusCode === 400) {
    console.log('✓ PASSED\n');
    passedTests++;
  } else {
    console.log('✗ FAILED\n');
  }

  // Test 6: Invalid HTTP method (GET)
  console.log('TEST 6: Invalid HTTP method (GET)');
  console.log('-'.repeat(70));
  totalTests++;
  const req6 = createMockRequest('GET', null);
  const res6 = createMockResponse();
  await webhooksHandler(req6, res6);
  if (res6.statusCode === 405) {
    console.log('✓ PASSED\n');
    passedTests++;
  } else {
    console.log('✗ FAILED\n');
  }

  // Test 7: Missing event_type field
  console.log('TEST 7: Missing event_type field');
  console.log('-'.repeat(70));
  totalTests++;
  const payload7 = {
    data: {
      sku: 'PROD-12345',
      quantity: 50
    }
  };
  const signature7 = calculateSignature(payload7);
  const req7 = createMockRequest('POST', payload7, { 'x-webhook-signature': signature7 });
  const res7 = createMockResponse();
  await webhooksHandler(req7, res7);
  if (res7.statusCode === 400) {
    console.log('✓ PASSED\n');
    passedTests++;
  } else {
    console.log('✗ FAILED\n');
  }

  // Summary
  console.log('='.repeat(70));
  console.log(`TEST SUMMARY: ${passedTests}/${totalTests} tests passed`);
  console.log('='.repeat(70));
  console.log();

  if (passedTests === totalTests) {
    console.log('✓ ALL TESTS PASSED');
    process.exit(0);
  } else {
    console.log(`✗ ${totalTests - passedTests} test(s) failed`);
    process.exit(1);
  }
}

// Run the tests
runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
