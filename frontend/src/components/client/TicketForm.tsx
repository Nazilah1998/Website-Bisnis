"use client";

import { useState } from "react";
import { toast } from "sonner";
import { post, type MessageResult } from "@/lib/api";
import { LifeBuoy, Loader2 } from "lucide-react";

export default function TicketForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await post<MessageResult>("/api/client/tickets", {
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
      });
      toast.success(res.message ?? "Tiket bantuan berhasil dikirim");
      (e.target as HTMLFormElement).reset();
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim tiket");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="tsubject" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Subjek / Topik Bantuan</label>
        <input
          id="tsubject"
          name="subject"
          type="text"
          required
          placeholder="Cth: Perubahan desain halaman beranda"
          className="flex h-11 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="tmessage" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Pesan Detail</label>
        <textarea
          id="tmessage"
          name="message"
          rows={4}
          required
          placeholder="Jelaskan kendala atau permintaan Anda secara singkat..."
          className="flex w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LifeBuoy className="w-4 h-4" />}
        {loading ? "Mengirim..." : "Kirim Tiket"}
      </button>
    </form>
  );
}