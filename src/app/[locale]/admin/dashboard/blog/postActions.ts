'use server';

import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function savePostAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isEdit = formData.get('isEdit') === 'true';
    const isPublished = formData.get('isPublished') === 'true';

    const values = {
      slug: formData.get('slug') as string,
      titleId: formData.get('titleId') as string,
      titleEn: formData.get('titleEn') as string,
      excerptId: formData.get('excerptId') as string,
      excerptEn: formData.get('excerptEn') as string,
      contentId: formData.get('contentId') as string,
      contentEn: formData.get('contentEn') as string,
      coverImageUrl: formData.get('coverImageUrl') as string,
      category: formData.get('category') as string,
      tags: formData.get('tags') as string,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    };

    if (isEdit && id) {
      await db.update(posts).set(values).where(eq(posts.id, id));
    } else {
      const lastItem = await db.select().from(posts).orderBy(desc(posts.orderIdx)).limit(1);
      const newOrderIdx = lastItem.length > 0 ? lastItem[0].orderIdx + 1 : 0;
      await db.insert(posts).values({
        id: crypto.randomUUID(),
        ...values,
        createdAt: new Date(),
        orderIdx: newOrderIdx,
      });
    }

    revalidatePath('/admin/dashboard/blog');
    revalidatePath('/blog');
    return { success: true, message: isEdit ? 'Artikel diperbarui!' : 'Artikel berhasil disimpan!' };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Gagal menyimpan' };
  }
}

export async function deletePostAction(id: string) {
  try {
    await db.delete(posts).where(eq(posts.id, id));
    revalidatePath('/admin/dashboard/blog');
    revalidatePath('/blog');
    return { success: true, message: 'Artikel dihapus!' };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Gagal menghapus' };
  }
}

export async function togglePublishAction(id: string, currentStatus: boolean) {
  try {
    await db.update(posts).set({ isPublished: !currentStatus, publishedAt: !currentStatus ? new Date() : null }).where(eq(posts.id, id));
    revalidatePath('/admin/dashboard/blog');
    revalidatePath('/blog');
    return { success: true, message: !currentStatus ? 'Artikel dipublikasikan!' : 'Artikel dijadikan draft!' };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Gagal update status' };
  }
}
