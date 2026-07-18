import { db } from '@/db';
import { faqs } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HelpCircle } from 'lucide-react';
import FaqFormDialog from './FaqFormDialog';
import { ActionButtons } from './ActionButtons';
import { SortableTableBody } from '@/components/ui/SortableTableBody';
import { SortableTableRow } from '@/components/ui/SortableTableRow';
import { reorderAction } from '../../actions';

export default async function FaqsAdminPage() {
  const allFaqs = await db.select().from(faqs).orderBy(asc(faqs.orderIdx));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Kelola FAQ</h1>
          <p className="text-sm text-zinc-500 mt-1">Atur daftar pertanyaan yang sering diajukan beserta jawabannya.</p>
        </div>
        <FaqFormDialog />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Pertanyaan (ID)</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Pratinjau Jawaban</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <SortableTableBody items={allFaqs} onReorder={reorderAction.bind(null, 'faqs')}>
              {allFaqs.map((item) => (
                    <SortableTableRow id={item.id} key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors">
                      <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                        {item.questionId}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-zinc-500 dark:text-zinc-400">
                        {item.answerId}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <FaqFormDialog editItem={item} />
                          <ActionButtons item={item} />
                        </div>
                      </TableCell>
                    </SortableTableRow>
                  ))}
                  {allFaqs.length === 0 && (
                    <TableRow key="empty">
                      <TableCell colSpan={4} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center text-zinc-500">
                          <HelpCircle className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada FAQ</p>
                          <p className="text-sm">Silakan tambah FAQ baru melalui form di atas.</p>
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
