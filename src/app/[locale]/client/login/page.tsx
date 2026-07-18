import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import OAuthButtons from './OAuthButtons';
import ClientLoginForm from './ClientLoginForm';

export default async function ClientLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  async function loginAction(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { db } = await import('@/db');
    const { clients } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');
    const bcrypt = await import('bcryptjs');

    const result = await db.select().from(clients).where(eq(clients.email, email)).limit(1);
    if (!result.length) {
      redirect(`/${locale}/client/login?error=invalid`);
    }
    const client = result[0];
    const valid = await bcrypt.compare(password, client.passwordHash);
    if (!valid) {
      redirect(`/${locale}/client/login?error=invalid`);
    }

    const cookieStore = await cookies();
    cookieStore.set('client_token', client.id, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
    redirect(`/${locale}/client/dashboard`);
  }

  return (
    <div className="min-h-screen w-full flex bg-zinc-950">
      {/* Left Side – Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600/25 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-blue-600/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '3s' }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/logo.jpg" alt="ZilyaDigital Logo" width={32} height={32} className="rounded-md" />
          <span className="text-xl font-bold text-white tracking-tight">
            Zilya<span className="text-indigo-400">Digital</span>
          </span>
        </div>

        {/* Middle content */}
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-4 py-1.5 text-xs font-medium text-indigo-300 mb-6">
            ✦ Client Portal
          </div>
          <h1 className="text-4xl font-bold text-white mb-5 leading-tight">
            Pantau Proyek Anda<br/>
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #818cf8, #a78bfa)' }}>
              Secara Real-Time
            </span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Akses progres proyek, laporan terbaru, dan semua update dari tim kami langsung dari satu tempat yang aman.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-3 mt-8">
            {['Live Progress Tracker', 'Laporan Real-Time', 'Komunikasi Langsung'].map((item) => (
              <span key={item} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                ✓ {item}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} ZilyaDigital. Hak cipta dilindungi.</p>
        </div>
      </div>

      {/* Right Side – Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 relative bg-zinc-950">
        {/* Back to home */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Ke Beranda
        </Link>

        <div className="w-full max-w-md">
          {/* Logo mobile only */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Image src="/logo.jpg" alt="ZilyaDigital Logo" width={32} height={32} className="rounded-md" />
            <span className="text-base font-bold text-white">ZilyaDigital <span className="text-indigo-400 font-normal">Client Portal</span></span>
          </div>

          {/* Header text */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Selamat Datang</h2>
            <p className="text-zinc-400 text-sm">Masuk untuk memantau proyek Anda bersama kami.</p>
          </div>

          {/* Card */}
          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-7 shadow-2xl">
            {/* Email/Password form */}
            <ClientLoginForm action={loginAction} />

            {/* Divider + OAuth */}
            <OAuthButtons locale={locale} />
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-600 mt-6">
            Belum punya akses?{' '}
            <Link href="/#booking" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Hubungi tim kami
            </Link>{' '}
            untuk mendapatkan akun klien Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
