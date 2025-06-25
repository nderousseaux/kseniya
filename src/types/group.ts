import { z } from 'zod';
import { GroupSchema } from '@/src/services/group';

type Group = z.infer<typeof GroupSchema> & { id: string };

export default Group;