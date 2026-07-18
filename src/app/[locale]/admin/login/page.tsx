import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import LoginForm from './LoginForm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  
  // Basic session check - in a real production app, use JWT / proper sessions
  if (token?.value === (process.env.ADMIN_SECRET || 'secret123')) {
    redirect('/id/admin/dashboard');
  }

  async function loginAction(formData: FormData) {
    'use server';
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    if (!username || !password) {
      throw new Error('Username dan password wajib diisi');
    }

    // Ambil data user dari database Supabase
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) {
      throw new Error('Kredensial tidak valid'); // Jangan beri tahu 'username tidak ditemukan' untuk keamanan
    }

    // Verifikasi password hash
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('Kredensial tidak valid');
    }

    // Login Sukses
    const cookiesStore = await cookies();
    cookiesStore.set('admin_token', process.env.ADMIN_SECRET || 'secret123', { 
      httpOnly: true, 
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 minggu
    });
    
    redirect('/id/admin/dashboard');
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract shapes / gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 flex items-center gap-2">
          <Image src="/logo.jpg" alt="ZilyaDigital Logo" width={32} height={32} className="rounded-md" />
          <span className="text-2xl font-bold text-white tracking-tight">ZilyaDigital Admin</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Platform Manajemen Agensi Digital
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Kelola portofolio, layanan, prospek klien, dan seluruh aset digital dari satu dashboard terpusat yang aman.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} ZilyaDigital. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white dark:bg-zinc-950 relative">
        <Link 
          href="/" 
          className="absolute top-8 right-8 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Ke Beranda
        </Link>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Selamat Datang Kembali</h2>
            <p className="text-sm text-zinc-500 mt-2">
              Silakan masukkan kredensial Anda untuk masuk ke sistem admin.
            </p>
          </div>
          
          <LoginForm action={loginAction} />
        </div>
      </div>
    </div>
  );
}
