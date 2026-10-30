'use client';

import { useState } from 'react';
import { ArrowUpRight, Calculator, Video } from 'lucide-react';
import MeetingSchedulerModal from './MeetingSchedulerModal';

interface Props {
  bookingHref: string;
  calculatorHref: string;
  lang?: 'id' | 'en';
}

export default function HeroActionButtons({ bookingHref, calculatorHref, lang = 'id' }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const isEn = lang === 'en';

  return (
    <>
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
        {/* Primary CTA: Button-in-Button */}
        <a
          href={bookingHref}
          className="w-full sm:w-auto inline-flex items-center justify-between gap-3 px-6 h-13 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-sm sm:text-base transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.2)] group"
        >
          <span>{isEn ? 'Start Project Consultation' : 'Konsultasi Proyek Sekarang'}</span>
          <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </a>

        {/* Secondary CTA: Calculator */}
        <a
          href={calculatorHref}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-13 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-sm sm:text-base border border-white/15 hover:border-white/30 backdrop-blur-md transition-all duration-300"
        >
          <Calculator className="w-4 h-4 text-blue-400" />
          <span>{isEn ? 'Cost Estimator' : 'Hitung Estimasi Biaya'}</span>
        </a>

        {/* Tertiary CTA: 1-on-1 Discovery Call */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 h-11 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs sm:text-sm font-semibold border border-blue-500/30 transition-all cursor-pointer"
        >
          <Video className="w-4 h-4 text-blue-400" />
          <span>{isEn ? 'Schedule 15-Min Meeting' : 'Jadwalkan Diskusi 1-on-1 (15 Menit)'}</span>
        </button>
      </div>

      <MeetingSchedulerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lang={lang}
      />
    </>
  );
}

