import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 group">
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
      <div className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center">
        <MessageCircle className="w-8 h-8" />
      </div>
    </a>
  );
}
