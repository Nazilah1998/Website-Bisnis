export const dynamic = 'force-dynamic';

import { db } from '@/db';
import { leads, posts, portfolios, clients } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';
import { LeadsCharts } from './LeadsCharts';
import { LeadStatusBadge } from './LeadStatusBadge';
import { Users, Inbox, Briefcase, BookOpen, TrendingUp } from 'lucide-react';

// Helper: last 6 months bar chart data
async function getLeadsPerMonth() {
  const result = await db.execute(sql`
    SELECT 
      TO_CHAR(created_at AT TIME ZONE 'Asia/Jakarta', 'Mon') AS month,
      EXTRACT(YEAR FROM created_at AT TIME ZONE 'Asia/Jakarta') AS year,
      EXTRACT(MONTH FROM created_at AT TIME ZONE 'Asia/Jakarta') AS month_num,
      COUNT(*)::int AS count
    FROM leads
    WHERE created_at >= NOW() - INTERVAL '6 months'
    GROUP BY month, year, month_num
    ORDER BY year ASC, month_num ASC
  `);
  return (result as unknown as { rows: { month: string; count: number }[] }).rows;
}

async function getLeadsStatusDist() {
  const result = await db.execute(sql`
    SELECT status AS name, COUNT(*)::int AS value
    FROM leads
    GROUP BY status
    ORDER BY value DESC
  `);
  return (result as unknown as { rows: { name: string; value: number }[] }).rows;
}

export default async function DashboardPage() {
  const [allLeads, barData, pieData, totalPosts, totalPortfolios, totalClients] = await Promise.all([
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(8),
    getLeadsPerMonth(),
    getLeadsStatusDist(),
    db.select({ count: sql<number>`count(*)::int` }).from(posts),
    db.select({ count: sql<number>`count(*)::int` }).from(portfolios),
    db.select({ count: sql<number>`count(*)::int` }).from(clients),
  ]);

  const totalLeads = allLeads.length;
  const thisMonth = new Date();
  const leadsThisMonth = allLeads.filter(l => {
    const d = new Date(l.createdAt);
    return d.getMonth() === thisMonth.getMonth() && d.getFullYear() === thisMonth.getFullYear();
  }).length;

  const kpiCards = [
    { title: 'Total Leads', value: totalLeads, icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', desc: 'Semua prospek masuk' },
    { title: 'Leads Bulan Ini', value: leadsThisMonth, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', desc: 'Prospek baru bulan ini' },
    { title: 'Total Portofolio', value: totalPortfolios[0]?.count || 0, icon: Briefcase, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20', desc: 'Proyek aktif ditampilkan' },
    { title: 'Blog Artikel', value: totalPosts[0]?.count || 0, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', desc: 'Konten yang sudah diterbitkan' },
    { title: 'Klien Terdaftar', value: totalClients[0]?.count || 0, icon: Users, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20', desc: 'Klien di Client Portal' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard Utama</h1>
        <p className="text-sm text-zinc-500 mt-1">Ringkasan performa bisnis dan aktivitas terbaru.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => (
          <div key={card.title} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{card.title}</p>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{card.value}</p>
            <p className="text-xs text-zinc-400">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <LeadsCharts barData={barData} pieData={pieData} />

      {/* Recent Leads Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">Leads Terbaru</h2>
          <p className="text-xs text-zinc-500 mt-0.5">8 prospek terbaru. Klik status untuk mengubahnya.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50">
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 text-xs">Tanggal</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 text-xs">Nama & Perusahaan</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 text-xs">WhatsApp</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 text-xs">Budget</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {allLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                    {lead.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{lead.clientName}</div>
                    <div className="text-xs text-zinc-500">{lead.company}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-xs">{lead.whatsappNumber}</td>
                  <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300 text-xs">{lead.estimatedBudget}</td>
                  <td className="px-4 py-3">
                    <LeadStatusBadge leadId={lead.id} initialStatus={lead.status} />
                  </td>
                </tr>
              ))}
              {allLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-zinc-400">
                    <Inbox className="w-10 h-10 mx-auto mb-2 text-zinc-300 dark:text-zinc-700" />
                    Belum ada leads yang masuk
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
