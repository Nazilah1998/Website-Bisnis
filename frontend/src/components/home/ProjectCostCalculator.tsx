'use client';

import { useState } from 'react';
import { Calculator, Check, ArrowRight, MessageCircle, Sparkles, Clock, Shield } from 'lucide-react';

interface ProjectType {
  id: string;
  name: string;
  desc: string;
  baseMin: number;
  baseMax: number;
  weeks: string;
}

interface Addon {
  id: string;
  name: string;
  desc: string;
  cost: number;
}

const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'landing',
    name: 'Landing Page Promosi',
    desc: 'Halaman tunggal terfokus dengan konversi tinggi & integrasi WhatsApp.',
    baseMin: 2500000,
    baseMax: 4500000,
    weeks: '1 - 2 Minggu',
  },
  {
    id: 'compro',
    name: 'Company Profile & Katalog',
    desc: 'Website perusahaan multi-halaman profesional, portofolio, & SEO.',
    baseMin: 4500000,
    baseMax: 7500000,
    weeks: '2 - 3 Minggu',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce / Toko Online',
    desc: 'Katalog produk, keranjang belanja, & kalkulasi ongkir otomatis.',
    baseMin: 7500000,
    baseMax: 13500000,
    weeks: '3 - 4 Minggu',
  },
  {
    id: 'webapp',
    name: 'Custom Web App / SaaS Portal',
    desc: 'Dashboard interaktif, manajemen user/role, database & Go API.',
    baseMin: 14000000,
    baseMax: 24000000,
    weeks: '4 - 6 Minggu',
  },
  {
    id: 'mobile',
    name: 'Mobile App (PWA & Android TWA)',
    desc: 'Aplikasi web yang dapat diinstal langsung di smartphone & Play Store.',
    baseMin: 5500000,
    baseMax: 9500000,
    weeks: '2 - 3 Minggu',
  },
];

const ADDONS: Addon[] = [
  { id: 'i18n', name: 'Multi-Bahasa (ID & EN)', desc: 'Ekspansi pasar internasional dengan routing i18n bersih.', cost: 1000000 },
  { id: 'payment', name: 'Payment Gateway DOKU', desc: 'Terima QRIS, VA Bank, Kartu Kredit, & e-Wallet otomatis.', cost: 1500000 },
  { id: 'portal', name: 'Portal Klien & Ticketing', desc: 'Area login klien untuk tracking proyek & download file aset.', cost: 2000000 },
  { id: 'ai', name: 'AI Chatbot Assistant 24/7', desc: 'Asisten AI otomatis yang menjawab pertanyaan calon klien.', cost: 1800000 },
  { id: 'seo', name: 'Garansi Core Web Vitals 100/100', desc: 'Audit kecepatan ekstrem, schema markup, & ranking Google.', cost: 1200000 },
  { id: 'express', name: 'Jalur Kilat (Prioritas Express)', desc: 'Prioritas pengerjaan 2x lebih cepat dari jadwal standar.', cost: 1500000 },
];

