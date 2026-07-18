'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import PricingFormDialog from './PricingFormDialog';
import { ActionButtons } from './ActionButtons';
import { SortableTableBody } from '@/components/ui/SortableTableBody';
import { SortableTableRow } from '@/components/ui/SortableTableRow';
import { reorderAction } from '../../actions';

type PricingItem = {
  id: string;
  name: string;
  price: string;
  featuresJson: string;
  isPopular: boolean;
  type: string;
  orderIdx: number;
};

export default function PricingTableList({ allPricing }: { allPricing: PricingItem[] }) {
  return (
    <SortableTableBody items={allPricing} onReorder={reorderAction.bind(null, 'pricingPlans')}>
      {allPricing.map((item) => (
            <SortableTableRow id={item.id} key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors">
              <TableCell>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">{item.type}</div>
              </TableCell>
              <TableCell className="font-medium text-zinc-700 dark:text-zinc-300">{item.price}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={
                    item.isPopular 
                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50' 
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                  }
                >
                  {item.isPopular ? 'Terpopuler' : 'Standar'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <PricingFormDialog editItem={item} />
                  <ActionButtons item={item} />
                </div>
              </TableCell>
            </SortableTableRow>
          ))}
          {allPricing.length === 0 && (
            <TableRow key="empty">
              <TableCell colSpan={5} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center text-zinc-500">
                  <CreditCard className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada paket</p>
                  <p className="text-sm">Paket harga akan ditampilkan di sini.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
            </SortableTableBody>
  );
}
