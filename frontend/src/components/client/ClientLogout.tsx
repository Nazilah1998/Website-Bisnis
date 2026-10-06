"use client";

import { useState } from "react";
import { toast } from "sonner";
import { post } from "@/lib/api";
import { clientLoginPath } from "@/lib/guards";
import type { Locale } from "@/i18n/ui";
import { LogOut, Loader2 } from "lucide-react";

interface Props {
  lang: Locale;
}

export default function ClientLogout({ lang }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await post("/api/auth/logout");
      window.location.href = clientLoginPath(lang);
    } catch {
      setLoading(false);
      toast.error("Gagal keluar, coba lagi.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
      Keluar
    </button>
  );
}