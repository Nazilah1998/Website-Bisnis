import { db } from '@/db';
import { faqs } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default async function FaqsAdminPage() {
  const allFaqs = await db.select().from(faqs).orderBy(asc(faqs.orderIdx));

  async function addFaq(formData: FormData) {
    'use server';
    await db.insert(faqs).values({
      id: Math.random().toString(36).substring(7),
      questionId: formData.get('questionId') as string,
      questionEn: formData.get('questionEn') as string,
      answerId: formData.get('answerId') as string,
      answerEn: formData.get('answerEn') as string,
      orderIdx: parseInt(formData.get('orderIdx') as string) || 0,
    });
    revalidatePath('/management-gateway/dashboard/faqs');
  }

  async function deleteFaq(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await db.delete(faqs).where(eq(faqs.id, id));
    revalidatePath('/management-gateway/dashboard/faqs');
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kelola FAQ</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-card rounded-lg border p-6 h-fit shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tambah FAQ</h2>
          <form action={addFaq} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="questionId">Pertanyaan (ID)</Label>
              <Input id="questionId" name="questionId" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionEn">Pertanyaan (EN)</Label>
              <Input id="questionEn" name="questionEn" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answerId">Jawaban (ID)</Label>
              <Textarea id="answerId" name="answerId" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answerEn">Jawaban (EN)</Label>
              <Textarea id="answerEn" name="answerEn" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderIdx">Urutan</Label>
              <Input type="number" id="orderIdx" name="orderIdx" defaultValue="0" required />
            </div>
            <Button type="submit" className="w-full">Simpan FAQ</Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-card rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Urutan</TableHead>
                <TableHead>Pertanyaan</TableHead>
                <TableHead>Pratinjau Jawaban</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFaqs.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.orderIdx}</TableCell>
                  <TableCell className="font-medium">
                    {item.questionId}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">
                    {item.answerId}
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={deleteFaq}>
                      <input type="hidden" name="id" value={item.id} />
                      <Button variant="destructive" size="sm" type="submit">Hapus</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {allFaqs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Tidak ada FAQ ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
