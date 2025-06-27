'use server';

import item from './crud';
import { revalidatePath } from 'next/cache';

export async function createItem(data: { name: string; description: string; groupId: string }, boardId: string) {
  try {
    // Obtenir le prochain ordre
    const existingItems = await item.getByGroupId(data.groupId);
    const nextOrder = existingItems.length;
    
    await item.create({ ...data, order: nextOrder });
    revalidatePath(`/${boardId}`);
    revalidatePath(`/${boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to create item:', error);
    return { success: false, error: 'Failed to create item' };
  }
}

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

export async function reorderItems(groupId: string, orderedIds: string[], boardId: string) {
  try {
    await item.reorder(groupId, orderedIds);
    revalidatePath(`/${boardId}`);
    revalidatePath(`/${boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to reorder items:', error);
    return { success: false, error: 'Failed to reorder items' };
  }
}
