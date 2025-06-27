import { z } from 'zod';
import { ItemSchema } from './item';

export const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  boardId: z.string(),
  posX: z.number(),
  posY: z.number(),
  order: z.number().default(0),
  items: z.array(ItemSchema).optional(),
});

export type Group = z.infer<typeof GroupSchema>;
