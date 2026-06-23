import { db } from '@/db';
import { stats } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function StatsAdminPage() {
  const allStats = await db.select().from(stats).orderBy(asc(stats.orderIdx));

  async function addStat(formData: FormData) {
    'use server';
    await db.insert(stats).values({
      id: Math.random().toString(36).substring(7),
      labelId: formData.get('labelId') as string,
      labelEn: formData.get('labelEn') as string,
      value: formData.get('value') as string,
      orderIdx: parseInt(formData.get('orderIdx') as string) || 0,
    });
    revalidatePath('/management-gateway/dashboard/stats');
  }

  async function deleteStat(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await db.delete(stats).where(eq(stats.id, id));
    revalidatePath('/management-gateway/dashboard/stats');
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kelola Statistik</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-card rounded-lg border p-6 h-fit shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah Statistik</h2>
          <form action={addStat} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="labelId">Label (ID)</Label>
              <Input id="labelId" name="labelId" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labelEn">Label (EN)</Label>
              <Input id="labelEn" name="labelEn" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Nilai (contoh: 100+)</Label>
              <Input id="value" name="value" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderIdx">Urutan</Label>
              <Input type="number" id="orderIdx" name="orderIdx" defaultValue="0" required />
            </div>
            <Button type="submit" className="w-full">Simpan Statistik</Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-card rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Urutan</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Label</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allStats.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.orderIdx}</TableCell>
                  <TableCell className="font-bold text-lg">{item.value}</TableCell>
                  <TableCell>
                    {item.labelId} <br/>
                    <span className="text-xs text-muted-foreground">{item.labelEn}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={deleteStat}>
                      <input type="hidden" name="id" value={item.id} />
                      <Button variant="destructive" size="sm" type="submit">Hapus</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {allStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Tidak ada statistik ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
