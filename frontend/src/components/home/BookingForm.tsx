'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Sparkles, X, MessageSquare, Loader2 } from 'lucide-react';

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [budget, setBudget] = useState('Rp 5.000.000');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    function checkParams() {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const plan = params.get('plan');
      const price = params.get('price');

      if (plan) {
        setSelectedPlan({ name: plan, price: price ?? '' });
        if (price) {
          setBudget(price);
        }
        setRequirements((prev) =>
          prev ? prev : `Saya tertarik dengan paket ${plan}. Mohon informasi konsultasi lebih lanjut.`
        );
      }
    }

    checkParams();
    window.addEventListener('popstate', checkParams);
    return () => window.removeEventListener('popstate', checkParams);
  }, []);

  function clearSelectedPlan() {
    setSelectedPlan(null);
    setBudget('Rp 5.000.000');
    setRequirements('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      clientName: formData.get('clientName')?.toString() || '',
      whatsappNumber: formData.get('whatsappNumber')?.toString() || '',
      company: formData.get('company')?.toString() || '',
      requirements: requirements || formData.get('requirements')?.toString() || '',
      estimatedBudget: budget || formData.get('estimatedBudget')?.toString() || '',
      plan: selectedPlan?.name || '',
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Formulir berhasil dikirim! Mengalihkan ke WhatsApp...');
        const planText = data.plan ? `\nPaket Pilihan: ${data.plan}` : '';
        const companyText = data.company ? ` dari ${data.company}` : '';
        const text = `Halo ZilyaDigital, saya ${data.clientName}${companyText}.${planText}\n\nKebutuhan:\n${data.requirements}\n\nEstimasi Budget: ${data.estimatedBudget}`;
        
        const cleanPhone = '6281234567890';
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
        setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 800);
      } else {
        toast.error('Gagal memproses data. Silakan coba kembali atau hubungi WhatsApp langsung.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi gangguan jaringan saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="booking" className="py-24 bg-background scroll-mt-20 relative">
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-blue-500/5 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Konsultasi Gratis
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Mulai Proyek Digital Anda</h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Diskusikan ide Anda bersama tim kami. Kami siap memberikan solusi web & aplikasi terbaik.
            </p>
          </div>

          {selectedPlan && (
            <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-medium">Paket Terpilih</Badge>
                <span className="font-semibold text-white">{selectedPlan.name}</span>
                {selectedPlan.price && (
                  <span className="text-sm text-blue-300">({selectedPlan.price})</span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSelectedPlan}
                className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
                title="Hapus pilihan paket"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-zinc-200">Nama Lengkap *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="bg-black/30 border-white/10 focus:border-blue-500 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber" className="text-zinc-200">Nomor WhatsApp *</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  required
                  placeholder="0812xxxxxxxx"
                  className="bg-black/30 border-white/10 focus:border-blue-500 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-zinc-200">Nama Bisnis / Instansi (Opsional)</Label>
              <Input
                id="company"
                name="company"
                placeholder="PT Contoh Sukses Digital"
                className="bg-black/30 border-white/10 focus:border-blue-500 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedBudget" className="text-zinc-200">Estimasi Budget *</Label>
              <Input
                id="estimatedBudget"
                name="estimatedBudget"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Rp 5.000.000"
                className="bg-black/30 border-white/10 focus:border-blue-500 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-zinc-200">Deskripsi Kebutuhan *</Label>
              <Textarea
                id="requirements"
                name="requirements"
                required
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Jelaskan kebutuhan website/aplikasi Anda, referensi desain, atau fitur utama yang diinginkan..."
                className="bg-black/30 border-white/10 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengirimkan...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    <span>Kirim & Hubungkan ke WhatsApp</span>
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-zinc-500 mt-3">
                Kami menjaga kerahasiaan data Anda sepenuhnya.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
