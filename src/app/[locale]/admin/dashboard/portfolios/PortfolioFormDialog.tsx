'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit } from 'lucide-react';
import { savePortfolioAction } from '../../actions';

type PortfolioFormDialogProps = {
  editItem?: { id: string; titleId: string; titleEn: string; descId: string; descEn: string; imageUrl: string; category: string; clientName: string; techStack: string };
};

export default function PortfolioFormDialog({ editItem }: PortfolioFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await savePortfolioAction(formData);
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
          <>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit</span>
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4" />
            Tambah Portofolio
          </>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Portofolio' : 'Tambah Portofolio'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1">
          <input type="hidden" name="isEdit" value={editItem ? 'true' : 'false'} />
          {editItem && <input type="hidden" name="id" value={editItem.id} />}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="titleId">Judul (ID)</Label>
              <Input id="titleId" name="titleId" defaultValue={editItem?.titleId || ''} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleEn">Judul Proyek (EN)</Label>
              <Input id="titleEn" name="titleEn" defaultValue={editItem?.titleEn || ''} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descId">Deskripsi Singkat (ID)</Label>
            <Input id="descId" name="descId" defaultValue={editItem?.descId || ''} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descEn">Deskripsi Singkat (EN)</Label>
            <Input id="descEn" name="descEn" defaultValue={editItem?.descEn || ''} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL Gambar/Thumbnail</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={editItem?.imageUrl || ''} placeholder="https://..." required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" name="category" defaultValue={editItem?.category || ''} placeholder="Web, Mobile..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Nama Klien</Label>
              <Input id="clientName" name="clientName" defaultValue={editItem?.clientName || ''} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="techStack">Tech Stack (pisahkan dengan koma)</Label>
            <Input id="techStack" name="techStack" defaultValue={editItem?.techStack || ''} placeholder="React, Node.js..." required />
          </div>
          
          <Button type="submit" disabled={loading} className={`w-full text-white mt-4 ${editItem ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Simpan Portofolio')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
