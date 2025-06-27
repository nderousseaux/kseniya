import { PrismaClient, Prisma } from '@prisma/client';
import { BoardSchema } from '@/src/types/schemas';

const prisma = new PrismaClient();

async function getAll(options?: { include?: Prisma.BoardInclude }) {
  return prisma.board.findMany(options);
}

async function getById(id: string, options?: { include?: Prisma.BoardInclude }) {
  if (!id) throw new Error('Missing id');
  
  // Si on inclut les relations, on doit trier par ordre
  if (options?.include) {
    const modifiedOptions = { ...options };
    
    // Trier les groupes par ordre et leurs items
    if (modifiedOptions.include.groups) {
      modifiedOptions.include.groups = {
        ...modifiedOptions.include.groups,
        orderBy: { order: 'asc' },
        include: modifiedOptions.include.groups.include ? {
          ...modifiedOptions.include.groups.include,
          items: modifiedOptions.include.groups.include.items ? {
            orderBy: { order: 'asc' }
          } : false
        } : undefined
      };
    }
    
    // Trier les quotes par ordre
    if (modifiedOptions.include.quotes) {
      modifiedOptions.include.quotes = {
        orderBy: { order: 'asc' }
      };
    }
    
    return prisma.board.findUnique({ 
      where: { id }, 
      ...modifiedOptions 
    });
  }
  
  return prisma.board.findUnique({ where: { id }, ...options });
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
