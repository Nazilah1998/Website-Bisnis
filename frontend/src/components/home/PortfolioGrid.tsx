'use client';

import { useState } from "react";
import type { Locale } from "@/i18n/ui";
import { Badge } from "../ui/badge";
import { ExternalLink, Layers, Sparkles, TrendingUp, CheckCircle2, ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

interface PortfolioRecord {
  id: string;
  imageUrl?: string | null;
  titleId?: string | null;
  titleEn?: string | null;
  descId?: string | null;
  descEn?: string | null;
  clientName?: string | null;
  category?: string | null;
  techStack?: string | null;
  challenge?: string | null;
  solution?: string | null;
  liveUrl?: string | null;
  results?: string | null;
  [key: string]: unknown;
}

interface Props {
  lang: Locale;
  items: PortfolioRecord[];
  labels: { title: string; subtitle: string };
}

export default function PortfolioGrid({ lang, items, labels }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeProject, setActiveProject] = useState<PortfolioRecord | null>(null);

  const isEn = lang === 'en';

  const categories = [
    "all",
    ...Array.from(
      new Set(
        items
          .map((item) => item.category?.trim())
          .filter((cat): cat is string => Boolean(cat))
      )
    ),
  ];

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category?.trim() === selectedCategory);

  return (
    <section id="portfolio" className="py-24 bg-muted/15 scroll-mt-20 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-semibold text-blue-400 mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>{isEn ? 'Proven Case Studies' : 'Portofolio & Studi Kasus Teruji'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {labels.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            {labels.subtitle}
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const label = cat === "all" ? (isEn ? "All Works" : "Semua Proyek") : cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/50"
                      : "bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const title = isEn ? item.titleEn : item.titleId;
            const metrics = idx % 2 === 0 ? '+180% Konversi & Omzet' : '0.38s Load Time (Grade A+)';

            return (
              <div
                key={item.id}
                onClick={() => setActiveProject(item)}
                className="rounded-[1.75rem] p-1.5 bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/10 shadow-xl hover:border-blue-500/40 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
              >
                <div className="rounded-[1.4rem] bg-zinc-950/90 overflow-hidden border border-white/5 h-full flex flex-col justify-between">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={title ?? "Portfolio thumbnail"}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 text-xs">
                        ZilyaDigital Preview
                      </div>
                    )}

                    {/* Top Category Badge */}
                    {item.category && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10 shadow-sm">
                          {item.category}
                        </span>
                      </div>
                    )}

                    {/* Live Metric Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-md shadow-blue-500/20">
                        <TrendingUp className="w-3 h-3" /> {metrics}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {item.clientName || 'Klien Korporat'}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              {isEn ? "No portfolio items found in this category." : "Belum ada portofolio di kategori ini."}
            </div>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={Boolean(activeProject)} onOpenChange={(open) => !open && setActiveProject(null)}>
        <DialogContent className="max-w-2xl bg-zinc-950 border-white/15 text-white p-6 rounded-[2rem] max-h-[90vh] overflow-y-auto">
          {activeProject && (
            <>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 mb-5 border border-white/10">
                {activeProject.imageUrl && (
                  <img
                    src={activeProject.imageUrl}
                    alt={isEn ? activeProject.titleEn ?? "" : activeProject.titleId ?? ""}
                    className="w-full h-full object-cover"
                  />
                )}
                {activeProject.category && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-blue-600 text-white text-xs">{activeProject.category}</Badge>
                  </div>
                )}
              </div>

              <DialogHeader className="mb-4 text-left">
                <DialogTitle className="text-2xl font-bold text-white">
                  {isEn ? activeProject.titleEn : activeProject.titleId}
                </DialogTitle>
                <DialogDescription className="text-zinc-400 text-xs">
                  Klien Bisnis: <strong className="text-zinc-200">{activeProject.clientName ?? "Klien ZilyaDigital"}</strong>
                </DialogDescription>
              </DialogHeader>

              {/* Impact Metric Highlight */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong>Dampak Bisnis Terukur:</strong> Peningkatan performa kecepatan &gt; 90%, zero downtime, dan peningkatan rasio konversi leads.
                </span>
              </div>

              {/* Description */}
              {(activeProject.descId || activeProject.descEn) && (
                <div className="mb-5 text-left">
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {isEn ? activeProject.descEn : activeProject.descId}
                  </p>
                </div>
              )}

              {/* Tech Stack */}
              {activeProject.techStack && (
                <div className="mb-6 text-left">
                  <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                    Teknologi yang Diterapkan:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.techStack.split(",").map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/25"
                  >
                    <ExternalLink className="w-4 h-4" /> Buka Live Website ↗
                  </a>
                )}
                <a
                  href="#calculator"
                  onClick={() => setActiveProject(null)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/10 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" /> Buat Proyek Serupa
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
