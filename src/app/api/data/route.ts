import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
  // Fetch the first AppData with all groups and items
  const appData = await prisma.appData.findFirst({
    include: {
      groups: {
        include: {
          items: true,
        },
      },
    },
  });
  return NextResponse.json(appData);
}

export async function POST(req: Request) {
  const data = await req.json();
  // Upsert AppData, Groups, and Items
  // For simplicity, delete all and recreate (for demo, not prod!)
  await prisma.item.deleteMany();
  await prisma.group.deleteMany();
  await prisma.appData.deleteMany();
  const created = await prisma.appData.create({
    data: {
      title: data.title,
      description: data.description,
      password: data.password, // Save password
      groups: {
        create: (data.groups || []).map((g: any) => ({
          name: g.name,
          quote: g.quote,
          items: {
            create: (g.items || []).map((i: any) => ({
              name: i.name,
              description: i.description,
              img: i.img,
            })),
          },
        })),
      },
    },
    include: { groups: { include: { items: true } } },
  });
  return NextResponse.json(created);
}
