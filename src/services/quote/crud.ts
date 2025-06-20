import { PrismaClient } from '@prisma/client';
import { QuoteSchema } from './index';

const prisma = new PrismaClient();

async function getAll() {
  return prisma.quote.findMany();
}

async function getById(id: string) {
  if (!id) throw new Error('Missing id');
  return prisma.quote.findUnique({ where: { id } });
}

async function create(data: unknown) {
  const parse = QuoteSchema.safeParse(data);
  if (!parse.success) throw parse.error;
  return prisma.quote.create({ data: parse.data });
}

async function update(data: unknown) {
  if (typeof data !== 'object' || data === null || !('id' in data) || typeof (data as { id: unknown }).id !== 'string') {
    throw new Error('Missing id');
  }
  const { id, ...updateData } = data as { id: string } & Record<string, unknown>;
  const parse = QuoteSchema.omit({ id: true }).safeParse(updateData);
  if (!parse.success) throw parse.error;
  return prisma.quote.update({ where: { id }, data: parse.data });
}

async function remove(id: string) {
  if (!id) throw new Error('Missing id');
  return prisma.quote.delete({ where: { id } });
}

const quote = { getAll, getById, create, update, remove };
export default quote;
