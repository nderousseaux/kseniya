'use server';

import board from './crud';
import { revalidatePath } from 'next/cache';

export async function updateBoard(boardId: string, data: { title: string; description: string }) {
  try {
    await board.update({ id: boardId, ...data });
    revalidatePath(`/${boardId}`);
    revalidatePath(`/${boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update board:', error);
    return { success: false, error: 'Failed to update board' };
  }
}
