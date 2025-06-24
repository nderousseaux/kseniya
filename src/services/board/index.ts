// Service for managing board operations
// You can write here some custom logic for your board service

import { z } from 'zod';
import board from './crud';
import { GroupSchema } from '@/src/services/group';
import { QuoteSchema } from '@/src/services/quote';

export const BoardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  password: z.string().optional().nullable(),
  groups: z.array(GroupSchema).optional(),
  quotes: z.array(QuoteSchema).optional(),
});


export default board;
