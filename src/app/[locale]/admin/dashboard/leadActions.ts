'use server';

import { db } from '@/db';
import { leads } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatusAction(id: string, status: string) {
  try {
    await db.update(leads).set({ status }).where(eq(leads.id, id));
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch {
    return { success: false };
  }
}
