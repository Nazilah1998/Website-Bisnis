import { db } from '@/db';
import { clientLogos } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon } from 'lucide-react';
import LogoFormDialog from './LogoFormDialog';
import { ActionButtons } from './ActionButtons';
import { SortableTableBody } from '@/components/ui/SortableTableBody';
import { SortableTableRow } from '@/components/ui/SortableTableRow';
import { reorderAction } from '../../actions';

export default async function ClientLogosAdminPage() {
  const allLogos = await db.select().from(clientLogos).orderBy(asc(clientLogos.orderIdx));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Kelola Logo Klien</h1>
          <p className="text-sm text-zinc-500 mt-1">Tambahkan logo klien atau logo teknologi yang digunakan.</p>
        </div>
        <LogoFormDialog />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Preview</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Nama</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Status</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <SortableTableBody items={allLogos} onReorder={reorderAction.bind(null, 'clientLogos')}>
              {allLogos.map((item) => (
                    <SortableTableRow id={item.id} key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors">
                      <TableCell>
                        <div className="w-16 h-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.logoUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            item.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' 
                              : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                          }
                        >
                          {item.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <LogoFormDialog editItem={item} />
                          <ActionButtons item={item} />
                        </div>
                      </TableCell>
                    </SortableTableRow>
                  ))}
                  {allLogos.length === 0 && (
                    <TableRow key="empty">
                      <TableCell colSpan={5} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center text-zinc-500">
                          <ImageIcon className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada logo</p>
                          <p className="text-sm">Logo klien akan ditampilkan di sini.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
            </SortableTableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
