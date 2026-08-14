import { PrismaClient } from '@prisma/client';

let prisma;
if (process.env.DATABASE_URL) {
  prisma = new PrismaClient();
}

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

  if (!prisma) {
    return res.status(500).json({
      success: false,
      message: 'Database connection is not available.',
    });
  }

  try {
    const record = await prisma.returnResponse.findUnique({
      where: { questionId },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'We do not have a predefined response for that returns question.',
      });
    }

    return res.status(200).json({
      success: true,
      questionId: record.questionId,
      question: record.question,
      answer: record.answer,
    });
  } catch (error) {
    console.error('Server error during returns lookup:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal error occurred. Please try again later.',
    });
  }
}
