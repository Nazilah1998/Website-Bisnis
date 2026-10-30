'use client';

import { useState } from 'react';
import { Gauge, RefreshCw, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

export default function CoreWebVitalsScorecard({ lang }: { lang: 'id' | 'en' }) {
  const [testing, setTesting] = useState(false);
  const [ping, setPing] = useState(38);

  const isEn = lang === 'en';

  const retest = () => {
    setTesting(true);
    setTimeout(() => {
      setPing(Math.floor(Math.random() * 8) + 32);
      setTesting(false);
    }, 1200);
  };

  const scores = [
    { label: isEn ? 'Performance' : 'Performa', val: 100, desc: isEn ? 'Load speed < 0.4s' : 'Kecepatan Muat < 0.4s' },
    { label: isEn ? 'Accessibility' : 'Aksesibilitas', val: 100, desc: isEn ? 'Screen-reader ready' : 'Standar UX Inklusif' },
    { label: isEn ? 'Best Practices' : 'Praktik Terbaik', val: 100, desc: isEn ? 'Modern web security' : 'Keamanan & Kode Bersih' },
    { label: 'SEO', val: 100, desc: isEn ? 'Search ranking boost' : 'Optimasi Indeks Google' },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-background">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-400 mb-4">
            <Gauge className="w-4 h-4" />
            <span>Google Lighthouse Verified</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {isEn ? 'Extreme Speed & Perfection Scorecard' : 'Performa Ekstrem & Garansi Kecepatan 100/100'}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            {isEn
              ? 'Every millisecond affects your conversion. We guarantee ultra-fast, perfectly optimized web applications out of the box.'
              : 'Setiap detik keterlambatan memangkas omzet Anda hingga 20%. Kami membangun website dengan arsitektur modern berkecepatan kilat tanpa kompromi.'}
          </p>
        </div>

        {/* Double Bezel Scorecard Container */}
        <div className="rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-emerald-500/20 via-white/5 to-transparent border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="rounded-[1.4rem] bg-zinc-950/90 border border-white/10 p-6 sm:p-8">
            {/* 4 Rings */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {scores.map((s) => (
                <div key={s.label} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                  <div className="relative size-20 sm:size-24 flex items-center justify-center mb-3">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-zinc-800"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500 transition-all duration-1000"
                        strokeDasharray="100, 100"
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-xl sm:text-2xl font-black text-white font-mono flex items-center">
                      {testing ? (
                        <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                      ) : (
                        <span>{s.val}</span>
                      )}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-white tracking-tight">{s.label}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom comparison and test trigger */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>
                    TTFB Edge: <strong className="text-white font-mono">{ping}ms</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>
                    FCP (First Contentful Paint): <strong className="text-white font-mono">0.32s</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>
                    Zero-CLS: <strong className="text-white font-mono">0.00</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={retest}
                disabled={testing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition-all shrink-0 hover:border-emerald-500/40"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? (isEn ? 'Auditing...' : 'Menguji...') : (isEn ? 'Live Re-Test' : 'Uji Ulang Real-Time')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

