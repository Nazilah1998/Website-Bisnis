export const dynamic = 'force-dynamic';

import { db } from '@/db';
import { tickets, clients } from '@/db/schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TicketResolveButton, TicketDeleteButton } from './TicketActionButtons';

export default async function TicketsAdminPage() {
  const [allTickets, allClients] = await Promise.all([
    db.select().from(tickets),
    db.select().from(clients),
  ]);

  const clientMap = Object.fromEntries(allClients.map(c => [c.id, c.name]));

  // Sort by createdAt descending
  allTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Tiket Bantuan (Support)</h1>
          <p className="text-sm text-zinc-500 mt-1">Kelola pertanyaan, keluhan, atau revisi dari klien.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400 w-1/4">Klien</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400 w-1/2">Subjek & Pesan</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Status</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                  <TableCell>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{clientMap[ticket.clientId] || 'Klien Tidak Diketahui'}</div>
                    <div className="text-xs text-zinc-500 mt-1">{new Date(ticket.createdAt).toLocaleString('id-ID')}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">{ticket.subject}</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap max-w-lg line-clamp-3" title={ticket.message}>{ticket.message}</div>
                  </TableCell>
                  <TableCell>
                    {ticket.status === 'open' ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">Menunggu (Open)</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400">Selesai (Resolved)</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TicketResolveButton id={ticket.id} status={ticket.status} />
                      <TicketDeleteButton id={ticket.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {allTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-zinc-500">
                    Belum ada tiket bantuan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
