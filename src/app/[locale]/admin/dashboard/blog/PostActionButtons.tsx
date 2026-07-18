'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { deletePostAction, togglePublishAction } from './postActions';

export function PostActionButtons({ item }: { item: { id: string; isPublished: boolean } }) {
  const handleDelete = async () => {
    if (confirm('Hapus artikel ini? Tindakan ini tidak bisa dibatalkan.')) {
      const result = await deletePostAction(item.id);
      if (result.success) toast.success(result.message);
      else toast.error(result.error);
    }
  };

  const handleToggle = async () => {
    const result = await togglePublishAction(item.id, item.isPublished);
    if (result.success) toast.success(result.message);
    else toast.error(result.error);
  };

  return (
    <>
      <Button onClick={handleToggle} variant="ghost" size="sm" title={item.isPublished ? 'Jadikan Draft' : 'Publikasikan'} className={item.isPublished ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-green-500 hover:text-green-600 hover:bg-green-50'}>
        {item.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>
      <Button onClick={handleDelete} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
        <Trash2 className="w-4 h-4" />
      </Button>
    </>
  );
}
