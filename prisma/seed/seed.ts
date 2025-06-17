import { PrismaClient } from '@prisma/client';

import type { Board } from '@/src/types/Board';
import type { Group } from '@/src/types/Group';
import type { Item } from '@/src/types/Item';

const prisma = new PrismaClient();

// Load the seed data from TypeScript file
import data from '@/prisma/seed/data';

async function main() {
  // Clear existing data
  await prisma.item.deleteMany();
  await prisma.group.deleteMany();
  await prisma.appData.deleteMany();

  // Insert new data
  await prisma.appData.create({
    data: {
      title: data.title,
      description: data.description,
      groups: {
        create: (data.groups ?? []).map((g: Group) => ({
          name: g.name,
          quote: g.quote,
          items: {
            create: (g.items ?? []).map((i: Item) => ({
              name: i.name,
              description: i.description,
              img: i.img,
            })),
          },
        })),
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
