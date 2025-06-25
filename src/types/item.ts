import { z } from 'zod';
import { ItemSchema } from '@/src/services/item';

export type Item = z.infer<typeof ItemSchema> & { id: string };
