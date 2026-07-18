'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCcw } from 'lucide-react';
import { deleteLogoAction, toggleLogoStatusAction } from '../../actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ActionButtons({ item }: { item: any }) {
  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus logo ini?')) {
      const result = await deleteLogoAction(item.id);
      if (result.success) toast.success(result.message);
      else toast.error(result.error);
    }
  };

  const handleToggle = async () => {
    const result = await toggleLogoStatusAction(item.id, item.isActive);
    if (result.success) toast.success(result.message);
    else toast.error(result.error);
  };

  return (
    <>
      <Button onClick={handleToggle} variant="ghost" size="sm" title={item.isActive ? 'Nonaktifkan' : 'Aktifkan'} className="text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30">
        <RefreshCcw className="w-4 h-4" />
        <span className="sr-only">Ubah Status</span>
      </Button>
      <Button onClick={handleDelete} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
        <Trash2 className="w-4 h-4" />
        <span className="sr-only">Hapus</span>
      </Button>
    </>
  );
}
