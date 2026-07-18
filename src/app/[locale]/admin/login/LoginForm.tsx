"use client";

import { useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginForm({ action }: { action: (formData: FormData) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await action(formData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Email/Username atau password salah.");
      } else {
        setError("Email/Username atau password salah.");
      }
      setIsLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      action={action} 
      onSubmit={handleSubmit} 
      className="space-y-6 mt-8"
    >
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50"
        >
          <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium">
            {error}
          </p>
        </motion.div>
      )}
      
      <div className="space-y-3">
        <Label htmlFor="username" className="text-zinc-700 dark:text-zinc-300 font-medium">Email / Username</Label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <Input 
            id="username" 
            name="username" 
            type="text" 
            placeholder="admin@ZilyaDigital.com" 
            className="pl-10 h-12 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-blue-500 transition-all rounded-xl"
            required 
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300 font-medium">Password</Label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <Input 
            id="password" 
            name="password" 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••"
            className="pl-10 h-12 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-blue-500 transition-all rounded-xl pr-12"
            required 
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-10 w-10 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-transparent transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Sembunyikan password" : "Tampilkan password"}
            </span>
          </Button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all"
        disabled={isLoading}
      >
        {isLoading ? 'Memeriksa Kredensial...' : 'Masuk ke Dashboard'}
      </Button>
    </motion.form>
  );
}
