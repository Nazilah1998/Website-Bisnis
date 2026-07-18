import { db } from '@/db';
import { invoices, projects, clients } from '@/db/schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import InvoiceFormDialog from './InvoiceFormDialog';
import { InvoiceDeleteButton } from './InvoiceDeleteButton';

const STATUS_STYLE: Record<string, string> = {
  unpaid: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400',
  overdue: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
};
const STATUS_LABEL: Record<string, string> = { unpaid: 'Belum Lunas', paid: 'Lunas', overdue: 'Jatuh Tempo' };

export default async function InvoicesAdminPage() {
  const [allInvoices, allProjects, allClients] = await Promise.all([
    db.select().from(invoices),
    db.select().from(projects),
    db.select().from(clients),
  ]);

  const clientMap = Object.fromEntries(allClients.map(c => [c.id, c.name]));
  const projectMap = Object.fromEntries(allProjects.map(p => [p.id, { title: p.title, clientId: p.clientId }]));

  const projectOptions = allProjects.map(p => ({
    id: p.id,
    title: p.title,
    clientName: clientMap[p.clientId] || 'Unknown',
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Sistem Tagihan (Invoice)</h1>
          <p className="text-sm text-zinc-500 mt-1">Kelola tagihan proyek dan status pembayaran klien.</p>
        </div>
        <InvoiceFormDialog projects={projectOptions} />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Deskripsi Tagihan</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Klien / Proyek</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Nominal</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Tgl. Jatuh Tempo</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Status</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allInvoices.map((inv) => {
                const proj = projectMap[inv.projectId];
                return (
                  <TableRow key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{inv.description}</TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{proj ? clientMap[proj.clientId] : '—'}</div>
                      <div className="text-xs text-zinc-500">{proj?.title}</div>
                    </TableCell>
                    <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Rp {inv.amount.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(inv.dueDate).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_STYLE[inv.status] || ''}>
                        {STATUS_LABEL[inv.status] || inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <InvoiceFormDialog editItem={inv} projects={projectOptions} />
                        <InvoiceDeleteButton id={inv.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {allInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                    Belum ada tagihan.
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
