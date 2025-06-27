import { z } from 'zod';

export const QuoteSchema = z.object({
  id: z.string(),
  text: z.string(),
  posX: z.number(),
  posY: z.number(),
  boardId: z.string(),
  order: z.number().default(0),
});

export type Quote = z.infer<typeof QuoteSchema>;