export default function ProjectCostCalculator({ lang }: { lang: 'id' | 'en' }) {
  const [selectedType, setSelectedType] = useState<string>('compro');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['seo', 'payment']);

  const isEn = lang === 'en';

  const currentType = PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[0];

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addonTotal = selectedAddons.reduce((acc, currId) => {
    const found = ADDONS.find((a) => a.id === currId);
    return acc + (found ? found.cost : 0);
  }, 0);

  const totalMin = currentType.baseMin + addonTotal;
  const totalMax = currentType.baseMax + addonTotal;

  const fmtRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  const handleSendWA = () => {
    const selectedAddonNames = selectedAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const text = `Halo ZilyaDigital, saya sudah mencoba Kalkulator Estimasi Biaya di website.
Berikut rincian kebutuhan proyek saya:

📌 Tipe Proyek: ${currentType.name}
🛠️ Fitur Tambahan: ${selectedAddonNames || 'Standar (Tanpa Addon)'}
⏱️ Estimasi Waktu: ${currentType.weeks}
💰 Estimasi Biaya: ${fmtRupiah(totalMin)} - ${fmtRupiah(totalMax)}

Mohon informasi ketersediaan jadwal dan diskusi teknis lebih lanjut. Terima kasih!`;

    const cleanPhone = '6281234567890';
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="calculator" className="py-24 relative overflow-hidden bg-zinc-950/60 scroll-mt-24 border-t border-white/5">
      {/* Background radiant orbs */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-semibold text-blue-400 mb-4">
            <Calculator className="w-4 h-4" />
            <span>{isEn ? 'Transparent Estimation' : 'Transparansi Tanpa Biaya Tersembunyi'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {isEn ? 'Interactive Project Cost Estimator' : 'Kalkulator Estimasi Biaya Proyek Digital'}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            {isEn
              ? 'Customize your requirements and instantly view an accurate estimation range for your web or application project.'
              : 'Sesuaikan tipe aplikasi dan fitur yang Anda inginkan untuk mendapatkan estimasi investasi & estimasi durasi pengerjaan secara transparan.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls (8 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Project Type */}
            <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                    1
                  </span>
                  {isEn ? 'Select Project Type' : 'Pilih Jenis Proyek'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const active = type.id === selectedType;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        active
                          ? 'bg-blue-600/15 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                          : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-white">{type.name}</span>
                        {active && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-2">{type.desc}</p>
                      <div className="text-[11px] font-mono text-blue-400 font-semibold">
                        Mulai {fmtRupiah(type.baseMin)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Add-on Features */}
            <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                    2
                  </span>
                  {isEn ? 'Add-on Features & Integrations' : 'Fitur Tambahan & Integrasi'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDONS.map((addon) => {
                  const checked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        checked
                          ? 'bg-purple-600/15 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                          : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-white">{addon.name}</span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 border ${
                            checked ? 'bg-purple-600 border-purple-500' : 'border-zinc-600'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{addon.desc}</p>
                      <span className="text-[10px] font-mono text-purple-400 mt-1.5 block">
                        +{fmtRupiah(addon.cost)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary Box (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-[2rem] p-1.5 bg-gradient-to-b from-blue-500/30 via-purple-500/20 to-white/5 border border-white/15 shadow-2xl">
              <div className="rounded-[1.7rem] bg-zinc-950/90 p-6 sm:p-8 border border-white/10 backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {isEn ? 'Estimation Summary' : 'Ringkasan Estimasi'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <Sparkles className="w-3 h-3" /> Live Calculation
                  </span>
                </div>

                {/* Selected Product */}
                <div className="py-4 border-b border-white/10">
                  <div className="text-xs text-zinc-400">{isEn ? 'Base Project' : 'Dasar Proyek'}:</div>
                  <div className="text-base font-bold text-white mt-0.5">{currentType.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Waktu: {currentType.weeks}</span>
                  </div>
                </div>

                {/* Selected Addons List */}
                <div className="py-4 border-b border-white/10 space-y-1.5">
                  <div className="text-xs text-zinc-400 mb-1">{isEn ? 'Included Add-ons' : 'Fitur Tambahan Terpilih'}:</div>
                  {selectedAddons.length === 0 ? (
                    <div className="text-xs text-zinc-500 italic">Tidak ada fitur tambahan dipilih</div>
                  ) : (
                    selectedAddons.map((id) => {
                      const item = ADDONS.find((a) => a.id === id);
                      return (
                        <div key={id} className="flex items-center justify-between text-xs text-zinc-300">
                          <span className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400" />
                            {item?.name}
                          </span>
                          <span className="font-mono text-zinc-400">+{fmtRupiah(item?.cost || 0)}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Price Display */}
                <div className="py-6">
                  <div className="text-xs font-medium text-zinc-400 mb-1">
                    {isEn ? 'Estimated Investment Range' : 'Rentang Estimasi Investasi'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-blue-400 tracking-tight">
                    {fmtRupiah(totalMin)} - {fmtRupiah(totalMax)}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-400" />
                    <span>Termasuk garansi revisi, deployment cloud, & panduan pakai.</span>
                  </p>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleSendWA}
                    className="w-full h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 group"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" />
                    <span>{isEn ? 'Send to WhatsApp Now' : 'Kirim Estimasi ke WhatsApp'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href={`/#booking?plan=${encodeURIComponent(currentType.name)}&price=${encodeURIComponent(fmtRupiah(totalMin))}`}
                    className="w-full h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs flex items-center justify-center transition-all"
                  >
                    {isEn ? 'Lock This Estimate & Consult' : 'Kunci Estimasi & Konsultasi Formal'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

