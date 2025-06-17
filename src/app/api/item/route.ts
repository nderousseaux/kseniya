import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';
import { requireValidId } from '../utils';

const ItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  img: z.string().optional(),
  groupId: z.number(),
});

// PATCH /api/item - update item name/description/img
export async function PATCH(req: Request) {
  const { id, name, description, img } = await req.json();
  const validId = requireValidId(id, 'item id');
  if (typeof validId !== 'number') return validId;
  const updated = await prisma.item.update({
    where: { id: validId },
    data: { name, description, img },
  });
  return NextResponse.json(updated);
}

// GET /api/item - get item by id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = requireValidId(searchParams.get('id'), 'item id');
  if (typeof id !== 'number') return id;
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  return NextResponse.json(item);
}

// POST /api/item - create new item
export async function POST(req: Request) {
  const body = await req.json();
  const result = ItemSchema.omit({ id: true }).safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid data', details: result.error.errors }, { status: 400 });
  }
  const { groupId, ...itemData } = result.data;
  const created = await prisma.item.create({
    data: {
      ...itemData,
      group: { connect: { id: groupId } },
    },
  });
  return NextResponse.json(created);
}

// DELETE /api/item - delete item by id
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const validId = requireValidId(id, 'item id');
  if (typeof validId !== 'number') return validId;
  await prisma.item.delete({ where: { id: validId } });
  return NextResponse.json({ success: true });
}
