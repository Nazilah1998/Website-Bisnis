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
import { saveInvoiceAction } from './invoiceActions';

type Invoice = { id: string; projectId: string; amount: number; description: string; status: string; dueDate: Date };
type ProjectOption = { id: string; title: string; clientName: string };

export default function InvoiceFormDialog({ editItem, projects }: { editItem?: Invoice, projects: ProjectOption[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(() => {
    return editItem?.amount ? editItem.amount.toLocaleString('id-ID') : '';
  });

  // Handle resetting state when dialog opens for new invoices

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && !editItem) {
      // Reset when closing for 'create' mode so it's fresh next time
      setTimeout(() => setDisplayAmount(''), 300); 
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setDisplayAmount('');
      return;
    }
    const formatted = parseInt(rawValue, 10).toLocaleString('id-ID');
    setDisplayAmount(formatted);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (editItem) formData.append('id', editItem.id);
    
    const res = await saveInvoiceAction(formData);
    setLoading(false);
    if (res.success) {
      toast.success(res.message);
      setOpen(false);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger 
        render={
          editItem ? (
            <Button variant="ghost" size="icon" className="text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">
              <Edit className="w-4 h-4" />
            </Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <PlusCircle className="w-4 h-4" /> Buat Tagihan
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Tagihan' : 'Buat Tagihan Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Proyek</Label>
            <Select name="projectId" defaultValue={editItem?.projectId || ''} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Proyek..." />
              </SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title} ({p.clientName})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Deskripsi / Judul Tagihan</Label>
            <Input name="description" defaultValue={editItem?.description} required placeholder="Cth: DP 50% Website Profile" />
          </div>

          <div className="space-y-2">
            <Label>Jumlah (Rp)</Label>
            <input type="hidden" name="amount" value={displayAmount.replace(/\./g, '')} />
            <Input 
              type="text" 
              value={displayAmount} 
              onChange={handleAmountChange} 
              required 
              placeholder="5.000.000" 
            />
          </div>

          <div className="space-y-2">
            <Label>Jatuh Tempo</Label>
            <DatePicker 
              name="dueDate" 
              defaultValue={editItem?.dueDate ? new Date(editItem.dueDate).toISOString() : ''} 
              required 
            />
          </div>

          {editItem && (
            <div className="space-y-2">
              <Label>Status Pembayaran</Label>
              <Select name="status" defaultValue={editItem.status || 'unpaid'}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Belum Dibayar (Unpaid)</SelectItem>
                  <SelectItem value="paid">Lunas (Paid)</SelectItem>
                  <SelectItem value="overdue">Terlambat (Overdue)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Tagihan'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
