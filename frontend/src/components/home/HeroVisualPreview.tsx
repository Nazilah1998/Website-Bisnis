'use client';

import { useState } from 'react';
import { ShieldCheck, Zap, Activity, Terminal, Globe, ArrowUpRight, Cpu } from 'lucide-react';

export default function HeroVisualPreview({ lang }: { lang: 'id' | 'en' }) {
  const [activeTab, setActiveTab] = useState<'preview' | 'architecture'>('preview');

  const isEn = lang === 'en';

  return (
    <div className="relative max-w-4xl mx-auto mt-12 px-2 sm:px-4 z-20">
      {/* Background ambient radial aura */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-500/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Double-Bezel Outer Shell */}
      <div className="relative rounded-[1.75rem] sm:rounded-[2.25rem] p-1.5 sm:p-2 bg-gradient-to-b from-white/20 via-white/5 to-white/0 border border-white/15 shadow-[0_25px_80px_rgba(37,99,235,0.2)] backdrop-blur-2xl">
        {/* Inner Core Container */}
        <div className="rounded-[1.4rem] sm:rounded-[1.9rem] bg-zinc-950/90 border border-white/10 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-left">
          
          {/* Mockup Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Address Bar */}
            <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-4 py-1 rounded-full text-[11px] sm:text-xs text-zinc-400 font-mono max-w-[280px] sm:max-w-md w-full justify-center">
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate text-zinc-300">https://zilya.id/high-performance</span>
              <span className="text-emerald-400 font-sans text-[10px] ml-1 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                100/100
              </span>
            </div>

            {/* Tab switchers */}
            <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isEn ? 'Overview' : 'Performa'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('architecture')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  activeTab === 'architecture' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isEn ? 'Stack' : 'Teknologi'}
              </button>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-4 sm:p-6">
            {activeTab === 'preview' ? (
              <div className="space-y-4 sm:space-y-6">
                {/* 4 Key Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                  <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Speed Index</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">0.38s</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">99% Lebih Kilat</div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium mb-1">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Lighthouse</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">100 / 100</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 font-medium">Core Web Vitals</div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Security & SLA</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">99.98%</div>
                    <div className="text-[10px] text-cyan-400 mt-0.5 font-medium">Enterprise Grade</div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Avg. Conversion</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">+185%</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">Optimal ROI</div>
                  </div>
                </div>

                {/* Live Architecture Visual Banner */}
                <div className="rounded-xl p-4 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-zinc-900 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5" /> Full-Stack Architecture
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white">Astro 7 (SSR) + Go Fiber v3 + PocketBase Engine</h4>
                    <p className="text-xs text-zinc-400">
                      Zero-bloat bundle size, instant TTFB response, and robust microservice APIs.
                    </p>
                  </div>
                  <a
                    href="#calculator"
                    className="shrink-0 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-blue-500/25"
                  >
                    <span>{isEn ? 'Calculate Cost' : 'Simulasi Biaya'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-black/70 p-4 border border-white/10 font-mono text-xs text-zinc-300 space-y-2">
                <div className="flex items-center gap-2 text-zinc-500 pb-2 border-b border-white/5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span>deployment_stack.config.ts</span>
                </div>
                <p className="text-zinc-500">// Modern High-Speed Production Blueprint</p>
                <p><span className="text-purple-400">export const</span> <span className="text-blue-300">stack</span> = &#123;</p>
                <p className="pl-4"><span className="text-cyan-300">frontend</span>: <span className="text-emerald-300">"Astro 7 SSR + React 19 Islands + Tailwind v4"</span>,</p>
                <p className="pl-4"><span className="text-cyan-300">backend</span>: <span className="text-emerald-300">"Go Fiber v3 + High Concurrency Air"</span>,</p>
                <p className="pl-4"><span className="text-cyan-300">database</span>: <span className="text-emerald-300">"PocketBase Super-Fast Migrations"</span>,</p>
                <p className="pl-4"><span className="text-cyan-300">secrets</span>: <span className="text-emerald-300">"Infisical Cloud (Zero Hardcode)"</span>,</p>
                <p className="pl-4"><span className="text-cyan-300">payment</span>: <span className="text-emerald-300">"DOKU Payment Gateway Native"</span>,</p>
                <p className="pl-4"><span className="text-cyan-300">performance</span>: <span className="text-amber-300">"100/100 Core Web Vitals Guaranteed"</span></p>
                <p>&#125;;</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

