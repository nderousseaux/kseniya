import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';
import { requireValidId } from '../utils';

const GroupSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  quote: z.string().optional(),
});

// PATCH /api/group - update group name/quote
export async function PATCH(req: Request) {
  const { id, name, quote } = await req.json();
  const validId = requireValidId(id, 'group id');
  if (typeof validId !== 'number') return validId;
  const updated = await prisma.group.update({
    where: { id: validId },
    data: { name, quote },
  });
  return NextResponse.json(updated);
}

// GET /api/group - get group by id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = requireValidId(searchParams.get('id'), 'group id');
  if (typeof id !== 'number') return id;
  const group = await prisma.group.findUnique({ where: { id } });
  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 });
  return NextResponse.json(group);
}

// POST /api/group - create new group
export async function POST(req: Request) {
  const body = await req.json();
  const result = GroupSchema.omit({ id: true }).safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid data', details: result.error.errors }, { status: 400 });
  }
  const created = await prisma.group.create({ data: result.data });
  return NextResponse.json(created);
}

// DELETE /api/group - delete group by id
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const validId = requireValidId(id, 'group id');
  if (typeof validId !== 'number') return validId;
  await prisma.group.delete({ where: { id: validId } });
  return NextResponse.json({ success: true });
}
