'use server';

import group from './crud';
import { revalidatePath } from 'next/cache';

export async function createGroup(data: { name: string; posX: number; posY: number; boardId: string }) {
  try {
    // Obtenir le prochain ordre
    const existingGroups = await group.getByBoardId(data.boardId);
    const nextOrder = existingGroups.length;
    
    await group.create({ ...data, order: nextOrder });
    revalidatePath(`/${data.boardId}`);
    revalidatePath(`/${data.boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to create group:', error);
    return { success: false, error: 'Failed to create group' };
  }
}

export async function updateGroup(groupId: string, data: { name: string; posX: number; posY: number; boardId: string }) {
  try {
    await group.update({ id: groupId, ...data });
    revalidatePath(`/${data.boardId}`);
    revalidatePath(`/${data.boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update group:', error);
    return { success: false, error: 'Failed to update group' };
  }
}

export async function deleteGroup(groupId: string, boardId: string) {
  try {
    await group.remove(groupId);
    revalidatePath(`/${boardId}`);
    revalidatePath(`/${boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete group:', error);
    return { success: false, error: 'Failed to delete group' };
  }
}

export async function reorderGroups(boardId: string, orderedIds: string[]) {
  try {
    await group.reorder(boardId, orderedIds);
    revalidatePath(`/${boardId}`);
    revalidatePath(`/${boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to reorder groups:', error);
    return { success: false, error: 'Failed to reorder groups' };
  }
}
