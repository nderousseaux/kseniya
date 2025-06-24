// Service for managing quote operations
// You can write here some custom logic for your quote service

import { z } from 'zod';
import quote from './crud';

export const QuoteSchema = z.object({
  id: z.string(),
  text: z.string(),
  posX: z.number(),
  posY: z.number(),
  boardId: z.string(),
});

export default quote;
