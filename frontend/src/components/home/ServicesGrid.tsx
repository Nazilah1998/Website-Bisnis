'use client';

import type { Locale } from "@/i18n/ui";
import * as LucideIcons from "lucide-react";
import {
  Code2,
  Smartphone,
  Bot,
  CreditCard,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Layers
} from "lucide-react";

interface ServiceRecord {
  id: string;
  iconName?: string | null;
  titleId?: string | null;
  titleEn?: string | null;
  descId?: string | null;
  descEn?: string | null;
  [key: string]: unknown;
}

interface Props {
  lang: Locale;
  services: ServiceRecord[];
  labels: { title: string; subtitle: string };
}

export default function ServicesGrid({ lang, services, labels }: Props) {
  const isEn = lang === 'en';

  return (
    <section id="services" className="py-24 bg-background scroll-mt-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-semibold text-blue-400 mb-4">
            <Layers className="w-4 h-4" />
            <span>{isEn ? 'Core Capabilities' : 'Kapabilitas Rekayasa Digital'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {labels.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            {labels.subtitle}
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Card 1: Enterprise Web Apps (Col Span 2) */}
          <div className="md:col-span-2 rounded-[2rem] p-1.5 bg-gradient-to-b from-blue-500/20 via-white/5 to-transparent border border-white/10 shadow-2xl hover:border-blue-500/30 transition-all duration-500 group">
            <div className="rounded-[1.7rem] bg-zinc-950/90 p-6 sm:p-8 h-full flex flex-col justify-between border border-white/10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-blue-300">
                    Flagship Architecture
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {isEn ? 'High-Performance Web & Enterprise Apps' : 'Custom Web App & Platform Enterprise'}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-xl">
                  {isEn
                    ? 'Built with Astro 7 SSR, React 19 Islands, and Go Fiber v3 microservices. Engineered for high concurrency, instant response, and clean maintainability.'
                    : 'Dibangun dengan arsitektur Astro 7 SSR, React 19 Islands, dan Go Fiber v3 API backend. Dirancang untuk beban lalu lintas tinggi, kecepatan kilat, dan kode modular.'}
                </p>
              </div>

              {/* Code Snippet / Feature Pills */}
              <div className="rounded-xl p-4 bg-black/60 border border-white/5 font-mono text-xs text-zinc-300 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Sub-second TTFB & Edge Cache</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Zero Hardcode (Infisical Cloud)</span>
                </div>
                <a
                  href="#calculator"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-sans font-semibold text-xs ml-auto"
                >
                  <span>{isEn ? 'Estimate Cost' : 'Cek Biaya'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Mobile-First PWA & Android TWA (Col Span 1) */}
          <div className="md:col-span-1 rounded-[2rem] p-1.5 bg-gradient-to-b from-purple-500/20 via-white/5 to-transparent border border-white/10 shadow-2xl hover:border-purple-500/30 transition-all duration-500 group">
            <div className="rounded-[1.7rem] bg-zinc-950/90 p-6 sm:p-8 h-full flex flex-col justify-between border border-white/10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-semibold text-purple-300">
                    Mobile Native
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {isEn ? 'Mobile PWA & Android TWA' : 'Mobile PWA & Android TWA'}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {isEn
                    ? 'Transform your web system into installable mobile apps for iOS and Google Play Store (.APK/.AAB) with zero native SDK complexity.'
                    : 'Website yang dapat diinstal langsung di layar smartphone atau dipublikasikan ke Google Play Store (.APK/.AAB) dengan efisiensi biaya maksimal.'}
                </p>
              </div>

              {/* Phone Mockup Teaser */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between text-xs text-purple-200">
                <span>📱 Installable on iOS & Android</span>
                <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded font-bold">Offline Ready</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: AI Assistant & Autonomous Agents (Col Span 1) */}
          <div className="md:col-span-1 rounded-[2rem] p-1.5 bg-gradient-to-b from-cyan-500/20 via-white/5 to-transparent border border-white/10 shadow-2xl hover:border-cyan-500/30 transition-all duration-500 group">
            <div className="rounded-[1.7rem] bg-zinc-950/90 p-6 sm:p-8 h-full flex flex-col justify-between border border-white/10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-semibold text-cyan-300">
                    Autonomous AI
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {isEn ? 'AI Agents & Chatbot 24/7' : 'Integrasi AI & Asisten Chatbot 24/7'}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {isEn
                    ? 'Connect Gemini AI or custom LLMs to handle client inquiries, qualify leads, and automate operational workflows around the clock.'
                    : 'Otomatisasi pelayanan pelanggan dengan AI cerdas yang memahami katalog produk, menjawab pertanyaan teknis, dan mengumpulkan kontak prospek.'}
                </p>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>"Halo! Saya asisten ZilyaDigital, ada yang bisa dibantu?"</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Fintech & DOKU Payment (Col Span 2) */}
          <div className="md:col-span-2 rounded-[2rem] p-1.5 bg-gradient-to-b from-emerald-500/20 via-white/5 to-transparent border border-white/10 shadow-2xl hover:border-emerald-500/30 transition-all duration-500 group">
            <div className="rounded-[1.7rem] bg-zinc-950/90 p-6 sm:p-8 h-full flex flex-col justify-between border border-white/10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-300">
                    Payment Gateway
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {isEn ? 'E-Commerce & Automated Invoicing' : 'E-Commerce & Pembayaran DOKU Otomatis'}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-xl">
                  {isEn
                    ? 'Seamless checkout with DOKU Payment Gateway integration: QRIS, BCA/Mandiri/BRI Virtual Accounts, Credit Cards, and automated webhook invoice reconciliation.'
                    : 'Terima pembayaran digital instan melalui QRIS, Virtual Account semua bank nasional, kartu kredit, dan rekonsiliasi tagihan otomatis langsung ke portal klien.'}
                </p>
              </div>

              {/* Payment Methods Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                {['QRIS Instant', 'BCA / Mandiri VA', 'Kartu Kredit / Visa', 'E-Wallet', 'Webhook Reconciled'].map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-medium text-zinc-300"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Services from PocketBase if any */}
        {services.length > 0 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((s) => {
              const IconComponent =
                (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                  s.iconName ?? ''
                ] ?? LucideIcons.CheckCircle;
              const title = isEn ? s.titleEn : s.titleId;
              const description = isEn ? s.descEn : s.descId;

              return (
                <div
                  key={s.id}
                  className="rounded-2xl p-6 bg-white/[0.02] border border-white/10 hover:border-blue-500/30 transition-all group"
                >
                  <div className="p-3 bg-white/5 rounded-xl w-max mb-4 ring-1 ring-white/10 group-hover:bg-blue-500/20 transition-colors">
                    <IconComponent className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
