'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit } from 'lucide-react';
import { saveLogoAction } from '../../actions';

type LogoFormDialogProps = {
  editItem?: { id: string; name: string; logoUrl: string; isActive: boolean };
};

export default function LogoFormDialog({ editItem }: LogoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await saveLogoAction(formData);
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
            Tambah Logo
          </>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Logo' : 'Tambah Logo'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1">
          <input type="hidden" name="isEdit" value={editItem ? 'true' : 'false'} />
          {editItem && <input type="hidden" name="id" value={editItem.id} />}
          
          <div className="space-y-2">
            <Label htmlFor="name">Nama Klien / Teknologi</Label>
            <Input id="name" name="name" defaultValue={editItem?.name || ''} className="border-zinc-200 dark:border-zinc-800" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL Gambar Logo</Label>
            <Input id="logoUrl" name="logoUrl" defaultValue={editItem?.logoUrl || ''} placeholder="https://..." className="border-zinc-200 dark:border-zinc-800" required />
          </div>
          
          <Button type="submit" disabled={loading} className={`w-full text-white mt-4 ${editItem ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Simpan Logo')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
