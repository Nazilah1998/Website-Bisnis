'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit } from 'lucide-react';
import { saveTestimonialAction } from '../../actions';

type TestimonialFormDialogProps = {
  editItem?: { id: string; clientName: string; role: string; contentId: string; contentEn: string; avatarUrl: string };
};

export default function TestimonialFormDialog({ editItem }: TestimonialFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await saveTestimonialAction(formData);
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
            Tambah Testimoni
          </>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Testimoni' : 'Tambah Testimoni'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1">
          <input type="hidden" name="isEdit" value={editItem ? 'true' : 'false'} />
          {editItem && <input type="hidden" name="id" value={editItem.id} />}
          
          <div className="space-y-2">
            <Label htmlFor="clientName">Nama Klien</Label>
            <Input id="clientName" name="clientName" defaultValue={editItem?.clientName || ''} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Peran/Jabatan</Label>
            <Input id="role" name="role" defaultValue={editItem?.role || ''} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contentId">Isi Testimoni (ID)</Label>
            <Textarea id="contentId" name="contentId" defaultValue={editItem?.contentId || ''} required className="min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contentEn">Isi Testimoni (EN)</Label>
            <Textarea id="contentEn" name="contentEn" defaultValue={editItem?.contentEn || ''} required className="min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">URL Avatar</Label>
            <Input id="avatarUrl" name="avatarUrl" defaultValue={editItem?.avatarUrl || ''} required placeholder="https://..." />
          </div>
          
          <Button type="submit" disabled={loading} className={`w-full text-white mt-4 ${editItem ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Simpan Testimoni')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
