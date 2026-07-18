'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export default function PayButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doku/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat transaksi DOKU');
      }

      if (data.payment_url) {
        setPaymentUrl(data.payment_url);
        setIsModalOpen(true);
      } else {
        toast.error('URL pembayaran tidak ditemukan. Coba lagi nanti.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Terjadi kesalahan sistem');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handlePay} 
        disabled={loading}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all group"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
        )}
        {loading ? 'Memproses...' : 'Bayar Sekarang'}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl md:max-w-4xl w-full h-[90vh] p-0 overflow-hidden flex flex-col bg-white">
          <DialogTitle className="sr-only">Pembayaran Tagihan</DialogTitle>
          <div className="flex justify-end p-2 bg-slate-50 border-b">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Tutup</span>
            </Button>
          </div>
          {paymentUrl && (
            <iframe 
              src={paymentUrl} 
              className="w-full flex-1 border-0"
              allow="payment"
              title="DOKU Payment Checkout"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
