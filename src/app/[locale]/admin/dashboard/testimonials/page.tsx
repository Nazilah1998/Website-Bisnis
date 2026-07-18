export const dynamic = 'force-dynamic';

import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquareQuote } from 'lucide-react';
import TestimonialFormDialog from './TestimonialFormDialog';
import { ActionButtons } from './ActionButtons';
import { SortableTableBody } from '@/components/ui/SortableTableBody';
import { SortableTableRow } from '@/components/ui/SortableTableRow';
import { reorderAction } from '../../actions';

export default async function TestimonialsAdminPage() {
  const allTestimonials = await db.select().from(testimonials).orderBy(asc(testimonials.orderIdx));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Kelola Testimoni</h1>
          <p className="text-sm text-zinc-500 mt-1">Tambahkan ulasan dan pendapat dari klien Anda.</p>
        </div>
        <TestimonialFormDialog />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-16 font-semibold text-zinc-600 dark:text-zinc-400">Avatar</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Klien</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Ulasan</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <SortableTableBody items={allTestimonials} onReorder={reorderAction.bind(null, 'testimonials')}>
              {allTestimonials.map((item) => (
                <SortableTableRow id={item.id} key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors">
                  <TableCell>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.avatarUrl} alt={item.clientName} className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{item.clientName}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">{item.role}</div>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <div className="truncate text-sm text-zinc-600 dark:text-zinc-300" title={item.contentId}>
                      &quot;{item.contentId}&quot;
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TestimonialFormDialog editItem={item} />
                      <ActionButtons item={item} />
                    </div>
                  </TableCell>
                </SortableTableRow>
              ))}
              {allTestimonials.length === 0 && (
                <TableRow key="empty">
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <MessageSquareQuote className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada testimoni</p>
                      <p className="text-sm">Ulasan dari klien Anda akan ditampilkan di sini.</p>
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
