import { db } from '@/db';
import { clientLogos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default async function ClientLogosAdminPage() {
  const allLogos = await db.select().from(clientLogos);

  async function addLogo(formData: FormData) {
    'use server';
    await db.insert(clientLogos).values({
      id: Math.random().toString(36).substring(7),
      name: formData.get('name') as string,
      logoUrl: formData.get('logoUrl') as string,
      isActive: true,
    });
    revalidatePath('/management-gateway/dashboard/logos');
  }

  async function deleteLogo(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await db.delete(clientLogos).where(eq(clientLogos.id, id));
    revalidatePath('/management-gateway/dashboard/logos');
  }

  async function toggleStatus(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const current = formData.get('currentStatus') === 'true';
    await db.update(clientLogos).set({ isActive: !current }).where(eq(clientLogos.id, id));
    revalidatePath('/management-gateway/dashboard/logos');
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kelola Logo Klien</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-card rounded-lg border p-6 h-fit shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah Logo</h2>
          <form action={addLogo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Klien / Teknologi</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL Gambar Logo</Label>
              <Input id="logoUrl" name="logoUrl" required />
            </div>
            <Button type="submit" className="w-full">Simpan Logo</Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-card rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allLogos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logoUrl} alt={item.name} className="w-16 h-10 object-contain" />
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? 'default' : 'secondary'}>
                      {item.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <form action={toggleStatus} className="inline-block">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="currentStatus" value={item.isActive ? 'true' : 'false'} />
                      <Button variant="outline" size="sm" type="submit">Ubah</Button>
                    </form>
                    <form action={deleteLogo} className="inline-block">
                      <input type="hidden" name="id" value={item.id} />
                      <Button variant="destructive" size="sm" type="submit">Hapus</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {allLogos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Tidak ada logo ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
