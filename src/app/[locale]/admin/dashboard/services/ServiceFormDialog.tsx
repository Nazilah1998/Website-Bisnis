'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit } from 'lucide-react';
import { saveServiceAction } from '../../actions';

type ServiceFormDialogProps = {
  editItem?: { id: string; titleId: string; titleEn: string; descId: string; descEn: string; iconName: string; isActive: boolean };
};

export default function ServiceFormDialog({ editItem }: ServiceFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await saveServiceAction(formData);
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
            <Button variant="ghost" size="sm" title="Edit" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30">
              <Edit className="w-4 h-4" />
              <span className="sr-only">Edit</span>
            </Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <PlusCircle className="w-4 h-4" />
              Tambah Layanan
            </Button>
          )
        }
      />
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Layanan' : 'Tambah Layanan'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1">
          <input type="hidden" name="isEdit" value={editItem ? 'true' : 'false'} />
          
          <div className="space-y-2">
            <Label htmlFor="id">ID Layanan (contoh: ecommerce)</Label>
            <Input id="id" name="id" defaultValue={editItem?.id || ''} readOnly={!!editItem} className={`${editItem ? 'opacity-70 cursor-not-allowed' : ''}`} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleId">Judul (ID)</Label>
            <Input id="titleId" name="titleId" defaultValue={editItem?.titleId || ''} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleEn">Judul (EN)</Label>
            <Input id="titleEn" name="titleEn" defaultValue={editItem?.titleEn || ''} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descId">Deskripsi (ID)</Label>
            <Input id="descId" name="descId" defaultValue={editItem?.descId || ''} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descEn">Deskripsi (EN)</Label>
            <Input id="descEn" name="descEn" defaultValue={editItem?.descEn || ''} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iconName">Nama Ikon (Lucide)</Label>
            <Input id="iconName" name="iconName" defaultValue={editItem?.iconName || ''} placeholder="Contoh: Monitor, Code..." required />
          </div>
          
          <Button type="submit" disabled={loading} className={`w-full text-white mt-4 ${editItem ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Simpan Layanan')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
