'use server';

import { db } from '@/db';
import { tickets } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function createTicketAction(formData: FormData) {
  try {
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    
    const cs = await cookies();
    const clientId = cs.get('client_token')?.value;

    if (!clientId) throw new Error('Unauthorized');
    if (!subject || !message) throw new Error('Harap isi subjek dan pesan');

    await db.insert(tickets).values({
      id: crypto.randomUUID(),
      clientId,
      subject,
      message,
      status: 'open',
      createdAt: new Date(),
    });

    revalidatePath('/[locale]/client/dashboard', 'page');
    return { success: true, message: 'Tiket bantuan berhasil dikirim' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
