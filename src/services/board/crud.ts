import { PrismaClient, Prisma } from '@prisma/client';
import { BoardSchema } from './index';

const prisma = new PrismaClient();

async function getAll(options?: { include?: Prisma.BoardInclude }) {
  return prisma.board.findMany(options);
}

async function getById(id: string, options?: { include?: Prisma.BoardInclude }) {
  if (!id) throw new Error('Missing id');
  return prisma.board.findUnique({ where: { id } , ...options });
}

async function create(data: unknown) {
  const parse = BoardSchema.omit({ groups: true, quotes: true }).safeParse(data);
  if (!parse.success) throw parse.error;
  return prisma.board.create({ data: parse.data });
}

async function update(data: unknown) {
  if (typeof data !== 'object' || data === null || !('id' in data) || typeof (data as { id: unknown }).id !== 'string') {
    throw new Error('Missing id');
  }
  const { id, ...updateData } = data as { id: string } & Record<string, unknown>;
  const parse = BoardSchema.omit({ id: true, groups: true, quotes: true }).safeParse(updateData);
  if (!parse.success) throw parse.error;
  return prisma.board.update({ where: { id }, data: parse.data });
}

async function remove(id: string) {
  if (!id) throw new Error('Missing id');
  return prisma.board.delete({ where: { id } });
}

const board = { getAll, getById, create, update, remove };
export default board;
