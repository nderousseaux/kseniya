import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  groupId: z.string(),
  image: z.any().optional().nullable(), // Pour les données binaires (Bytes)
});

export type Item = z.infer<typeof ItemSchema>;
