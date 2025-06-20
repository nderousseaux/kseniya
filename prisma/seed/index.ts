import { PrismaClient } from '@prisma/client';
import { board, groups, items, quotes } from '@/prisma/seed/data';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.quote.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.group.deleteMany({});
  await prisma.board.deleteMany({});

  // Create board
  await prisma.board.create({
    data: board,
  });

  // Create groups
  for (const group of groups) {
    await prisma.group.create({
      data: group,
    });
  }

  // Create items
  for (const item of items) {
    // Fix: use correct type and property name for image field
    const { id, name, description, groupId } = item;
    // 'image' is the correct field name per schema
    const image = (item as { image?: Buffer | null }).image ?? null;
    if (id && name && description && groupId) {
      await prisma.item.create({
        data: {
          id,
          name,
          description,
          groupId,
          image,
        },
      });
    }
  }

  // Create quotes
  for (const quote of quotes) {
    await prisma.quote.create({
      data: quote,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });