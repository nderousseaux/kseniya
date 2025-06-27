import { z } from 'zod';

export const QuoteSchema = z.object({
  id: z.string(),
  text: z.string(),
  posX: z.number(),
  posY: z.number(),
  boardId: z.string(),
});

export type Quote = z.infer<typeof QuoteSchema>;
