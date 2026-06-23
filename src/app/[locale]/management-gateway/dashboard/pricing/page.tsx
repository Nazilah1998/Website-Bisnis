import { db } from '@/db';
import { pricingPlans } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';


export default async function PricingAdminPage() {
  const allPricing = await db.select().from(pricingPlans);

  async function addPricing(formData: FormData) {
    'use server';
    await db.insert(pricingPlans).values({
      id: Math.random().toString(36).substring(7),
      name: formData.get('name') as string,
      price: formData.get('price') as string,
      featuresJson: formData.get('featuresJson') as string,
      isPopular: formData.get('isPopular') === 'true',
      type: formData.get('type') as string,
    });
    revalidatePath('/management-gateway/dashboard/pricing');
  }

  async function deletePricing(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await db.delete(pricingPlans).where(eq(pricingPlans.id, id));
    revalidatePath('/management-gateway/dashboard/pricing');
  }

  async function togglePopular(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const current = formData.get('currentStatus') === 'true';
    await db.update(pricingPlans).set({ isPopular: !current }).where(eq(pricingPlans.id, id));
    revalidatePath('/management-gateway/dashboard/pricing');
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kelola Paket Harga</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-card rounded-lg border p-6 h-fit shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah Paket Baru</h2>
          <form action={addPricing} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Paket</Label>
              <Input id="name" name="name" required placeholder="contoh: Starter" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Teks)</Label>
              <Input id="price" name="price" required placeholder="contoh: Rp 1.500.000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuresJson">Fitur (JSON Array)</Label>
              <Input id="featuresJson" name="featuresJson" required placeholder='["Fitur 1", "Fitur 2"]' />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipe</Label>
              <Input id="type" name="type" required placeholder="template / custom" />
            </div>
            <div className="space-y-2">
              <Label>Apakah Populer?</Label>
              <select name="isPopular" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="false">Tidak</option>
                <option value="true">Ya</option>
              </select>
            </div>
            <Button type="submit" className="w-full">Simpan Paket</Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-card rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Populer</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPricing.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.name} <br/>
                    <span className="text-xs text-muted-foreground">{item.type}</span>
                  </TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    <Badge variant={item.isPopular ? 'default' : 'outline'}>
                      {item.isPopular ? 'Populer' : 'Standar'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <form action={togglePopular} className="inline-block">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="currentStatus" value={item.isPopular ? 'true' : 'false'} />
                      <Button variant="outline" size="sm" type="submit">Ubah</Button>
                    </form>
                    <form action={deletePricing} className="inline-block">
                      <input type="hidden" name="id" value={item.id} />
                      <Button variant="destructive" size="sm" type="submit">Hapus</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {allPricing.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Tidak ada paket harga ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
