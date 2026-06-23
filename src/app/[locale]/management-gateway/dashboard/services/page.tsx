import { db } from '@/db';
import { services } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default async function ServicesAdminPage() {
  const allServices = await db.select().from(services);

  async function addService(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const titleId = formData.get('titleId') as string;
    const titleEn = formData.get('titleEn') as string;
    const descId = formData.get('descId') as string;
    const descEn = formData.get('descEn') as string;
    const iconName = formData.get('iconName') as string;

    await db.insert(services).values({
      id: id || Math.random().toString(36).substring(7),
      titleId,
      titleEn,
      descId,
      descEn,
      iconName,
      isActive: true,
    });
    
    revalidatePath('/management-gateway/dashboard/services');
  }

  async function deleteService(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await db.delete(services).where(eq(services.id, id));
    revalidatePath('/management-gateway/dashboard/services');
  }

  async function toggleStatus(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const currentStatus = formData.get('currentStatus') === 'true';
    await db.update(services).set({ isActive: !currentStatus }).where(eq(services.id, id));
    revalidatePath('/management-gateway/dashboard/services');
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kelola Layanan</h1>
        <p className="text-muted-foreground">Tambahkan atau edit layanan yang ditawarkan agensi Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-card rounded-lg border p-6 h-fit shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah Layanan Baru</h2>
          <form action={addService} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID Layanan (contoh: ecommerce)</Label>
              <Input id="id" name="id" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleId">Judul (ID)</Label>
              <Input id="titleId" name="titleId" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleEn">Judul (EN)</Label>
              <Input id="titleEn" name="titleEn" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descId">Deskripsi (ID)</Label>
              <Input id="descId" name="descId" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descEn">Deskripsi (EN)</Label>
              <Input id="descEn" name="descEn" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iconName">Nama Ikon (Lucide)</Label>
              <Input id="iconName" name="iconName" required />
            </div>
            <Button type="submit" className="w-full">Simpan Layanan</Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.id}</TableCell>
                  <TableCell>
                    {service.titleId} <br/>
                    <span className="text-xs text-muted-foreground">{service.titleEn}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.isActive ? 'default' : 'secondary'}>
                      {service.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <form action={toggleStatus} className="inline-block">
                      <input type="hidden" name="id" value={service.id} />
                      <input type="hidden" name="currentStatus" value={service.isActive ? 'true' : 'false'} />
                      <Button variant="outline" size="sm" type="submit">Ubah</Button>
                    </form>
                    <form action={deleteService} className="inline-block">
                      <input type="hidden" name="id" value={service.id} />
                      <Button variant="destructive" size="sm" type="submit">Hapus</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {allServices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Tidak ada layanan ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
