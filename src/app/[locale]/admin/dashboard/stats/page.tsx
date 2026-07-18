export const dynamic = 'force-dynamic';

import { db } from '@/db';
import { stats } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3 } from 'lucide-react';
import StatFormDialog from './StatFormDialog';
import { ActionButtons } from './ActionButtons';
import { SortableTableBody } from '@/components/ui/SortableTableBody';
import { SortableTableRow } from '@/components/ui/SortableTableRow';
import { reorderAction } from '../../actions';

export default async function StatsAdminPage() {
  const allStats = await db.select().from(stats).orderBy(asc(stats.orderIdx));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Kelola Statistik</h1>
          <p className="text-sm text-zinc-500 mt-1">Data metrik yang muncul di bagian statistik website.</p>
        </div>
        <StatFormDialog />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Nilai</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Label</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <SortableTableBody items={allStats} onReorder={reorderAction.bind(null, 'stats')}>
              {allStats.map((item) => (
                    <SortableTableRow id={item.id} key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors">
                      <TableCell className="font-bold text-lg text-blue-600 dark:text-blue-400">{item.value}</TableCell>
                      <TableCell>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{item.labelId}</div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">{item.labelEn}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <StatFormDialog editItem={item} />
                          <ActionButtons item={item} />
                        </div>
                      </TableCell>
                    </SortableTableRow>
                  ))}
                  {allStats.length === 0 && (
                    <TableRow key="empty">
                      <TableCell colSpan={4} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center text-zinc-500">
                          <BarChart3 className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada statistik</p>
                          <p className="text-sm">Data statistik akan ditampilkan di sini.</p>
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
