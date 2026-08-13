import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock orders...');

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
