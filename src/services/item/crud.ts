import { PrismaClient, Prisma } from '@prisma/client';
import { ItemSchema } from '@/src/types/schemas';

const prisma = new PrismaClient();

async function getAll(options?: { include?: Prisma.ItemInclude }) {
  return prisma.item.findMany({
    ...options,
    orderBy: { order: 'asc' }
  });
}

async function getById(id: string, options?: { include?: Prisma.ItemInclude }) {
  if (!id) throw new Error('Missing id');
  return prisma.item.findUnique({ where: { id }, ...options });
}

async function create(data: unknown) {
  const parse = ItemSchema.omit({ id: true }).safeParse(data);
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

async function reorder(groupId: string, orderedIds: string[]) {
  if (!groupId || !orderedIds?.length) throw new Error('Missing groupId or orderedIds');
  
  const operations = orderedIds.map((id, index) =>
    prisma.item.update({
      where: { id },
      data: { order: index }
    })
  );
  
  return prisma.$transaction(operations);
}

async function getByGroupId(groupId: string, options?: { include?: Prisma.ItemInclude }) {
  if (!groupId) throw new Error('Missing groupId');
  return prisma.item.findMany({
    where: { groupId },
    orderBy: { order: 'asc' },
    ...options
  });
}

const item = { getAll, getById, create, update, remove, reorder, getByGroupId };
export default item;
