export const dynamic = 'force-dynamic';

import { db } from '@/db';
import { pricingPlans } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PricingFormDialog from './PricingFormDialog';
import PricingTableList from './PricingTableList';

export default async function PricingAdminPage() {
  const allPricing = await db.select().from(pricingPlans).orderBy(asc(pricingPlans.orderIdx));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Kelola Paket Harga</h1>
          <p className="text-sm text-zinc-500 mt-1">Atur penawaran harga dan fitur yang ditampilkan di website.</p>
        </div>
        <PricingFormDialog />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Nama Paket</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Harga</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Status Populer</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <PricingTableList allPricing={allPricing} />
          </Table>
        </div>
      </div>
    </div>
  );
}
