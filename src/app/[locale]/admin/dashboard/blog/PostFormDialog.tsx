'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { savePostAction } from './postActions';

type PostItem = {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  excerptId: string;
  excerptEn: string;
  contentId: string;
  contentEn: string;
  coverImageUrl: string;
  category: string;
  tags: string;
  isPublished: boolean;
};

type Props = { editItem?: PostItem };

export default function PostFormDialog({ editItem }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await savePostAction(formData);
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          editItem ? (
            <Button variant="ghost" size="sm" title="Edit" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" />
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" />
          )
        }
      >
        {editItem ? (
          <><Edit className="w-4 h-4" /><span className="sr-only">Edit</span></>
        ) : (
          <><PlusCircle className="w-4 h-4" /> Tulis Artikel Baru</>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Artikel' : 'Tulis Artikel Baru'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <input type="hidden" name="isEdit" value={editItem ? 'true' : 'false'} />
          {editItem && <input type="hidden" name="id" value={editItem.id} />}

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="slug">Slug URL</Label>
            <Input id="slug" name="slug" defaultValue={editItem?.slug || ''} required placeholder="contoh: cara-buat-website" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="titleId">Judul (Indonesia)</Label>
            <Input id="titleId" name="titleId" defaultValue={editItem?.titleId || ''} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="titleEn">Judul (English)</Label>
            <Input id="titleEn" name="titleEn" defaultValue={editItem?.titleEn || ''} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="excerptId">Ringkasan (ID)</Label>
            <textarea id="excerptId" name="excerptId" defaultValue={editItem?.excerptId || ''} required rows={2} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="excerptEn">Ringkasan (EN)</Label>
            <textarea id="excerptEn" name="excerptEn" defaultValue={editItem?.excerptEn || ''} required rows={2} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="contentId">Konten Artikel (Markdown - Indonesia)</Label>
            <textarea id="contentId" name="contentId" defaultValue={editItem?.contentId || ''} required rows={6} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="contentEn">Konten Artikel (Markdown - English)</Label>
            <textarea id="contentEn" name="contentEn" defaultValue={editItem?.contentEn || ''} required rows={6} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="coverImageUrl">URL Gambar Cover</Label>
            <Input id="coverImageUrl" name="coverImageUrl" defaultValue={editItem?.coverImageUrl || ''} required placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Kategori</Label>
            <Select name="category" defaultValue={editItem?.category || 'tips'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kategori..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tips">Tips & Trik</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="bisnis">Bisnis</SelectItem>
                <SelectItem value="desain">Desain</SelectItem>
                <SelectItem value="teknologi">Teknologi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (JSON Array)</Label>
            <Input id="tags" name="tags" defaultValue={editItem?.tags || '[]'} placeholder='["SEO", "Website"]' className="font-mono text-sm" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="isPublished">Status Publikasi</Label>
            <Select name="isPublished" defaultValue={editItem ? String(editItem.isPublished) : 'false'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Draft – Belum Dipublikasikan</SelectItem>
                <SelectItem value="true">Publish – Tampilkan ke Publik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className={`w-full text-white mt-2 md:col-span-2 ${editItem ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Simpan Artikel'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
