/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { db } from '@/db';
import { pricingPlans, services, portfolios, testimonials, faqs, clientLogos, stats } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { desc } from 'drizzle-orm';

const tableMap: Record<string, any> = {
  pricingPlans, services, portfolios, testimonials, faqs, clientLogos, stats
};

export async function reorderAction(tableName: string, items: { id: string, orderIdx: number }[]) {
  try {
    const table = tableMap[tableName];
    if (!table) throw new Error("Invalid table");
    
    for (const item of items) {
      await db.update(table as any).set({ orderIdx: item.orderIdx }).where(eq((table as any).id, item.id));
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


// --- Pricing Actions ---
export async function savePricingAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isEdit = formData.get('isEdit') === 'true';

    const values = {
      name: formData.get('name') as string,
      price: formData.get('price') as string,
      featuresJson: formData.get('featuresJson') as string,
      isPopular: formData.get('isPopular') === 'true',
      type: formData.get('type') as string,
    };

    if (isEdit && id) {
      await db.update(pricingPlans).set(values).where(eq(pricingPlans.id, id));
    } else {
      const lastItem = await db.select().from(pricingPlans).orderBy(desc(pricingPlans.orderIdx)).limit(1);
      const newOrderIdx = lastItem.length > 0 ? lastItem[0].orderIdx + 1 : 0;
      await db.insert(pricingPlans).values({
        id: id || Math.random().toString(36).substring(7),
        ...values,
        orderIdx: newOrderIdx,
        
      });
    }

    revalidatePath('/admin/dashboard/pricing');
    return { success: true, message: isEdit ? 'Paket berhasil diperbarui!' : 'Paket baru berhasil ditambahkan!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menyimpan data' };
  }
}

export async function deletePricingAction(id: string) {
  try {
    await db.delete(pricingPlans).where(eq(pricingPlans.id, id));
    revalidatePath('/admin/dashboard/pricing');
    return { success: true, message: 'Paket berhasil dihapus!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus data' };
  }
}

export async function togglePopularAction(id: string, currentStatus: boolean) {
  try {
    await db.update(pricingPlans).set({ isPopular: !currentStatus }).where(eq(pricingPlans.id, id));
    revalidatePath('/admin/dashboard/pricing');
    return { success: true, message: 'Status populer diperbarui!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal memperbarui status' };
  }
}

// --- Services Actions ---
export async function saveServiceAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isEdit = formData.get('isEdit') === 'true';

    const values = {
      titleId: formData.get('titleId') as string,
      titleEn: formData.get('titleEn') as string,
      descId: formData.get('descId') as string,
      descEn: formData.get('descEn') as string,
      iconName: formData.get('iconName') as string,
    };

    if (isEdit && id) {
      await db.update(services).set(values).where(eq(services.id, id));
    } else {
      await db.insert(services).values({
        id, // using the user-provided ID
        ...values,
      });
    }

    revalidatePath('/admin/dashboard/services');
    return { success: true, message: isEdit ? 'Layanan berhasil diperbarui!' : 'Layanan baru berhasil ditambahkan!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menyimpan data' };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    await db.delete(services).where(eq(services.id, id));
    revalidatePath('/admin/dashboard/services');
    return { success: true, message: 'Layanan berhasil dihapus!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus data' };
  }
}

export async function toggleServiceStatusAction(id: string, currentStatus: boolean) {
  try {
    await db.update(services).set({ isActive: !currentStatus }).where(eq(services.id, id));
    revalidatePath('/admin/dashboard/services');
    return { success: true, message: 'Status layanan diperbarui!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal memperbarui status' };
  }
}

// --- Portfolios Actions ---
export async function savePortfolioAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isEdit = formData.get('isEdit') === 'true';

    const values = {
      titleId: formData.get('titleId') as string,
      titleEn: formData.get('titleEn') as string,
      descId: formData.get('descId') as string,
      descEn: formData.get('descEn') as string,
      imageUrl: formData.get('imageUrl') as string,
      category: formData.get('category') as string,
      clientName: formData.get('clientName') as string,
      techStack: formData.get('techStack') as string,
    };

    if (isEdit && id) {
      await db.update(portfolios).set(values).where(eq(portfolios.id, id));
    } else {
      const lastItem = await db.select().from(portfolios).orderBy(desc(portfolios.orderIdx)).limit(1);
      const newOrderIdx = lastItem.length > 0 ? lastItem[0].orderIdx + 1 : 0;
      await db.insert(portfolios).values({
        id: id || Math.random().toString(36).substring(7),
        ...values,
        orderIdx: newOrderIdx,
        createdAt: new Date(),
      });
    }

    revalidatePath('/admin/dashboard/portfolios');
    return { success: true, message: isEdit ? 'Portofolio diperbarui!' : 'Portofolio ditambahkan!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menyimpan data' };
  }
}

export async function deletePortfolioAction(id: string) {
  try {
    await db.delete(portfolios).where(eq(portfolios.id, id));
    revalidatePath('/admin/dashboard/portfolios');
    return { success: true, message: 'Portofolio dihapus!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus data' };
  }
}

