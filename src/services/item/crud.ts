import { PrismaClient, Prisma } from '@prisma/client';
import { ItemSchema } from '@/src/types/schemas';

const prisma = new PrismaClient();

async function getAll(options?: { include?: Prisma.ItemInclude }) {
  return prisma.item.findMany(options);
}

async function getById(id: string, options?: { include?: Prisma.ItemInclude }) {
  if (!id) throw new Error('Missing id');
  return prisma.item.findUnique({ where: { id }, ...options });
}

async function create(data: unknown) {
  const parse = ItemSchema.safeParse(data);
  if (!parse.success) throw parse.error;
  return prisma.item.create({ data: parse.data });
}

async function update(data: unknown) {
  if (typeof data !== 'object' || data === null || !('id' in data) || typeof (data as { id: unknown }).id !== 'string') {
    throw new Error('Missing id');
  }
  const { id, ...updateData } = data as { id: string } & Record<string, unknown>;
  const parse = ItemSchema.omit({ id: true }).safeParse(updateData);
  if (!parse.success) throw parse.error;
  return prisma.item.update({ where: { id }, data: parse.data });
}

async function remove(id: string) {
  if (!id) throw new Error('Missing id');
  return prisma.item.delete({ where: { id } });
}

const item = { getAll, getById, create, update, remove };
export default item;
