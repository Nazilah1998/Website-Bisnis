import { useState } from "react";
import type { Locale } from "@/i18n/ui";
import { localeHref } from "@/i18n/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, UserCircle, Calculator, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";

interface NavLabels {
  home: string;
  services: string;
  portfolio: string;
  pricing: string;
  testimonials: string;
  faqs: string;
  about: string;
}

interface Props {
  locale: Locale;
  labels: NavLabels;
}

function Href({
  href,
  locale,
  children,
  className,
  onClick,
}: {
  href: string;
  locale: Locale;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const full = href.startsWith("#") ? `/${localeHref(locale, "/")}${href}` : localeHref(locale, href);
  return (
    <a href={full} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export default function Header({ locale, labels }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: labels.home },
    { href: "/#services", label: labels.services },
    { href: "/#portfolio", label: labels.portfolio },
    { href: "/#calculator", label: locale === "en" ? "Cost Estimator" : "Estimasi Biaya", isSpecial: true },
    { href: "/#pricing", label: labels.pricing },
    { href: "/#testimonials", label: labels.testimonials },
    { href: "/about", label: labels.about },
  ];

  return (
    <div className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <header className="pointer-events-auto w-full max-w-5xl rounded-full bg-zinc-950/80 backdrop-blur-2xl border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.65)] px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300">
        <Href href="/" locale={locale} className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20 group-hover:ring-blue-500/50 transition-all">
            <img src="/logo.jpg" alt="ZilyaDigital Logo" width={32} height={32} className="object-cover" />
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center">
            Zilya<span className="text-blue-500">Digital</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 ml-1.5 animate-pulse" />
          </span>
        </Href>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Href
              key={item.href}
              href={item.href}
              locale={locale}
              className={`text-xs uppercase tracking-wider font-semibold transition-all relative py-1 ${
                item.isSpecial
                  ? "text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              {item.isSpecial && <Sparkles className="w-3 h-3 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />}
              {item.label}
            </Href>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Href
            href="/client/login"
            locale={locale}
            className="hidden sm:inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white pl-3.5 pr-2.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-white/10 hover:border-white/20 transition-all shadow-inner group"
          >
            <span>{locale === "en" ? "Client Portal" : "Portal Klien"}</span>
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <UserCircle className="w-3.5 h-3.5" />
            </span>
          </Href>

          <LanguageSwitcher locale={locale} path="/" />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden rounded-full text-zinc-300 hover:text-white hover:bg-white/10 size-8" />}>
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-zinc-950/95 backdrop-blur-2xl border-white/10">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <SheetDescription className="sr-only">Menu navigasi utama untuk website ZilyaDigital</SheetDescription>
              <div className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Href
                    key={item.href}
                    href={item.href}
                    locale={locale}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-zinc-200 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.isSpecial && <Calculator className="w-4 h-4 text-blue-400" />}
                  </Href>
                ))}
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-4">
                    {locale === "en" ? "Account Area" : "Area Akun"}
                  </span>
                  <Href
                    href="/client/login"
                    locale={locale}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/25"
                  >
                    <span className="flex items-center gap-2">
                      <UserCircle className="w-4 h-4" />
                      {locale === "en" ? "Sign In / Register" : "Masuk & Daftar"}
                    </span>
                    <span>&rarr;</span>
                  </Href>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}

export type { NavLabels };
