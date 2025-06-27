import { PrismaClient, Prisma } from '@prisma/client';
import { QuoteSchema } from '@/src/types/schemas';

const prisma = new PrismaClient();

async function getAll(options?: { include?: Prisma.QuoteInclude }) {
  return prisma.quote.findMany({
    ...options,
    orderBy: { order: 'asc' }
  });
}

async function getById(id: string, options?: { include?: Prisma.QuoteInclude }) {
  if (!id) throw new Error('Missing id');
  return prisma.quote.findUnique({ where: { id }, ...options });
}

async function create(data: unknown) {
  const parse = QuoteSchema.omit({ id: true }).safeParse(data);
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

async function reorder(boardId: string, orderedIds: string[]) {
  if (!boardId || !orderedIds?.length) throw new Error('Missing boardId or orderedIds');
  
  const operations = orderedIds.map((id, index) =>
    prisma.quote.update({
      where: { id },
      data: { order: index }
    })
  );
  
  return prisma.$transaction(operations);
}

async function getByBoardId(boardId: string, options?: { include?: Prisma.QuoteInclude }) {
  if (!boardId) throw new Error('Missing boardId');
  return prisma.quote.findMany({
    where: { boardId },
    orderBy: { order: 'asc' },
    ...options
  });
}

const quote = { getAll, getById, create, update, remove, reorder, getByBoardId };
export default quote;
