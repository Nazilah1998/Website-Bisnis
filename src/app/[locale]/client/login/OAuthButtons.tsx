'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function OAuthButtons({ locale }: { locale: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleOAuthLogin = async (provider: 'google' | 'apple' | 'facebook' | 'github') => {
    try {
      setLoading(provider);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?locale=${locale}`,
        },
      });
      if (error) {
        toast.error(`Gagal login dengan ${provider}: ${error.message}`);
        setLoading(null);
      }
    } catch (err) {
      console.error('OAuth error:', err);
      toast.error('Terjadi kesalahan saat memproses login.');
      setLoading(null);
    }
  };

  const providers = [
    {
      id: 'google' as const,
      label: 'Google',
      bg: '#fff',
      text: '#1f1f1f',
      border: '#e5e7eb',
      hoverBg: '#f9fafb',
      icon: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
    },
    {
      id: 'apple' as const,
      label: 'Apple',
      bg: '#000',
      text: '#fff',
      border: '#3f3f46',
      hoverBg: '#18181b',
      icon: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="white">
          <path d="M16.365 1.44s1.04-1.22 2.62-1.39c0 0 .15 1.76-1.11 3.14-1.11 1.23-2.67 1.1-2.67 1.1-.14-1.39 1.16-2.85 1.16-2.85M16.925 5.56c1.19-.08 2.37.52 3.01 1.48 0 0-2.31 1.34-2.26 4.02.05 3.1 2.76 4.14 2.76 4.14s-2.07 5.9-4.87 5.9c-1.33 0-2.61-.95-4.1-.95-1.52 0-2.9.96-4.04.96-2.5 0-5.74-5.32-5.74-10.23 0-4.66 3.04-7.14 5.91-7.14 1.48 0 2.84.97 4.1.97 1.05 0 2.5-1.04 4.08-1.04h1.15z"/>
        </svg>
      ),
    },
    {
      id: 'facebook' as const,
      label: 'Facebook',
      bg: '#1877F2',
      text: '#fff',
      border: '#1565c0',
      hoverBg: '#1565c0',
      icon: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      id: 'github' as const,
      label: 'GitHub',
      bg: '#24292e',
      text: '#fff',
      border: '#3f3f46',
      hoverBg: '#1a1f24',
      icon: (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="white">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="mt-5">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-zinc-900 px-3 text-zinc-500">Atau masuk dengan</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => handleOAuthLogin(p.id)}
            disabled={!!loading}
            type="button"
            style={{
              backgroundColor: p.bg,
              color: p.text,
              borderColor: p.border,
            }}
            className="relative flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl text-sm font-medium transition-all border disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            {loading === p.id ? (
              <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              p.icon
            )}
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
