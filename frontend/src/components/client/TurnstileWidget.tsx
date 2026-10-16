"use client";

import { useEffect, useRef, useState } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  resetSignal?: number;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (error?: unknown) => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export default function TurnstileWidget({
  siteKey,
  onVerify,
  onExpire,
  resetSignal = 0,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Injeksi script Turnstile jika belum ada di document
    const SCRIPT_ID = "cf-turnstile-script";
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // 2. Tunggu ketersediaan window.turnstile
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval);
        setLoaded(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loaded || !containerRef.current || !window.turnstile || !siteKey) return;

    // Bersihkan widget lama bila ada
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore
      }
      widgetIdRef.current = null;
    }

    // Render Turnstile dengan ukuran flexible (100% lebar menyesuaikan tombol)
    try {
      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "dark",
        size: "flexible",
        callback: (token: string) => {
          onVerify(token);
        },
        "expired-callback": () => {
          onExpire?.();
        },
        "error-callback": () => {
          onExpire?.();
        },
      });
      widgetIdRef.current = id;
    } catch {
      // ignore render error
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [loaded, siteKey, resetSignal]);

  return (
    <div className="w-full my-2">
      <div
        ref={containerRef}
        className="w-full min-h-[65px] rounded-none overflow-hidden [&>div]:!w-full [&>div]:!max-w-full [&_iframe]:!w-full [&_iframe]:!max-w-full [&_iframe]:!rounded-none transition-all"
      />
    </div>
  );
}
