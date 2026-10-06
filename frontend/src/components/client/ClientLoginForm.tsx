"use client";

import { useState } from "react";
import { toast } from "sonner";
import { post, ApiError } from "@/lib/api";
import { clientDashboardPath } from "@/lib/guards";
import type { Locale } from "@/i18n/ui";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface Props {
  lang: Locale;
}

export default function ClientLoginForm({ lang }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      // /api/auth/client/login → set-cookie client_token (via proxy Go).
      await post("/api/auth/client/login", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      toast.success("Login berhasil");
      window.location.href = clientDashboardPath(lang);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal masuk ke portal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="cemail" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Email</label>
        <input
          id="cemail"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="nama@perusahaan.com"
          className="flex h-11 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="cpassword" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Password</label>
        <div className="relative">
          <input
            id="cpassword"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="flex h-11 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 pr-12 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? "Memproses..." : "Masuk ke Portal"}
      </button>
    </form>
  );
}