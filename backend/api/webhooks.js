import crypto from 'crypto';

/**
 * Webhook receiver for inventory updates
 * Expects:
 * - POST request with JSON body
 * - X-Webhook-Signature header containing HMAC SHA256 signature
 * 
 * The signature is calculated as:
 * HMAC-SHA256(request_body, WEBHOOK_SECRET)
 */
export default async function webhooksHandler(req, res) {
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Use POST for webhook events.'
    });
  }

  try {
    // Get the webhook secret from environment
    const webhookSecret = process.env.WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('WEBHOOK_SECRET is not configured');
      return res.status(500).json({
        success: false,
        message: 'Webhook secret is not configured on the server.'
      });
    }

    // Get the signature from the request header
    const signatureHeader = req.headers['x-webhook-signature'];
    
    if (!signatureHeader) {
      return res.status(401).json({
        success: false,
        message: 'Missing X-Webhook-Signature header'
      });
    }

    // Get the raw request body as a string
    // Note: Express middleware must parse the body, but we need the raw body for verification
    // For this prototype, we'll stringify the parsed body
    const bodyString = typeof req.body === 'string' 
      ? req.body 
      : JSON.stringify(req.body);

    // Calculate the expected signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyString)
      .digest('hex');

    // Compare signatures using constant-time comparison
    let signatureMatch = false;
    try {
      signatureMatch = crypto.timingSafeEqual(
        Buffer.from(signatureHeader),
        Buffer.from(expectedSignature)
      );
    } catch (err) {
      // timingSafeEqual throws if buffers have different lengths
      // This is expected when the signature is invalid
      signatureMatch = false;
    }

    if (!signatureMatch) {
      return res.status(401).json({
        success: false,
        message: 'Webhook signature verification failed. Invalid or tampered payload.'
      });
    }

    // Signature is valid, process the inventory update
    // Validate the payload structure
    const payload = req.body;

    if (!payload.event_type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: event_type'
      });
    }

    if (payload.event_type !== 'inventory_update') {
      return res.status(400).json({
        success: false,
        message: `Unknown event type: ${payload.event_type}. Expected: inventory_update`
      });
    }

    if (!payload.data || !payload.data.sku) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: data.sku'
      });
    }

    if (payload.data.quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: data.quantity'
      });
    }

    // Log the successful webhook reception
    console.log(`[Webhook] Received inventory update for SKU: ${payload.data.sku}, Quantity: ${payload.data.quantity}`);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Inventory update received and verified successfully.',
      received_at: new Date().toISOString(),
      sku: payload.data.sku,
      quantity: payload.data.quantity
    });

  } catch (error) {
    console.error('Webhook processing error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing webhook'
    });
  }
}
