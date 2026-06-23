import { db } from '@/db';
import { leads } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ringkasan Prospek Masuk</h1>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Daftar Prospek Masuk (Leads)</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Nama Klien</TableHead>
              <TableHead>Perusahaan</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.createdAt.toLocaleDateString('id-ID')}</TableCell>
                <TableCell className="font-medium">{lead.clientName}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>{lead.estimatedBudget}</TableCell>
                <TableCell>
                  <Badge variant={lead.status === 'New' ? 'default' : 'secondary'}>{lead.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {allLeads.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada prospek masuk.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
