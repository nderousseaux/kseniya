'use server';

import item from './crud';
import { revalidatePath } from 'next/cache';

export async function updateItem(itemId: string, data: { name: string; description: string; groupId: string }, boardId: string) {
  try {
    await item.update({ id: itemId, ...data });
    revalidatePath(`/${boardId}`);
    revalidatePath(`/${boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update item:', error);
    return { success: false, error: 'Failed to update item' };
  }
}

export async function deleteItem(itemId: string, boardId: string) {
  try {
    await item.remove(itemId);
    revalidatePath(`/${boardId}`);
    revalidatePath(`/${boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete item:', error);
    return { success: false, error: 'Failed to delete item' };
  }
}
