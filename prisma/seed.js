import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL is not set. Skipping seed.');
    return;
  }

  console.log('Seeding mock orders and returns responses...');

  const orders = [
    {
      orderNumber: 'NS1001',
      customerName: 'Eleanor Vance',
      product: 'Classic Leather Tote',
      status: 'Delivered',
      orderDate: '2026-08-05',
      estimatedDelivery: '2026-08-09',
      lastUpdated: '2026-08-09',
    },
    {
      orderNumber: 'NS1002',
      customerName: 'Julian Sterling',
      product: 'Cashmere Crewneck Sweater',
      status: 'Shipped',
      orderDate: '2026-08-09',
      estimatedDelivery: '2026-08-14',
      lastUpdated: '2026-08-11',
    },
    {
      orderNumber: 'NS1003',
      customerName: 'Sienna Brooks',
      product: 'Silk Slip Dress',
      status: 'In Transit',
      orderDate: '2026-08-11',
      estimatedDelivery: '2026-08-16',
      lastUpdated: '2026-08-12',
    },
    {
      orderNumber: 'NS1004',
      customerName: 'Marcus Vance',
      product: 'Wool Flannel Trousers',
      status: 'Processing',
      orderDate: '2026-08-12',
      estimatedDelivery: '2026-08-18',
      lastUpdated: '2026-08-12',
    },
  ];

  for (const order of orders) {
    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: order,
      create: order,
    });
  }

  const returnResponses = [
    {
      questionId: 'how-to-return',
      question: 'How do I return an item?',
      answer: 'To return an item, start by selecting a supported return reason in this portal. Once your request is submitted, follow the instructions shown on-screen to package the item securely and send it back using the return method provided by support.',
    },
    {
      questionId: 'eligibility',
      question: 'Is my item eligible for return?',
      answer: 'Most items are eligible for return within 30 days of delivery as long as they are unused, in original condition, and include the original packaging. Final-sale items, worn items, and damaged goods caused by misuse are not eligible.',
    },
    {
      questionId: 'refund-timing',
      question: 'When will I receive my refund?',
      answer: 'Approved refunds are typically issued within 5 to 10 business days after the returned item is received and inspected. The exact timing can vary depending on your payment provider.',
    },
  ];

  for (const item of returnResponses) {
    await prisma.returnResponse.upsert({
      where: { questionId: item.questionId },
      update: item,
      create: item,
    });
  }

  console.log('Database successfully seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