// --- Testimonials Actions ---
export async function saveTestimonialAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isEdit = formData.get('isEdit') === 'true';

    const values = {
      clientName: formData.get('clientName') as string,
      role: formData.get('role') as string,
      contentId: formData.get('contentId') as string,
      contentEn: formData.get('contentEn') as string,
      avatarUrl: formData.get('avatarUrl') as string,
    };

    if (isEdit && id) {
      await db.update(testimonials).set(values).where(eq(testimonials.id, id));
    } else {
      const lastItem = await db.select().from(testimonials).orderBy(desc(testimonials.orderIdx)).limit(1);
      const newOrderIdx = lastItem.length > 0 ? lastItem[0].orderIdx + 1 : 0;
      await db.insert(testimonials).values({
        id: id || Math.random().toString(36).substring(7),
        ...values,
        orderIdx: newOrderIdx,
        createdAt: new Date(),
      });
    }

    revalidatePath('/admin/dashboard/testimonials');
    return { success: true, message: isEdit ? 'Testimoni diperbarui!' : 'Testimoni ditambahkan!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menyimpan data' };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    revalidatePath('/admin/dashboard/testimonials');
    return { success: true, message: 'Testimoni dihapus!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus data' };
  }
}

// --- FAQs Actions ---
export async function saveFaqAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isEdit = formData.get('isEdit') === 'true';

    const values = {
      questionId: formData.get('questionId') as string,
      questionEn: formData.get('questionEn') as string,
      answerId: formData.get('answerId') as string,
      answerEn: formData.get('answerEn') as string,
      
    };

    if (isEdit && id) {
      await db.update(faqs).set(values).where(eq(faqs.id, id));
    } else {
      const lastItem = await db.select().from(faqs).orderBy(desc(faqs.orderIdx)).limit(1);
      const newOrderIdx = lastItem.length > 0 ? lastItem[0].orderIdx + 1 : 0;
      await db.insert(faqs).values({
        id: Math.random().toString(36).substring(7),
        ...values,
        orderIdx: newOrderIdx
      });
    }

    revalidatePath('/admin/dashboard/faqs');
    return { success: true, message: isEdit ? 'FAQ diperbarui!' : 'FAQ ditambahkan!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menyimpan data' };
  }
}

export async function deleteFaqAction(id: string) {
  try {
    await db.delete(faqs).where(eq(faqs.id, id));
    revalidatePath('/admin/dashboard/faqs');
    return { success: true, message: 'FAQ dihapus!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus data' };
  }
}

// --- Logos Actions ---
export async function saveLogoAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isEdit = formData.get('isEdit') === 'true';

    const values = {
      name: formData.get('name') as string,
      logoUrl: formData.get('logoUrl') as string,
    };

    if (isEdit && id) {
      await db.update(clientLogos).set(values).where(eq(clientLogos.id, id));
    } else {
      const lastItem = await db.select().from(clientLogos).orderBy(desc(clientLogos.orderIdx)).limit(1);
      const newOrderIdx = lastItem.length > 0 ? lastItem[0].orderIdx + 1 : 0;
      await db.insert(clientLogos).values({
        id: id || Math.random().toString(36).substring(7),
        ...values,
        orderIdx: newOrderIdx,
        
      });
    }

    revalidatePath('/admin/dashboard/logos');
    return { success: true, message: isEdit ? 'Logo diperbarui!' : 'Logo ditambahkan!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menyimpan data' };
  }
}

export async function deleteLogoAction(id: string) {
  try {
    await db.delete(clientLogos).where(eq(clientLogos.id, id));
    revalidatePath('/admin/dashboard/logos');
    return { success: true, message: 'Logo dihapus!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus data' };
  }
}

export async function toggleLogoStatusAction(id: string, currentStatus: boolean) {
  try {
    await db.update(clientLogos).set({ isActive: !currentStatus }).where(eq(clientLogos.id, id));
    revalidatePath('/admin/dashboard/logos');
    return { success: true, message: 'Status logo diperbarui!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal memperbarui status' };
  }
}

// --- Stats Actions ---
export async function saveStatAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const isEdit = formData.get('isEdit') === 'true';

    const values = {
      labelId: formData.get('labelId') as string,
      labelEn: formData.get('labelEn') as string,
      value: formData.get('value') as string,
      
    };

    if (isEdit && id) {
      await db.update(stats).set(values).where(eq(stats.id, id));
    } else {
      const lastItem = await db.select().from(stats).orderBy(desc(stats.orderIdx)).limit(1);
      const newOrderIdx = lastItem.length > 0 ? lastItem[0].orderIdx + 1 : 0;
      await db.insert(stats).values({
        id: Math.random().toString(36).substring(7),
        ...values,
        orderIdx: newOrderIdx
      });
    }

    revalidatePath('/admin/dashboard/stats');
    return { success: true, message: isEdit ? 'Statistik diperbarui!' : 'Statistik ditambahkan!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menyimpan data' };
  }
}

export async function deleteStatAction(id: string) {
  try {
    await db.delete(stats).where(eq(stats.id, id));
    revalidatePath('/admin/dashboard/stats');
    return { success: true, message: 'Statistik dihapus!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus data' };
  }
}
