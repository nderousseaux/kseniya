import { z } from 'zod';
import { GroupSchema } from '@/src/services/group';

export type Group = z.infer<typeof GroupSchema> & { id: string };