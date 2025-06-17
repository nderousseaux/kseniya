import { PrismaClient } from '@prisma/client';
import data from '@/prisma/seed/data.json';

const prisma = new PrismaClient();

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
        create: data.groups.map((g: any) => ({
          name: g.name,
          quote: g.quote,
          items: {
            create: g.items.map((i: any) => ({
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
