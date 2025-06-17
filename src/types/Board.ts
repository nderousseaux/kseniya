import { Group } from '@/src/types/Group';

export interface Board {
  title: string;
  description: string;
  password: string;
  groups?: Group[];
}
