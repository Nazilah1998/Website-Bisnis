'use client';

import { useState } from 'react';
import { Video, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'id' | 'en';
}

const TOPICS = [
  'Pembuatan Website Baru / Rebranding',
  'Pembangunan Custom Web App / SaaS',
  'Integrasi AI Chatbot & Automasi',
  'Audit & Optimasi Kecepatan Web',
  'Solusi E-Commerce & Payment Gateway',
];

const TIME_SLOTS = [
  { label: 'Pagi (10:00 - 11:30 WIB)', val: '10:00 WIB' },
  { label: 'Siang (13:30 - 15:00 WIB)', val: '14:00 WIB' },
  { label: 'Sore (16:00 - 17:30 WIB)', val: '16:30 WIB' },
  { label: 'Malam (19:30 - 21:00 WIB)', val: '20:00 WIB' },
];

export default function MeetingSchedulerModal({ isOpen, onClose, lang = 'id' }: Props) {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [platform, setPlatform] = useState<'Google Meet' | 'WhatsApp Call'>('Google Meet');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[1].val);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [company, setCompany] = useState('');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp || !date) {
      toast.error('Mohon lengkapi nama, nomor WhatsApp, dan pilihan tanggal konsultasi.');
      return;
    }

    setSubmitting(true);
    const requirements = `Jadwal Diskusi 1-on-1: ${topic} via ${platform} pada ${date} jam ${timeSlot}`;

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name,
          whatsappNumber: whatsapp,
          company: company || '-',
          requirements,
          estimatedBudget: 'Konsultasi 1-on-1',
        }),
      });

      toast.success('Jadwal konsultasi berhasil dicatat!');

      const text = `Halo ZilyaDigital, saya ${name}${company ? ` dari ${company}` : ''} ingin konfirmasi jadwal diskusi 1-on-1 virtual:
📅 Tanggal: ${date}
⏰ Jam: ${timeSlot}
🖥️ Media: ${platform}
💬 Topik: ${topic}

Mohon konfirmasi link pertemuan. Terima kasih!`;

      const cleanPhone = '6281234567890';
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
      onClose();
    } catch (err) {
      toast.error('Gagal menyimpan jadwal. Silakan hubungi langsung via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-[2rem] p-1.5 bg-gradient-to-b from-blue-500/40 via-purple-500/20 to-white/10 border border-white/20 shadow-2xl">
        <div className="rounded-[1.7rem] bg-zinc-950 p-6 sm:p-8 border border-white/10 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Video className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-lg text-white">Jadwalkan Konsultasi 1-on-1</h3>
                <p className="text-xs text-zinc-400">Sesi diskusi virtual 15 menit via Google Meet</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Topik Diskusi Utama</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t} className="bg-zinc-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Platform Diskusi</label>
                <div className="flex gap-2">
                  {(['Google Meet', 'WhatsApp Call'] as const).map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setPlatform(plat)}
                      className={`flex-1 py-2 px-2 text-xs font-medium rounded-xl border transition-all ${
                        platform === plat
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Pilihan Tanggal</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Pilihan Waktu (Slot)</label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.val}
                    type="button"
                    onClick={() => setTimeSlot(slot.val)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border text-left transition-all ${
                      timeSlot === slot.val
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Nomor WhatsApp</label>
                <input
                  type="tel"
                  placeholder="081234567890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Nama Perusahaan / Bisnis (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: PT Digital Indonesia"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all mt-4 cursor-pointer"
            >
              <span>{submitting ? 'Menjadwalkan...' : 'Konfirmasi Jadwal & Terhubung ke WhatsApp'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

