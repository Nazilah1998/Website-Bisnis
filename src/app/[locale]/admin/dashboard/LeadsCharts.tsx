'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface LeadsChartProps {
  barData: { month: string; count: number }[];
  pieData: { name: string; value: number }[];
}

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export function LeadsCharts({ barData = [], pieData = [] }: LeadsChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Leads per Bulan */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Leads Masuk (6 Bulan Terakhir)</h3>
        <p className="text-xs text-zinc-500 mb-6">Jumlah prospek baru yang masuk setiap bulan</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: 13 }}
              cursor={{ fill: 'rgba(99,102,241,0.08)' }}
            />
            <Bar dataKey="count" name="Leads" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Status Distribution */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Distribusi Status Lead</h3>
        <p className="text-xs text-zinc-500 mb-4">Persentase leads berdasarkan status penanganan</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff', fontSize: 13 }}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
