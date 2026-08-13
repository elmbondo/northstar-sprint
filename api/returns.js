const RETURN_RESPONSES = {
  'how-to-return': 'To return an item, start by selecting a supported return reason in this portal. Once your request is submitted, follow the instructions shown on-screen to package the item securely and send it back using the return method provided by support.',
  'eligibility': 'Most items are eligible for return within 30 days of delivery as long as they are unused, in original condition, and include the original packaging. Final-sale items, worn items, and damaged goods caused by misuse are not eligible.',
  'refund-timing': 'Approved refunds are typically issued within 5 to 10 business days after the returned item is received and inspected. The exact timing can vary depending on your payment provider.',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { questionId } = req.body || {};

  if (!questionId) {
    return res.status(400).json({
      success: false,
      message: 'Please select a returns or refund question.',
    });
  }

  const answer = RETURN_RESPONSES[questionId];

  if (!answer) {
    return res.status(400).json({
      success: false,
      message: 'We do not have a predefined response for that returns question.',
    });
  }

  return res.status(200).json({
    success: true,
    questionId,
    answer,
  });
}
