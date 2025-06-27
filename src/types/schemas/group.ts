import { z } from 'zod';
import { ItemSchema } from './item';

export const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  boardId: z.string(),
  posX: z.number(),
  posY: z.number(),
  items: z.array(ItemSchema).optional(),
});

export type Group = z.infer<typeof GroupSchema>;
