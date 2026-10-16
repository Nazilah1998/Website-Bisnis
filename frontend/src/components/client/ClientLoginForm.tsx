"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { post, get, ApiError } from "@/lib/api";
import { clientDashboardPath } from "@/lib/guards";
import type { Locale } from "@/i18n/ui";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import TurnstileWidget from "./TurnstileWidget";

interface Props {
  lang: Locale;
  turnstileSiteKey?: string;
}

export default function ClientLoginForm({
  lang,
  turnstileSiteKey = "0x4AAAAAAFPmeHthhMli5uB_",
}: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [resetSignal, setResetSignal] = useState(0);

  // Check URL query error params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (!err) return;

    if (err === "not_configured") {
      toast.info(
        lang === "en"
          ? "Google Sign-In is being prepared on the server (GOOGLE_CLIENT_ID). Please use Email login for now."
          : "Login Google sedang dalam persiapan. Silakan gunakan Email untuk sementara."
      );
    } else if (err === "no_code") {
      toast.warning(
        lang === "en" ? "Google authentication was cancelled." : "Otorisasi akun Google dibatalkan."
      );
    } else if (err === "token_exchange_failed") {
      toast.error(
        lang === "en" ? "Failed to verify Google token." : "Gagal memverifikasi token dari Google."
      );
    } else if (err === "auth_failed") {
      toast.error(
        lang === "en" ? "Failed to authenticate client session." : "Gagal membuat sesi login klien."
      );
    } else {
      toast.error(
        lang === "en" ? `Authentication error: ${err}` : `Terjadi kendala autentikasi Google (${err})`
      );
    }
  }, [lang]);

  function switchMode(newMode: "login" | "register") {
    setMode(newMode);
    setShowPassword(false);
    setTurnstileToken("");
    setResetSignal((prev) => prev + 1);
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      const res = await get<{ configured: boolean; url: string; message?: string }>("/api/auth/google/url");
      if (res && res.configured && res.url) {
        window.location.href = res.url;
      } else {
        toast.info(
          lang === "en"
            ? "Google Sign-In is being configured. Please sign in with Email in the meantime."
            : "Layanan Google Sign-In sedang disiapkan. Silakan gunakan Email saat ini."
        );
      }
    } catch {
      toast.error(
        lang === "en"
          ? "Failed to initiate Google authentication"
          : "Gagal menghubungkan ke layanan Google OAuth"
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!turnstileToken) {
      toast.warning(
        lang === "en"
          ? "Please complete the Cloudflare Turnstile security verification."
          : "Silakan selesaikan verifikasi keamanan Cloudflare Turnstile terlebih dahulu."
      );
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await post("/api/auth/client/login", {
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
        turnstileToken,
      });
      toast.success(lang === "en" ? "Signed in successfully! Redirecting..." : "Berhasil masuk! Mengalihkan ke dashboard...");
      window.location.href = clientDashboardPath(lang);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : (lang === "en" ? "Invalid credentials" : "Email atau password tidak valid"));
      setTurnstileToken("");
      setResetSignal((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!turnstileToken) {
      toast.warning(
        lang === "en"
          ? "Please complete the Cloudflare Turnstile security verification."
          : "Silakan selesaikan verifikasi keamanan Cloudflare Turnstile terlebih dahulu."
      );
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await post("/api/auth/client/register", {
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        company: String(formData.get("company") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
        turnstileToken,
      });
      toast.success(
        lang === "en"
          ? "Account created successfully! Redirecting to dashboard..."
          : "Akun klien berhasil didaftarkan! Mengalihkan ke dashboard..."
      );
      window.location.href = clientDashboardPath(lang);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : (lang === "en" ? "Registration failed" : "Gagal mendaftarkan akun klien"));
      setTurnstileToken("");
      setResetSignal((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {mode === "login"
            ? (lang === "en" ? "Welcome Back" : "Selamat Datang Kembali")
            : (lang === "en" ? "Create Client Account" : "Daftar Akun Klien")}
        </h2>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          {mode === "login"
            ? (lang === "en"
                ? "Enter your credentials to access your projects and invoices."
                : "Masuk dengan email dan password Anda untuk mengelola proyek dan tagihan.")
            : (lang === "en"
                ? "Fill in your details below to create your client account."
                : "Lengkapi data berikut untuk membuat akun dan mulai berkolaborasi bersama kami.")}
        </p>
      </div>

      {mode === "login" ? (
        /* Login Mode: Email & Password on TOP */
        <div className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="cemail" className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                {lang === "en" ? "Email Address" : "Alamat Email"}
              </label>
              <input
                id="cemail"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="nama@perusahaan.com"
                className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="cpassword" className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="cpassword"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2 pr-12 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Cloudflare Turnstile Widget (Same width as button) */}
            <div className="pt-1">
              <TurnstileWidget
                siteKey={turnstileSiteKey}
                onVerify={(tok) => setTurnstileToken(tok)}
                onExpire={() => setTurnstileToken("")}
                resetSignal={resetSignal}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-600/30 active:scale-[0.99] cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading
                ? (lang === "en" ? "Signing In..." : "Memproses...")
                : (lang === "en" ? "Sign In to Client Portal" : "Masuk ke Portal Klien")}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-zinc-950 px-3 text-zinc-500 font-medium">
                {lang === "en" ? "Or continue with" : "Atau masuk dengan"}
              </span>
            </div>
          </div>

          {/* Google Button at the Bottom */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-12 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-zinc-200 active:scale-[0.99] disabled:opacity-70 group cursor-pointer"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-700" />
            ) : (
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span className="font-semibold text-zinc-900">
              {googleLoading
                ? (lang === "en" ? "Connecting to Google..." : "Menghubungkan...")
                : (lang === "en" ? "Sign in with Google" : "Masuk dengan Google")}
            </span>
          </button>

          {/* Toggle to Register */}
          <div className="text-center pt-2">
            <p className="text-xs text-zinc-400">
              {lang === "en" ? "Don't have a client account yet?" : "Belum memiliki akun klien?"}{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline cursor-pointer"
              >
                {lang === "en" ? "Register now" : "Daftar sekarang"}
              </button>
            </p>
          </div>
        </div>
      ) : (
        /* Register Mode: Form on TOP, NO Google Button */
        <div className="space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="rname" className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                {lang === "en" ? "Full Name *" : "Nama Lengkap *"}
              </label>
              <input
                id="rname"
                name="name"
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="remail" className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                {lang === "en" ? "Business / Personal Email *" : "Email Bisnis / Pribadi *"}
              </label>
              <input
                id="remail"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="nama@perusahaan.com"
                className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="rcompany" className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                  {lang === "en" ? "Company / Brand" : "Perusahaan / Brand"}
                </label>
                <input
                  id="rcompany"
                  name="company"
                  type="text"
                  placeholder="PT Maju Sukses"
                  className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="rphone" className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                  {lang === "en" ? "WhatsApp Number" : "Nomor WhatsApp"}
                </label>
                <input
                  id="rphone"
                  name="phone"
                  type="text"
                  placeholder="0812xxxxxxxx"
                  className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="rpassword" className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                {lang === "en" ? "Password * (Min. 6 chars)" : "Password * (Min. 6 karakter)"}
              </label>
              <div className="relative">
                <input
                  id="rpassword"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="flex h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2 pr-12 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Cloudflare Turnstile Widget (Same width as button) */}
            <div className="pt-1">
              <TurnstileWidget
                siteKey={turnstileSiteKey}
                onVerify={(tok) => setTurnstileToken(tok)}
                onExpire={() => setTurnstileToken("")}
                resetSignal={resetSignal}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-600/30 active:scale-[0.99] cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading
                ? (lang === "en" ? "Creating Account..." : "Membuat Akun...")
                : (lang === "en" ? "Create Client Account" : "Daftar Akun Klien")}
            </button>
          </form>

          {/* Toggle back to Login */}
          <div className="text-center pt-2">
            <p className="text-xs text-zinc-400">
              {lang === "en" ? "Already have an account?" : "Sudah memiliki akun klien?"}{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline cursor-pointer"
              >
                {lang === "en" ? "Sign in here" : "Masuk di sini"}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}