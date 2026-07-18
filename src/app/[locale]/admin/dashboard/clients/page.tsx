export const dynamic = 'force-dynamic';

import { db } from '@/db';
import { clients } from '@/db/schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users } from 'lucide-react';
import ClientFormDialog from './ClientFormDialog';
import { ClientDeleteButton } from './ClientDeleteButton';

export default async function ClientsAdminPage() {
  const allClients = await db.select().from(clients);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Kelola Klien Portal</h1>
          <p className="text-sm text-zinc-500 mt-1">Buat dan kelola akun klien untuk Client Portal.</p>
        </div>
        <ClientFormDialog />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Nama Klien</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Email</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Perusahaan</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">WhatsApp</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors">
                  <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">{client.name}</TableCell>
                  <TableCell className="text-zinc-500">{client.email}</TableCell>
                  <TableCell className="text-zinc-500">{client.company || '-'}</TableCell>
                  <TableCell className="text-zinc-500">{client.phone || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ClientFormDialog editItem={client} />
                      <ClientDeleteButton id={client.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {allClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <Users className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada klien</p>
                      <p className="text-sm">Tambah akun klien untuk Client Portal.</p>
                    </div>
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
