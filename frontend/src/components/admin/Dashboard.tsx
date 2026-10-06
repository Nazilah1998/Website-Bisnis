import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import type { Locale } from "@/i18n/ui";
import { toDate } from "@/lib/api";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { Users, Inbox, Briefcase, BookOpen, TrendingUp } from "lucide-react";

export interface RecentLead {
  id: string;
  clientName: string;
  company?: string;
  whatsappNumber?: string;
  estimatedBudget?: string;
  status: string;
  createdAt?: string | null;
}

export interface AdminStats {
  barData: { month: string; count: number }[];
  pieData: { name: string; value: number }[];
  recentLeads: RecentLead[];
  totalLeads: number;
  leadsThisMonth: number;
  totalPosts: number;
  totalPortfolios: number;
  totalClients: number;
}

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

function LeadsCharts({ barData = [], pieData = [] }: { barData: AdminStats["barData"]; pieData: AdminStats["pieData"] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Leads Masuk (6 Bulan Terakhir)</h3>
        <p className="text-xs text-zinc-500 mb-6">Jumlah prospek baru yang masuk setiap bulan</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", color: "#fff", fontSize: 13 }}
              cursor={{ fill: "rgba(99,102,241,0.08)" }}
            />
            <Bar dataKey="count" name="Leads" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Distribusi Status Lead</h3>
        <p className="text-xs text-zinc-500 mb-4">Persentase leads berdasarkan status penanganan</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", color: "#fff", fontSize: 13 }}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface Props {
  lang: Locale;
  stats: AdminStats | null;
}

function formatDate(value?: string | null): string {
  const date = toDate(value);
  if (!date) return "-";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function Dashboard({ lang, stats }: Props) {
  const allLeads = stats?.recentLeads ?? [];
  const kpiCards = [
    { title: "Total Leads", value: stats?.totalLeads ?? 0, icon: Inbox, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", desc: "Semua prospek masuk" },
    { title: "Leads Bulan Ini", value: stats?.leadsThisMonth ?? 0, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", desc: "Prospek baru bulan ini" },
    { title: "Total Portofolio", value: stats?.totalPortfolios ?? 0, icon: Briefcase, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20", desc: "Proyek aktif ditampilkan" },
    { title: "Blog Artikel", value: stats?.totalPosts ?? 0, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", desc: "Konten yang sudah diterbitkan" },
    { title: "Klien Terdaftar", value: stats?.totalClients ?? 0, icon: Users, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20", desc: "Klien di Client Portal" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard Utama</h1>
        <p className="text-sm text-zinc-500 mt-1">Ringkasan performa bisnis dan aktivitas terbaru.</p>
      </div>

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

      <LeadsCharts barData={stats?.barData ?? []} pieData={stats?.pieData ?? []} />

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
                  <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">{formatDate(lead.createdAt)}</td>
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