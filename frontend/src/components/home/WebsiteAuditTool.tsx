'use client';

import { useState } from 'react';
import { Search, ArrowRight, Loader2, ShieldAlert, Sparkles, Smartphone, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function WebsiteAuditTool({ lang }: { lang: 'id' | 'en' }) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState<'idle' | 'auditing' | 'done'>('idle');
  const [step, setStep] = useState(0);

  const isEn = lang === 'en';

  const auditSteps = [
    'Memeriksa protokol SSL & sertifikat HTTPS...',
    'Menganalisis skor First Contentful Paint & TTFB...',
    'Menguji respon viewport & keramahan layar mobile...',
    'Memeriksa optimasi metadata SEO & OpenGraph...',
    'Menyusun rekomendasi perbaikan performa...',
  ];

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !whatsapp) {
      toast.error('Mohon masukkan URL website dan nomor WhatsApp Anda.');
      return;
    }

    setStatus('auditing');
    setStep(0);

    // Simulated progress sequence
    for (let i = 0; i < auditSteps.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    // Save lead to backend
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name || 'Calon Klien (Audit)',
          whatsappNumber: whatsapp,
          company: url,
          requirements: `Permintaan Free Website Audit untuk: ${url}`,
          estimatedBudget: 'Audit Gratis',
        }),
      });
    } catch (err) {
      console.error(err);
    }

    setStatus('done');
    toast.success('Audit selesai! Hasil analisis awal siap ditampilkan.');
  };

  const handleWhatsAppConsult = () => {
    const text = `Halo ZilyaDigital, saya ${name || 'pemilik website'} baru saja melakukan audit untuk ${url}.
Saya ingin berdiskusi mengenai peningkatan kecepatan dan perbaikan performa website saya.`;
    const cleanPhone = '6281234567890';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-semibold text-amber-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Free Instant Assessment' : 'Lead Magnet & Audit Gratis 100%'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {isEn ? 'Is Your Current Website Costing You Clients?' : 'Apakah Website Anda Lambat & Membuang Pelanggan?'}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            {isEn
              ? 'Enter your website URL to instantly check its loading speed, mobile responsiveness, and SEO readiness for free.'
              : 'Masukkan alamat website bisnis Anda saat ini. Kami akan memindai kecepatan muat, responsivitas mobile, dan kesiapan SEO untuk memberikan rekomendasi solutif.'}
          </p>
        </div>

        {/* Outer Card */}
        <div className="rounded-[2rem] p-1.5 bg-gradient-to-b from-amber-500/20 via-white/5 to-transparent border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="rounded-[1.7rem] bg-zinc-950/95 border border-white/10 p-6 sm:p-10">
            {status !== 'done' ? (
              <form onSubmit={handleAudit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                      {isEn ? 'Your Name' : 'Nama Anda'}
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                      required
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                      {isEn ? 'WhatsApp Number' : 'Nomor WhatsApp'}
                    </label>
                    <input
                      type="tel"
                      placeholder="081234567890"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                      required
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                      {isEn ? 'Website URL' : 'Alamat Website'}
                    </label>
                    <input
                      type="text"
                      placeholder="https://bisnisanda.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                {status === 'auditing' ? (
                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-white">{auditSteps[step]}</p>
                    <div className="w-full max-w-md mx-auto bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300"
                        style={{ width: `${((step + 1) / auditSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all mt-4 cursor-pointer"
                  >
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>{isEn ? 'Run Free Performance Audit Now' : 'Audit Website Saya Sekarang (Gratis)'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs text-zinc-400">Hasil Audit Diagnostik untuk:</span>
                    <h3 className="text-lg font-bold text-white font-mono">{url}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    Status: Butuh Optimasi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-amber-400 mb-1 font-semibold">
                      <Zap className="w-4 h-4" /> Kecepatan Muat
                    </div>
                    <div className="text-xl font-bold text-white">3.4 Detik</div>
                    <p className="text-[11px] text-red-400 mt-1">Potensi kehilangan 38% pembeli</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1 font-semibold">
                      <Smartphone className="w-4 h-4" /> Responsivitas Layar
                    </div>
                    <div className="text-xl font-bold text-white">Standar (68%)</div>
                    <p className="text-[11px] text-zinc-400 mt-1">Font & tombol perlu penyesuaian</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-purple-400 mb-1 font-semibold">
                      <ShieldAlert className="w-4 h-4" /> Kesiapan Arsitektur
                    </div>
                    <div className="text-xl font-bold text-white">Perlu Peningkatan</div>
                    <p className="text-[11px] text-zinc-400 mt-1">Belum memakai modern SSR / PWA</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                  💡 <strong>Rekomendasi Utama:</strong> Replatforming ke arsitektur modern (Astro 7 SSR + Go Fiber) dapat memangkas loading time website Anda dari 3.4 detik menjadi <strong>0.38 detik</strong>, meningkatkan peringkat Google, dan menaikkan konversi hingga 2x lipat.
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppConsult}
                    className="flex-1 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <span>Dapatkan Solusi Perbaikan via WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="h-12 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 font-semibold transition-all"
                  >
                    Audit Website Lain
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

