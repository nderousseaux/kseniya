import type { Item } from '@/src/types/Item';

export interface Group {
  name: string;
  quote: string;
  items?: Item[];
}