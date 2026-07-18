'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteInvoiceAction } from './invoiceActions';

export function InvoiceDeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm('Hapus tagihan ini secara permanen?')) return;
    const res = await deleteInvoiceAction(id);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
