'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteStatAction } from '../../actions';

export function ActionButtons({ item }: { item: { id: string } }) {
  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus statistik ini?')) {
      const result = await deleteStatAction(item.id);
      if (result.success) toast.success(result.message);
      else toast.error(result.error);
    }
  };

  return (
    <Button onClick={handleDelete} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
      <Trash2 className="w-4 h-4" />
      <span className="sr-only">Hapus</span>
    </Button>
  );
}
