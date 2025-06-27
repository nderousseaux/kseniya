'use server';

import group from './crud';
import { revalidatePath } from 'next/cache';

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
