import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function TestimonialsAdminPage() {
  const allTestimonials = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));

  async function addTestimonial(formData: FormData) {
    'use server';
    await db.insert(testimonials).values({
      id: Math.random().toString(36).substring(7),
      clientName: formData.get('clientName') as string,
      role: formData.get('role') as string,
      contentId: formData.get('contentId') as string,
      contentEn: formData.get('contentEn') as string,
      avatarUrl: formData.get('avatarUrl') as string,
      createdAt: new Date(),
    });
    revalidatePath('/management-gateway/dashboard/testimonials');
  }

  async function deleteTestimonial(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await db.delete(testimonials).where(eq(testimonials.id, id));
    revalidatePath('/management-gateway/dashboard/testimonials');
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kelola Testimoni</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-card rounded-lg border p-6 h-fit shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah Testimoni</h2>
          <form action={addTestimonial} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nama Klien</Label>
              <Input id="clientName" name="clientName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Jabatan / Perusahaan</Label>
              <Input id="role" name="role" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contentId">Ulasan (ID)</Label>
              <Input id="contentId" name="contentId" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contentEn">Ulasan (EN)</Label>
              <Input id="contentEn" name="contentEn" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">URL Gambar Avatar</Label>
              <Input id="avatarUrl" name="avatarUrl" required />
            </div>
            <Button type="submit" className="w-full">Simpan Testimoni</Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-card rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Klien</TableHead>
                <TableHead>Ulasan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTestimonials.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.avatarUrl} alt={item.clientName} className="w-10 h-10 rounded-full object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.clientName} <br/>
                    <span className="text-xs text-muted-foreground">{item.role}</span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">
                    {item.contentId}
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={deleteTestimonial}>
                      <input type="hidden" name="id" value={item.id} />
                      <Button variant="destructive" size="sm" type="submit">Hapus</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {allTestimonials.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Tidak ada testimoni ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
