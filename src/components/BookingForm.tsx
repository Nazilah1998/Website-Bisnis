'use client';

import { useState } from 'react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export default function BookingForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      clientName: formData.get('clientName'),
      whatsappNumber: formData.get('whatsappNumber'),
      company: formData.get('company'),
      requirements: formData.get('requirements'),
      estimatedBudget: formData.get('estimatedBudget')
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const text = `Halo, saya ${data.clientName} dari ${data.company}.\n\nKebutuhan:\n${data.requirements}\n\nBudget Estimasi: ${data.estimatedBudget}`;
        const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`; 
        window.open(waUrl, '_blank');
      } else {
        alert('Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="booking" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Mulai Proyek Anda</h2>
            <p className="text-muted-foreground text-lg">Isi formulir di bawah ini dan kami akan segera menghubungi Anda melalui WhatsApp.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nama Lengkap</Label>
                <Input id="clientName" name="clientName" required placeholder="John Doe" className="bg-black/20 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
                <Input id="whatsappNumber" name="whatsappNumber" required placeholder="0812xxxx" className="bg-black/20 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Nama Perusahaan / Instansi</Label>
              <Input id="company" name="company" placeholder="PT Contoh Solusi" className="bg-black/20 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedBudget">Estimasi Budget</Label>
              <Input id="estimatedBudget" name="estimatedBudget" required placeholder="Rp 5.000.000" className="bg-black/20 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">Kebutuhan Spesifik</Label>
              <Textarea id="requirements" name="requirements" required rows={4} placeholder="Jelaskan fitur atau jenis website yang Anda inginkan..." className="bg-black/20 border-white/10" />
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl" disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim & Lanjut ke WhatsApp'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
