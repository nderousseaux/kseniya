import { z } from 'zod';
import { ItemSchema } from '@/src/services/item';

type Item = z.infer<typeof ItemSchema> & { id: string };

export default Item;
