'use server';

import { db } from '@/db';
import { projectAssets } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function addProjectAssetAction(formData: FormData) {
  try {
    const projectId = formData.get('projectId') as string;
    const fileName = formData.get('fileName') as string;
    const fileUrl = formData.get('fileUrl') as string;

    if (!projectId || !fileName || !fileUrl) {
      return { success: false, error: 'Data tidak lengkap' };
    }

    await db.insert(projectAssets).values({
      id: crypto.randomUUID(),
      projectId,
      fileName,
      fileUrl,
      uploadedAt: new Date(),
    });

    revalidatePath('/[locale]/admin/dashboard/projects', 'page');
    revalidatePath('/[locale]/client/dashboard', 'page');
    return { success: true, message: 'Aset berhasil ditambahkan' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteProjectAssetAction(assetId: string) {
  try {
    await db.delete(projectAssets).where(eq(projectAssets.id, assetId));
    revalidatePath('/[locale]/admin/dashboard/projects', 'page');
    revalidatePath('/[locale]/client/dashboard', 'page');
    return { success: true, message: 'Aset berhasil dihapus' };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
