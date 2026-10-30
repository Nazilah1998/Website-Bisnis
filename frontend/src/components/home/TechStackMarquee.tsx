'use client';

interface TechItem {
  name: string;
  category: string;
  badge?: string;
}

const TECH_ITEMS: TechItem[] = [
  { name: 'Astro 7 (SSR)', category: 'Frontend Engine', badge: 'v7.4' },
  { name: 'React 19 Islands', category: 'UI Components' },
  { name: 'Go Fiber v3', category: 'High-Speed API', badge: 'v3.6' },
  { name: 'PocketBase', category: 'Database & Auth' },
  { name: 'Tailwind CSS v4', category: 'Design System' },
  { name: 'TypeScript', category: 'Type Safety' },
  { name: 'Docker Multi-Stage', category: 'Container Runtime' },
  { name: 'Cloudflare Turnstile', category: 'Bot Shield & CDN' },
  { name: 'DOKU Payment', category: 'Fintech Gateway' },
  { name: 'Infisical Cloud', category: 'Zero-Hardcode Secrets' },
  { name: 'Gemini AI API', category: 'LLM & Autonomous Agent' },
  { name: 'PWA & Android TWA', category: 'Mobile Architecture' },
];

export default function TechStackMarquee({ lang }: { lang: 'id' | 'en' }) {
  const isEn = lang === 'en';

  return (
    <section className="py-12 border-y border-white/5 bg-zinc-950/40 overflow-hidden relative">
      {/* Edge gradient fade masks */}
      <div className="absolute left-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-4 mb-5 text-center">
        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.25em]">
          {isEn
            ? 'Engineered with Modern Enterprise-Grade Architecture'
            : 'Dibangun dengan Arsitektur Teknologi Terdepan & Standar Enterprise'}
        </p>
      </div>

      <div className="flex w-max space-x-4 animate-marquee hover:[animation-play-state:paused]">
        {/* Render twice for continuous infinite loop */}
        {[...TECH_ITEMS, ...TECH_ITEMS].map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/40 transition-all duration-300 shadow-sm shrink-0"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                {item.name}
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

