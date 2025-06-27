import { z } from 'zod';
import { GroupSchema } from './group';
import { QuoteSchema } from './quote';

export const BoardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  password: z.string().optional().nullable(),
  groups: z.array(GroupSchema).optional(),
  quotes: z.array(QuoteSchema).optional(),
});

export type Board = z.infer<typeof BoardSchema>;
