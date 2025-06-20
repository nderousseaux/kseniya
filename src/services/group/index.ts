// Service for managing group operations
// You can write here some custom logic for your group service

import { z } from 'zod';
import group from './crud';

export const GroupSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  boardId: z.string(),
  posX: z.number(),
  posY: z.number(),
});

export default group;
