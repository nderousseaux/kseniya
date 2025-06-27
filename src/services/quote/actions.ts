'use server';

import quote from './crud';
import { revalidatePath } from 'next/cache';

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
