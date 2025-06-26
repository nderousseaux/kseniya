'use server';

import { board, group, item, quote } from '@/src/services';
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

export async function updateQuote(quoteId: string, data: { text: string; posX: number; posY: number; boardId: string }) {
  try {
    await quote.update({ id: quoteId, ...data });
    revalidatePath(`/${data.boardId}`);
    revalidatePath(`/${data.boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update quote:', error);
    return { success: false, error: 'Failed to update quote' };
  }
}

export async function deleteQuote(quoteId: string, boardId: string) {
  try {
    await quote.remove(quoteId);
    revalidatePath(`/${boardId}`);
    revalidatePath(`/${boardId}/edit`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete quote:', error);
    return { success: false, error: 'Failed to delete quote' };
  }
}
