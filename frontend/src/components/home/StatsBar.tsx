import type { Locale } from "@/i18n/ui";
import type { StatRecord } from "@/lib/records";
import { CheckCircle2, Users, Award, Clock } from "lucide-react";

interface Props {
  lang: Locale;
  stats: StatRecord[];
}

export default function StatsBar({ lang, stats }: Props) {
  const fallbackStats = [
    { id: "s1", value: "150+", labelId: "Proyek Selesai", labelEn: "Completed Projects" },
    { id: "s2", value: "99%", labelId: "Klien Puas", labelEn: "Happy Clients" },
    { id: "s3", value: "20+", labelId: "Ahli IT & Desainer", labelEn: "IT Experts & Designers" },
    { id: "s4", value: "5+", labelId: "Tahun Pengalaman", labelEn: "Years Experience" },
  ];

  const items = stats && stats.length > 0 ? stats : fallbackStats;
  const icons = [CheckCircle2, Users, Award, Clock];

  return (
    <section className="relative z-10 -mt-10 mb-8 container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-blue-500/5">
        {items.map((stat, idx) => {
          const Icon = icons[idx % icons.length];
          const label = lang === "en" ? stat.labelEn : stat.labelId;

          return (
            <div
              key={stat.id || idx}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-zinc-400 font-medium truncate">
                  {label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
