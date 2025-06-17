import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';
import { requireValidId } from '../utils';

const BoardSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  password: z.string().optional(),
});

// PATCH /api/board - update board title/description/password
export async function PATCH(req: Request) {
  const { id, title, description, password } = await req.json();
  const validId = requireValidId(id, 'board id');
  if (typeof validId !== 'number') return validId;
  const updated = await prisma.appData.update({
    where: { id: validId },
    data: { title, description, password },
  });
  return NextResponse.json(updated);
}

// GET /api/board - get board by id
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = requireValidId(searchParams.get('id'), 'board id');
  if (typeof id !== 'number') return id; // id is a response if invalid
  const board = await prisma.appData.findUnique({ where: { id } });
  if (!board) return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  return NextResponse.json(board);
}

// POST /api/board - create a new board
export async function POST(req: Request) {
  const body = await req.json();
  const result = BoardSchema.omit({ id: true }).safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid data', details: result.error.errors }, { status: 400 });
  }
  const created = await prisma.appData.create({ data: result.data });
  return NextResponse.json(created);
}

// DELETE /api/board - delete board by id
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const validId = requireValidId(id, 'board id');
  if (typeof validId !== 'number') return validId;
  await prisma.appData.delete({ where: { id: validId } });
  return NextResponse.json({ success: true });
}
