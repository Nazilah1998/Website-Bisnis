'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createTicketAction } from './ticketActions';
import { LifeBuoy } from 'lucide-react';

export default function TicketForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createTicketAction(formData);
    setLoading(false);
    if (res.success) {
      toast.success(res.message);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
        <LifeBuoy className="w-5 h-5 text-indigo-400" />
        Pusat Bantuan
      </h3>
      <p className="text-sm text-zinc-400 mb-6">Punya kendala atau ingin mengajukan revisi? Buat tiket bantuan di sini.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Subjek</label>
          <Input name="subject" required placeholder="Cth: Website down, Revisi teks Beranda" className="bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Pesan Detail</label>
          <Textarea name="message" required rows={4} placeholder="Jelaskan detail kendala atau revisi yang Anda inginkan..." className="bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-500 resize-none" />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          {loading ? 'Mengirim...' : 'Kirim Tiket Bantuan'}
        </Button>
      </form>
    </div>
  );
}
