import { db } from '@/db';
import { portfolios } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase } from 'lucide-react';
import PortfolioFormDialog from './PortfolioFormDialog';
import { ActionButtons } from './ActionButtons';
import { SortableTableBody } from '@/components/ui/SortableTableBody';
import { SortableTableRow } from '@/components/ui/SortableTableRow';
import { reorderAction } from '../../actions';

export default async function PortfoliosAdminPage() {
  const allPortfolios = await db.select().from(portfolios).orderBy(asc(portfolios.orderIdx));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Kelola Portofolio</h1>
          <p className="text-sm text-zinc-500 mt-1">Daftar proyek dan karya terbaik yang sudah diselesaikan.</p>
        </div>
        <PortfolioFormDialog />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-24 font-semibold text-zinc-600 dark:text-zinc-400">Gambar</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Klien & Judul</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Kategori</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <SortableTableBody items={allPortfolios} onReorder={reorderAction.bind(null, 'portfolios')}>
              {allPortfolios.map((item) => (
                    <SortableTableRow id={item.id} key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors">
                      <TableCell>
                        <div className="w-16 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.imageUrl} alt={item.titleId} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{item.clientName}</div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">{item.titleId}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <PortfolioFormDialog editItem={item} />
                          <ActionButtons item={item} />
                        </div>
                      </TableCell>
                    </SortableTableRow>
                  ))}
                  {allPortfolios.length === 0 && (
                    <TableRow key="empty">
                      <TableCell colSpan={5} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center text-zinc-500">
                          <Briefcase className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada portofolio</p>
                          <p className="text-sm">Portofolio Anda akan ditampilkan di sini.</p>
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
