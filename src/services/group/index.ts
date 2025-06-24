// Service for managing group operations
// You can write here some custom logic for your group service

import { z } from 'zod';
import group from './crud';
import { ItemSchema } from '@/src/services/item';

export const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  boardId: z.string(),
  posX: z.number(),
  posY: z.number(),
  items: z.array(ItemSchema).optional(),
});

export default group;
