'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { savePricingAction } from '../../actions';

type PricingFormDialogProps = {
  editItem?: { id: string; name: string; price: string; featuresJson: string; isPopular: boolean; type: string };
};

export default function PricingFormDialog({ editItem }: PricingFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await savePricingAction(formData);
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
            Tambah Paket Baru
          </>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Paket' : 'Tambah Paket Baru'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
          <input type="hidden" name="isEdit" value={editItem ? 'true' : 'false'} />
          {editItem && <input type="hidden" name="id" value={editItem.id} />}
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Nama Paket</Label>
            <Input id="name" name="name" defaultValue={editItem?.name || ''} required placeholder="contoh: Starter" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Harga (Teks)</Label>
            <Input id="price" name="price" defaultValue={editItem?.price || ''} required placeholder="contoh: Rp 1.500.000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipe Layanan</Label>
            <Select name="type" defaultValue={editItem?.type || 'template'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tipe..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="featuresJson">Fitur (JSON Array)</Label>
            <Input id="featuresJson" name="featuresJson" defaultValue={editItem?.featuresJson || ''} required placeholder='["Fitur 1", "Fitur 2"]' className="font-mono text-sm" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="isPopular">Status Populer</Label>
            <Select name="isPopular" defaultValue={editItem ? String(editItem.isPopular) : "false"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Biasa / Standar</SelectItem>
                <SelectItem value="true">Ya, Jadikan Populer (Highlight)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-zinc-500 mt-1">Paket populer akan lebih ditonjolkan secara visual di website.</p>
          </div>
          
          <Button type="submit" disabled={loading} className={`w-full text-white mt-4 md:col-span-2 ${editItem ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Simpan Paket')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
