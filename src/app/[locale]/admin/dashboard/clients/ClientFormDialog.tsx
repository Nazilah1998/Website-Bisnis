'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit, Eye, EyeOff } from 'lucide-react';
import { saveClientAction } from './clientActions';

type ClientItem = { id: string; name: string; email: string; company: string | null; phone: string | null };
type Props = { editItem?: ClientItem };

export default function ClientFormDialog({ editItem }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await saveClientAction(new FormData(e.currentTarget));
    setLoading(false);
    if (result.success) { toast.success(result.message); setOpen(false); }
    else toast.error(result.error);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={editItem ? <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30" /> : <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" />}>
        {editItem ? <><Edit className="w-4 h-4" /></> : <><PlusCircle className="w-4 h-4" /> Tambah Klien</>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>{editItem ? 'Edit Klien' : 'Tambah Klien Baru'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <input type="hidden" name="isEdit" value={editItem ? 'true' : 'false'} />
          {editItem && <input type="hidden" name="id" value={editItem.id} />}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3"><Label>Nama Lengkap</Label><Input name="name" defaultValue={editItem?.name || ''} required className="h-11" /></div>
            <div className="space-y-3"><Label>Email</Label><Input name="email" type="email" defaultValue={editItem?.email || ''} required className="h-11" /></div>
            <div className="space-y-3"><Label>Perusahaan</Label><Input name="company" defaultValue={editItem?.company || ''} className="h-11" /></div>
            <div className="space-y-3"><Label>No. WhatsApp</Label><Input name="phone" defaultValue={editItem?.phone || ''} className="h-11" /></div>
            <div className="space-y-3 col-span-2">
              <Label>{editItem ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password *'}</Label>
              <div className="relative">
                <Input name="password" type={showPassword ? "text" : "password"} required={!editItem} placeholder={editItem ? 'Kosongkan jika tidak diubah' : 'Buat password'} className="pr-10 h-11" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-11 w-11 text-zinc-400 hover:text-zinc-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={loading} className={`w-full h-11 text-white ${editItem ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah Klien'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
