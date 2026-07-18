'use server';

import { db } from '@/db';
import { clients, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function saveClientAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isEdit = formData.get('isEdit') === 'true';
    const password = formData.get('password') as string;

    const base = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      phone: formData.get('phone') as string,
    };

    if (isEdit && id) {
      const updateData: Record<string, string> = { ...base };
      if (password) {
        updateData.passwordHash = await bcrypt.hash(password, 10);
      }
      await db.update(clients).set(updateData).where(eq(clients.id, id));
    } else {
      if (!password) throw new Error('Password wajib diisi untuk klien baru');
      const passwordHash = await bcrypt.hash(password, 10);
      await db.insert(clients).values({ id: crypto.randomUUID(), ...base, passwordHash, createdAt: new Date() });
    }

    revalidatePath('/admin/dashboard/clients');
    return { success: true, message: isEdit ? 'Klien diperbarui!' : 'Klien baru berhasil ditambahkan!' };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Gagal menyimpan' };
  }
}

export async function deleteClientAction(id: string) {
  try {
    await db.delete(clients).where(eq(clients.id, id));
    revalidatePath('/admin/dashboard/clients');
    return { success: true, message: 'Klien berhasil dihapus!' };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Gagal menghapus' };
  }
}

export async function saveProjectAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isEdit = formData.get('isEdit') === 'true';

    const values = {
      clientId: formData.get('clientId') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string,
      phase: formData.get('phase') as string,
      progressPercent: parseInt(formData.get('progressPercent') as string) || 0,
      notes: formData.get('notes') as string,
      startedAt: formData.get('startedAt') ? new Date(formData.get('startedAt') as string) : null,
      deliveredAt: formData.get('deliveredAt') ? new Date(formData.get('deliveredAt') as string) : null,
    };

    if (isEdit && id) {
      await db.update(projects).set(values).where(eq(projects.id, id));
    } else {
      await db.insert(projects).values({ id: crypto.randomUUID(), ...values, createdAt: new Date() });
    }

    revalidatePath('/admin/dashboard/projects');
    return { success: true, message: isEdit ? 'Proyek diperbarui!' : 'Proyek baru ditambahkan!' };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Gagal menyimpan' };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath('/admin/dashboard/projects');
    return { success: true, message: 'Proyek berhasil dihapus!' };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Gagal menghapus' };
  }
}
