'use client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteClientAction } from './clientActions';

export function ClientDeleteButton({ id }: { id: string }) {
  return (
    <Button onClick={async () => {
      if (confirm('Hapus klien ini? Semua proyek terkait juga akan terhapus.')) {
        const r = await deleteClientAction(id);
        if (r.success) toast.success(r.message); else toast.error(r.error);
      }
    }} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
