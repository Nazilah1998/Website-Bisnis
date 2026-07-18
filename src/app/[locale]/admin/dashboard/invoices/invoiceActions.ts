'use server';

import { db } from '@/db';
import { invoices } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function saveInvoiceAction(formData: FormData) {
  try {
    const id = formData.get('id') as string | null;
    const projectId = formData.get('projectId') as string;
    const amount = parseInt(formData.get('amount') as string, 10);
    const description = formData.get('description') as string;
    const status = (formData.get('status') as string) || 'unpaid';
    const dueDate = new Date(formData.get('dueDate') as string);

    if (!projectId || !amount || !description || !dueDate) {
      return { success: false, error: 'Semua kolom wajib diisi' };
    }

    if (id) {
      await db.update(invoices).set({ projectId, amount, description, status, dueDate }).where(eq(invoices.id, id));
    } else {
      await db.insert(invoices).values({
        id: crypto.randomUUID(),
        projectId,
        amount,
        description,
        status,
        dueDate,
        createdAt: new Date(),
      });
    }

    revalidatePath('/[locale]/admin/dashboard/invoices', 'page');
    revalidatePath('/[locale]/client/dashboard', 'page');
    return { success: true, message: id ? 'Tagihan diperbarui' : 'Tagihan ditambahkan' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteInvoiceAction(id: string) {
  try {
    await db.delete(invoices).where(eq(invoices.id, id));
    revalidatePath('/[locale]/admin/dashboard/invoices', 'page');
    revalidatePath('/[locale]/client/dashboard', 'page');
    return { success: true, message: 'Tagihan dihapus' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
