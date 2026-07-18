import { db } from '@/db';
import { portfolios } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';


type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const res = await db.select().from(portfolios).where(eq(portfolios.id, id)).limit(1);
  if (!res.length) return { title: 'Studi Kasus Tidak Ditemukan' };
  const p = res[0];
  return { title: `${locale === 'id' ? p.titleId : p.titleEn} – Case Study ZilyaDigital`, description: locale === 'id' ? p.descId : p.descEn };
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, id } = await params;
  const res = await db.select().from(portfolios).where(eq(portfolios.id, id)).limit(1);
  if (!res.length) notFound();

  const p = res[0];
  const title = locale === 'id' ? p.titleId : p.titleEn;
  const desc = locale === 'id' ? p.descId : p.descEn;
  let results: { metric: string; label: string }[] = [];
  try { if (p.results) results = JSON.parse(p.results); } catch { /* ignore */ }
  const techList = p.techStack.split(',').map((t) => t.trim());

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="w-full h-80 md:h-[420px] overflow-hidden bg-zinc-800 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.imageUrl} alt={title} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-medium mb-3 capitalize">{p.category}</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">{title}</h1>
          <p className="text-zinc-400">{p.clientName}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-10">
        <Link href="/#portfolio" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portofolio
        </Link>

        {/* Results KPI */}
        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {results.map((r, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 text-center shadow-sm">
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-emerald-400 mb-1">{r.metric}</div>
                <div className="text-xs text-zinc-500">{r.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">Gambaran Proyek</h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
            </div>

            {/* Challenge */}
            {p.challenge && (
              <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800/30 p-6">
                <h2 className="text-lg font-bold text-red-700 dark:text-red-400 mb-3">🎯 Tantangan</h2>
                <p className="text-red-900/80 dark:text-red-300 leading-relaxed text-sm">{p.challenge}</p>
              </div>
            )}

            {/* Solution */}
            {p.solution && (
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800/30 p-6">
                <h2 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-3">💡 Solusi yang Diberikan</h2>
                <p className="text-blue-900/80 dark:text-blue-300 leading-relaxed text-sm">{p.solution}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wide">Teknologi</h3>
              <div className="flex flex-wrap gap-2">
                {techList.map((tech, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                    <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-500" />{tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Live URL */}
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium text-sm transition-colors">
                <ExternalLink className="w-4 h-4" /> Lihat Website Live
              </a>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white text-center">
              <p className="font-bold mb-1">Proyek Serupa?</p>
              <p className="text-blue-200 text-xs mb-4">Hubungi kami untuk konsultasi gratis</p>
              <Link href="/#booking" className="inline-block bg-white text-blue-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
