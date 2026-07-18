export const dynamic = 'force-dynamic';

import { db } from '@/db';
import { services } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import ServiceFormDialog from './ServiceFormDialog';
import { ActionButtons } from './ActionButtons';
import { SortableTableBody } from '@/components/ui/SortableTableBody';
import { SortableTableRow } from '@/components/ui/SortableTableRow';
import { reorderAction } from '../../actions';

export default async function ServicesAdminPage() {
  const allServices = await db.select().from(services).orderBy(asc(services.orderIdx));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Kelola Layanan</h1>
          <p className="text-sm text-zinc-500 mt-1">Tambahkan atau edit layanan yang ditawarkan oleh agensi Anda.</p>
        </div>
        <ServiceFormDialog />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">ID Layanan</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Judul</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Status</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <SortableTableBody items={allServices} onReorder={reorderAction.bind(null, 'services')}>
              {allServices.map((service) => (
                <SortableTableRow id={service.id} key={service.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors">
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{service.id}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{service.titleId}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">{service.titleEn}</div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        service.isActive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' 
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                      }
                    >
                      {service.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ServiceFormDialog editItem={service} />
                      <ActionButtons item={service} />
                    </div>
                  </TableCell>
                </SortableTableRow>
              ))}
              {allServices.length === 0 && (
                <TableRow key="empty">
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <Settings className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada layanan</p>
                      <p className="text-sm">Layanan perusahaan Anda akan ditampilkan di sini.</p>
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
