// Service for managing board operations
// You can write here some custom logic for your board service

import { z } from 'zod';
import board from './crud';

export const BoardSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  password: z.string().optional().nullable(),
});


export default board;
