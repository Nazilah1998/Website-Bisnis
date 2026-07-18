'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trash2 } from 'lucide-react';
import { resolveTicketAction, deleteTicketAction } from './ticketActions';

export function TicketResolveButton({ id, status }: { id: string, status: string }) {
  const handleResolve = async () => {
    if (!confirm('Tandai tiket ini sebagai selesai (resolved)?')) return;
    const res = await resolveTicketAction(id);
    if (res.success) toast.success(res.message);
    else toast.error(res.error);
  };

  if (status === 'resolved') return null;

  return (
    <Button variant="outline" size="sm" onClick={handleResolve} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1.5 h-8 text-xs font-medium border-emerald-200 dark:border-emerald-800">
      <CheckCircle className="w-3.5 h-3.5" /> Selesai
    </Button>
  );
}

export function TicketDeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm('Hapus tiket ini permanen?')) return;
    const res = await deleteTicketAction(id);
    if (res.success) toast.success(res.message);
    else toast.error(res.error);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} className="text-zinc-400 hover:text-red-600 h-8 w-8">
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
