'use client';

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ClientLoginForm({ action }: { action: (formData: FormData) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    // Basic loading state for UX
    setIsLoading(true);
    // Since the action might redirect, we don't necessarily set loading to false.
    // The server action handles redirect.
  };

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
        <input
          id="email" name="email" type="email" required
          className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          placeholder="email@perusahaan.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
        <div className="relative">
          <input
            id="password" name="password" type={showPassword ? "text" : "password"} required
            className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full text-white py-2.5 rounded-xl font-semibold text-sm transition-all mt-1 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:opacity-90 disabled:opacity-70"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      >
        {isLoading ? 'Memproses...' : 'Masuk ke Portal'}
      </button>
    </form>
  );
}
