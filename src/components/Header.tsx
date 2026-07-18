"use client";

import Image from 'next/image';
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, UserCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export default function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  if (pathname.includes("/admin") || pathname.includes("/client")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 text-foreground transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="ZilyaDigital Logo" width={32} height={32} className="rounded-md" />
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
            Zilya<span className="text-blue-500">Digital</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-8">
          <Link
            href="/about"
            className="text-sm font-medium hover:text-white/80 transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="/#services"
            className="text-sm font-medium hover:text-white/80 transition-colors"
          >
            {t("services")}
          </Link>
          <Link
            href="/#portfolio"
            className="text-sm font-medium hover:text-white/80 transition-colors"
          >
            {t("portfolio")}
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium hover:text-white/80 transition-colors"
          >
            {t("pricing")}
          </Link>
          <Link
            href="/#testimonials"
            className="text-sm font-medium hover:text-white/80 transition-colors"
          >
            {t("testimonials")}
          </Link>
          <Link
            href="/#faqs"
            className="text-sm font-medium hover:text-white/80 transition-colors"
          >
            {t("faqs")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative group hidden lg:block mr-2">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <UserCircle className="w-4 h-4" /> Login
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden pt-1">
              <Link href="/client/login" className="px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 flex items-center justify-between">
                Client Portal
              </Link>
              <Link href="/admin/login" className="px-4 py-3 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                Admin Dashboard
              </Link>
            </div>
          </div>
          <div className="hidden lg:block w-px h-6 bg-white/10" />
          
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-md">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <SheetDescription className="sr-only">Menu navigasi utama untuk website ZilyaDigital</SheetDescription>
              <div className="flex flex-col gap-6 mt-10">
                <Link
                  href="/about"
                  className="text-lg font-medium hover:text-white/80 transition-colors"
                >
                  Tentang Kami
                </Link>
                <Link
                  href="/#services"
                  className="text-lg font-medium hover:text-white/80 transition-colors"
                >
                  {t("services")}
                </Link>
                <Link
                  href="/#portfolio"
                  className="text-lg font-medium hover:text-white/80 transition-colors"
                >
                  {t("portfolio")}
                </Link>
                <Link
                  href="/#pricing"
                  className="text-lg font-medium hover:text-white/80 transition-colors"
                >
                  {t("pricing")}
                </Link>
                <Link
                  href="/#testimonials"
                  className="text-lg font-medium hover:text-white/80 transition-colors"
                >
                  {t("testimonials")}
                </Link>
                <Link
                  href="/#faqs"
                  className="text-lg font-medium hover:text-white/80 transition-colors"
                >
                  {t("faqs")}
                </Link>
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">Login Area</span>
                  <Link href="/client/login" className="flex items-center justify-between bg-zinc-800 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
                    <span className="flex items-center gap-2"><UserCircle className="w-4 h-4" /> Client Portal</span>
                  </Link>
                  <Link href="/admin/login" className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 text-zinc-400 px-5 py-3 rounded-lg text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors">
                    Admin Dashboard
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
