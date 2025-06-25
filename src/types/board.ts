import { z } from 'zod';
import { BoardSchema } from '@/src/services/board';

type Board = z.infer<typeof BoardSchema> & { id: string };

export default Board;
