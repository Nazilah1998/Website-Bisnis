import { db } from '@/db';
import { portfolios } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function PortfoliosAdminPage() {
  const allPortfolios = await db.select().from(portfolios).orderBy(desc(portfolios.createdAt));

  async function addPortfolio(formData: FormData) {
    'use server';
    await db.insert(portfolios).values({
      id: Math.random().toString(36).substring(7),
      titleId: formData.get('titleId') as string,
      titleEn: formData.get('titleEn') as string,
      descId: formData.get('descId') as string,
      descEn: formData.get('descEn') as string,
      imageUrl: formData.get('imageUrl') as string,
      category: formData.get('category') as string,
      clientName: formData.get('clientName') as string,
      techStack: formData.get('techStack') as string,
      createdAt: new Date(),
    });
    revalidatePath('/management-gateway/dashboard/portfolios');
  }

  async function deletePortfolio(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await db.delete(portfolios).where(eq(portfolios.id, id));
    revalidatePath('/management-gateway/dashboard/portfolios');
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kelola Portofolio</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-card rounded-lg border p-6 h-fit shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah Portofolio Baru</h2>
          <form action={addPortfolio} className="space-y-4">
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
              <Label htmlFor="imageUrl">URL Gambar</Label>
              <Input id="imageUrl" name="imageUrl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" name="category" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Nama Klien</Label>
              <Input id="clientName" name="clientName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techStack">Teknologi (pisahkan dengan koma)</Label>
              <Input id="techStack" name="techStack" required />
            </div>
            <Button type="submit" className="w-full">Simpan Portofolio</Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-card rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gambar</TableHead>
                <TableHead>Klien & Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPortfolios.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.titleId} className="w-16 h-10 object-cover rounded" />
                  </TableCell>
                  <TableCell>
                    <strong>{item.clientName}</strong><br/>
                    <span className="text-sm">{item.titleId}</span>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">
                    <form action={deletePortfolio}>
                      <input type="hidden" name="id" value={item.id} />
                      <Button variant="destructive" size="sm" type="submit">Hapus</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {allPortfolios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Tidak ada portofolio ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
