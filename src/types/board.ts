import { z } from 'zod';
import { BoardSchema } from '@/src/services/board';

export type Board = z.infer<typeof BoardSchema> & { id: string };
