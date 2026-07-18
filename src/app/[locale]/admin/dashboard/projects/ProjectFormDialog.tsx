'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { saveProjectAction } from '../clients/clientActions';

type ClientOption = { id: string; name: string };
type ProjectItem = {
  id: string; clientId: string; title: string; description: string;
  status: string; phase: string; progressPercent: number; notes: string | null;
  startedAt: Date | null; deliveredAt: Date | null;
};

type Props = { editItem?: ProjectItem; clients: ClientOption[] };

export default function ProjectFormDialog({ editItem, clients }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await saveProjectAction(new FormData(e.currentTarget));
    setLoading(false);
    if (result.success) { toast.success(result.message); setOpen(false); }
    else toast.error(result.error);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={editItem ? <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-600 hover:bg-amber-50" /> : <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" />}>
        {editItem ? <><Edit className="w-4 h-4" /></> : <><PlusCircle className="w-4 h-4" /> Tambah Proyek</>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editItem ? 'Edit Proyek' : 'Tambah Proyek Baru'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <input type="hidden" name="isEdit" value={editItem ? 'true' : 'false'} />
          {editItem && <input type="hidden" name="id" value={editItem.id} />}
          
          <div className="space-y-1.5">
            <Label>Klien</Label>
            <Select name="clientId" defaultValue={editItem?.clientId || ''} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-- Pilih Klien --" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Judul Proyek</Label>
            <Input name="title" defaultValue={editItem?.title || ''} required placeholder="contoh: Website Company Profile PT. ABC" />
          </div>
          <div className="space-y-1.5">
            <Label>Deskripsi Singkat</Label>
            <textarea name="description" defaultValue={editItem?.description || ''} required rows={2} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select name="status" defaultValue={editItem?.status || 'pending'}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="in_progress">Dikerjakan</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fase Saat Ini</Label>
              <Select name="phase" defaultValue={editItem?.phase || 'desain'}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Fase..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desain">Desain</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="launch">Launch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Progres (%)</Label>
              <Input name="progressPercent" type="number" min="0" max="100" defaultValue={editItem?.progressPercent ?? 0} required />
            </div>
            <div className="space-y-1.5">
              <Label>Tanggal Mulai</Label>
              <DatePicker name="startedAt" defaultValue={editItem?.startedAt?.toISOString() || ''} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Estimasi Selesai</Label>
              <DatePicker name="deliveredAt" defaultValue={editItem?.deliveredAt?.toISOString() || ''} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Catatan untuk Klien</Label>
            <textarea name="notes" defaultValue={editItem?.notes || ''} rows={3} placeholder="Update terkini, atau hal yang perlu diketahui klien..." className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
          </div>
          <Button type="submit" disabled={loading} className={`w-full text-white ${editItem ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah Proyek'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
