'use server';

import { db } from '@/db';
import { tickets } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function resolveTicketAction(id: string) {
  try {
    await db.update(tickets).set({ status: 'resolved' }).where(eq(tickets.id, id));
    revalidatePath('/[locale]/admin/dashboard/tickets', 'page');
    revalidatePath('/[locale]/client/dashboard', 'page');
    return { success: true, message: 'Tiket ditandai selesai' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteTicketAction(id: string) {
  try {
    await db.delete(tickets).where(eq(tickets.id, id));
    revalidatePath('/[locale]/admin/dashboard/tickets', 'page');
    revalidatePath('/[locale]/client/dashboard', 'page');
    return { success: true, message: 'Tiket berhasil dihapus' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
