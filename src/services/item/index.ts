// Service for managing item operations
// You can write here some custom logic for your item service

import { z } from 'zod';
import item from './crud';

export const ItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  groupId: z.string(),
  image: z.instanceof(Buffer).optional().nullable(),
});

export default item;
