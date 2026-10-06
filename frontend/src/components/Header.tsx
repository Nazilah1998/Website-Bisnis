import { useState } from "react";
import type { Locale } from "@/i18n/ui";
import { localeHref } from "@/i18n/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, UserCircle } from "lucide-react";
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

function Href({ href, locale, children, className, onClick }: { href: string; locale: Locale; children: React.ReactNode; className?: string; onClick?: () => void }) {
  const full = href.startsWith("#") ? `/${localeHref(locale, "/")}${href}` : localeHref(locale, href);
  return (
    <a href={full} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export default function Header({ locale, labels }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass =
    "relative text-sm font-medium text-zinc-300 hover:text-white transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:-bottom-1.5 after:left-0 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:origin-left after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100";

  const navItems = [
    { href: "/", label: labels.home },
    { href: "/#services", label: labels.services },
    { href: "/#portfolio", label: labels.portfolio },
    { href: "/#pricing", label: labels.pricing },
    { href: "/#testimonials", label: labels.testimonials },
    { href: "/#faqs", label: labels.faqs },
    { href: "/about", label: labels.about },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 text-foreground transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Href href="/" locale={locale} className="flex items-center gap-2">
          <img src="/logo.jpg" alt="ZilyaDigital Logo" width={32} height={32} className="rounded-md" />
          <span className="font-bold text-xl tracking-tight">
            Zilya<span className="text-blue-500">Digital</span>
          </span>
        </Href>

        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Href key={item.href} href={item.href} locale={locale} className={navLinkClass}>
              {item.label}
            </Href>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative group hidden lg:block mr-2">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <UserCircle className="w-4 h-4" /> Login
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden pt-1">
              <Href href="/client/login" locale={locale} className="px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 flex items-center justify-between">
                Client Portal
              </Href>
              <Href href="/admin/login" locale={locale} className="px-4 py-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                Admin Dashboard
              </Href>
            </div>
          </div>
          <div className="hidden lg:block w-px h-6 bg-white/10" />

          <LanguageSwitcher locale={locale} path={localeHref(locale === "id" ? "en" : "id", "/")} />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-md">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <SheetDescription className="sr-only">Menu navigasi utama untuk website ZilyaDigital</SheetDescription>
              <div className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Href
                    key={item.href}
                    href={item.href}
                    locale={locale}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-zinc-200 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Href>
                ))}
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 mb-1">Login Area</span>
                  <Href href="/client/login" locale={locale} onClick={() => setIsOpen(false)} className="flex items-center justify-between bg-zinc-800 text-white px-5 py-3.5 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors">
                    <span className="flex items-center gap-2"><UserCircle className="w-5 h-5" /> Client Portal</span>
                  </Href>
                  <Href href="/admin/login" locale={locale} onClick={() => setIsOpen(false)} className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 text-zinc-400 px-5 py-3.5 rounded-xl text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors">
                    Admin Dashboard
                  </Href>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export type { NavLabels };