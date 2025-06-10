const data = require('../src/lib/data.json');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.item.deleteMany();
  await prisma.group.deleteMany();
  await prisma.appData.deleteMany();

  await prisma.appData.create({
    data: {
      title: data.title,
      description: data.description,
      groups: {
        create: data.groups.map((g) => ({
          name: g.name,
          quote: g.quote,
          items: {
            create: g.items.map((i) => ({
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
