'use client';

import { useState } from "react";
import type { Locale } from "@/i18n/ui";
import { SpotlightCard } from "../ui/SpotlightCard";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ExternalLink, Layers, Sparkles } from "lucide-react";
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

  // Extract unique categories
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
    <section id="portfolio" className="py-24 bg-muted/20 scroll-mt-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
            <Layers className="w-3.5 h-3.5" /> Karya Terbaik
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{labels.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{labels.subtitle}</p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const label = cat === "all" ? (lang === "en" ? "All Works" : "Semua") : cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const title = lang === "en" ? item.titleEn : item.titleId;

            return (
              <SpotlightCard
                key={item.id}
                className="group p-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-900"
                  onClick={() => setActiveProject(item)}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={title ?? "Portfolio thumbnail"}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-500">
                      No Image
                    </div>
                  )}

                  {/* Top Category Badge */}
                  {item.category && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-black/70 backdrop-blur-md text-white border-white/10 text-xs font-medium">
                        {item.category}
                      </Badge>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-bold translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {title}
                    </h3>
                    <p className="text-zinc-300 text-sm mt-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {item.clientName}
                    </p>
                    <span className="text-blue-400 text-xs font-semibold mt-3 flex items-center gap-1">
                      Klik untuk melihat detail &rarr;
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {lang === "en" ? "No portfolio items in this category." : "Belum ada portofolio di kategori ini."}
            </div>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={Boolean(activeProject)} onOpenChange={(open) => !open && setActiveProject(null)}>
        <DialogContent className="max-w-2xl bg-zinc-950 border-white/15 text-white p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
          {activeProject && (
            <>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 mb-4 border border-white/10">
                {activeProject.imageUrl && (
                  <img
                    src={activeProject.imageUrl}
                    alt={lang === "en" ? activeProject.titleEn ?? "" : activeProject.titleId ?? ""}
                    className="w-full h-full object-cover"
                  />
                )}
                {activeProject.category && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-blue-600 text-white">{activeProject.category}</Badge>
                  </div>
                )}
              </div>

              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold text-white">
                  {lang === "en" ? activeProject.titleEn : activeProject.titleId}
                </DialogTitle>
                <DialogDescription className="text-zinc-400 text-sm">
                  Klien: <span className="text-zinc-200 font-medium">{activeProject.clientName ?? "Klien Rahasia"}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Description */}
              {(activeProject.descId || activeProject.descEn) && (
                <div className="mb-4">
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {lang === "en" ? activeProject.descEn : activeProject.descId}
                  </p>
                </div>
              )}

              {/* Tech Stack */}
              {activeProject.techStack && (
                <div className="mb-6">
                  <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                    Teknologi Digunakan:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.techStack.split(",").map((t, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-white/5 border-white/10 text-zinc-300 text-xs"
                      >
                        {t.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-white/10">
                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Kunjungi Website
                  </a>
                )}
                <a
                  href="#booking"
                  onClick={() => setActiveProject(null)}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/10 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" /> Pesan Proyek Serupa
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}