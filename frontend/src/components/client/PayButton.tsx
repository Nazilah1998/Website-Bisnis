"use client";

import { useState } from "react";
import { toast } from "sonner";
import { post } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { CreditCard, Loader2, ExternalLink } from "lucide-react";

interface Props {
  invoiceId: string;
}

export default function PayButton({ invoiceId }: Props) {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    try {
      // /api/doku/checkout → backend DOKU, respons {payment_url}.
      const res = await post<{ payment_url?: string }>("/api/doku/checkout", { invoiceId });
      if (res.payment_url) {
        setPaymentUrl(res.payment_url);
      } else {
        toast.error("URL pembayaran tidak ditemukan. Coba lagi nanti.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat transaksi DOKU");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 transition-colors disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
        {loading ? "Memproses..." : "Bayar Sekarang"}
      </button>

      <Dialog open={!!paymentUrl} onOpenChange={(open) => { if (!open) setPaymentUrl(null); }}>
        <DialogContent className="sm:max-w-4xl">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            Pembayaran DOKU
          </DialogTitle>
          {paymentUrl && (
            <div className="relative">
              <a
                href={paymentUrl}
                target="_blank"
                rel="noreferrer"
                className="mb-3 inline-flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-600 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Buka pembayaran di tab baru
              </a>
              <iframe
                src={paymentUrl}
                allow="payment"
                title="DOKU Payment Checkout"
                className="w-full h-[90vh] rounded-lg border border-zinc-200 dark:border-zinc-800"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}