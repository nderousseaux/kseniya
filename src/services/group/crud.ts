import { PrismaClient, Prisma } from '@prisma/client';
import { GroupSchema } from '@/src/types/schemas';

const prisma = new PrismaClient();

async function getAll(options?: { include?: Prisma.GroupInclude }) {
  return prisma.group.findMany(options);
}

async function getById(id: string, options?: { include?: Prisma.GroupInclude }) {
  if (!id) throw new Error('Missing id');
  return prisma.group.findUnique({ where: { id }, ...options });
}

async function create(data: unknown) {
  const parse = GroupSchema.omit({ id: true, items: true }).safeParse(data);
  if (!parse.success) throw parse.error;
  return prisma.group.create({ data: parse.data });
}

async function update(data: unknown) {
  if (typeof data !== 'object' || data === null || !('id' in data) || typeof (data as { id: unknown }).id !== 'string') {
    throw new Error('Missing id');
  }
  const { id, ...updateData } = data as { id: string } & Record<string, unknown>;
  const parse = GroupSchema.omit({ id: true, items: true }).safeParse(updateData);
  if (!parse.success) throw parse.error;
  return prisma.group.update({ where: { id }, data: parse.data });
}

async function remove(id: string) {
  if (!id) throw new Error('Missing id');
  return prisma.group.delete({ where: { id } });
}

const group = { getAll, getById, create, update, remove };
export default group;
