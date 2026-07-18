'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { updateLeadStatusAction } from './leadActions';

const STATUS_OPTIONS = ['New', 'Contacted', 'Proposal', 'Closed Won', 'Closed Lost'];

const STATUS_STYLE: Record<string, string> = {
  'New': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50',
  'Contacted': 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/50',
  'Proposal': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50',
  'Closed Won': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50',
  'Closed Lost': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50',
};

export function LeadStatusBadge({ leadId, initialStatus }: { leadId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [open, setOpen] = useState(false);

  const handleChange = async (newStatus: string) => {
    setStatus(newStatus);
    setOpen(false);
    const res = await updateLeadStatusAction(leadId, newStatus);
    if (!res.success) {
      toast.error('Gagal update status');
      setStatus(initialStatus);
    } else {
      toast.success('Status diperbarui!');
    }
  };

  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(!open)} title="Klik untuk ubah status">
        <Badge variant="outline" className={`cursor-pointer hover:opacity-80 transition-opacity ${STATUS_STYLE[status] || 'bg-zinc-100 text-zinc-700'}`}>
          {status}
        </Badge>
      </button>
      {open && (
        <div className="absolute top-8 left-0 z-50 w-40 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleChange(s)}
              className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${status === s ? 'font-bold text-blue-600' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
