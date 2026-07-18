import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { Building2, Code2, Rocket, Users, Target, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  return {
    title: `${t('metaTitle')} | ZilyaDigital`,
    description: t('metaDesc'),
  };
}

const TEAM = [
  {
    name: 'Sarah Nazilah',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop',
    bio: 'Berpengalaman 10+ tahun di industri teknologi dengan visi membangun ekosistem digital untuk UMKM.',
  },
  {
    name: 'Budi Santoso',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    bio: 'Ahli dalam arsitektur scalable dan pengembangan full-stack menggunakan ekosistem React.',
  },
  {
    name: 'Amelia Kartika',
    role: 'Lead UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
    bio: 'Fokus pada pengalaman pengguna yang intuitif dengan sentuhan estetika modern minimalis.',
  }
];

const VALUES = [
  { icon: Target, title: 'Inovasi Berkelanjutan', desc: 'Kami selalu mengadopsi teknologi terbaru untuk memberikan solusi terbaik.' },
  { icon: Users, title: 'Kolaborasi Kuat', desc: 'Bekerja sama erat dengan klien untuk memahami visi dan misi mereka.' },
  { icon: CheckCircle2, title: 'Kualitas & Detail', desc: 'Setiap baris kode dan setiap piksel desain kami buat dengan presisi.' }
];

export default async function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0B]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 mb-6 text-sm mx-auto">
            Tentang ZilyaDigital
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Membangun Masa Depan <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Digital yang Inovatif
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Kami adalah agensi digital independen yang berdedikasi membantu bisnis bertransformasi, berkembang, dan mendominasi ranah digital melalui solusi teknologi canggih.
          </p>
        </div>
      </section>

      {/* Story & Stats */}
      <section className="py-20 bg-zinc-900/50 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Cerita Kami</h2>
              <div className="w-12 h-1 bg-blue-500 rounded-full" />
              <p className="text-zinc-400 leading-relaxed">
                Berawal dari tim kecil pada tahun 2018, ZilyaDigital lahir dari sebuah misi sederhana: membuat teknologi web berkualitas enterprise dapat diakses oleh semua skala bisnis. 
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Kini, kami telah berevolusi menjadi sebuah agensi dengan layanan komprehensif, mulai dari UI/UX Design, Web Development, hingga optimasi SEO tingkat lanjut.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center">
                <Building2 className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="text-3xl font-bold text-white mb-1">6+</h4>
                <p className="text-sm text-zinc-500">Tahun Pengalaman</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center">
                <Code2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-3xl font-bold text-white mb-1">100+</h4>
                <p className="text-sm text-zinc-500">Proyek Selesai</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center col-span-2">
                <Rocket className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="text-3xl font-bold text-white mb-1">98%</h4>
                <p className="text-sm text-zinc-500">Kepuasan Klien kami di seluruh dunia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Nilai-Nilai Kami</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Prinsip yang membimbing setiap baris kode yang kami tulis dan setiap desain yang kami buat.</p>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((val, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-3xl hover:bg-zinc-800/50 transition-colors">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                  <val.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-zinc-900/30 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Bertemu dengan Tim Inti</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Orang-orang berbakat di balik kesuksesan setiap proyek digital Anda.</p>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-colors group">
                <div className="aspect-square w-full relative overflow-hidden bg-zinc-800">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-blue-400 text-sm font-medium mb-4">{member.role}</p>
                  <p className="text-sm text-zinc-400">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Siap Memulai Proyek Anda?</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Mari diskusikan ide Anda dan ubah menjadi kenyataan digital yang luar biasa bersama kami.
          </p>
          <Link href="/#booking" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            Konsultasi Gratis Sekarang
          </Link>
        </div>
      </section>

    </main>
  );
}

// Inline Badge component specifically for this page since we didn't import it
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
