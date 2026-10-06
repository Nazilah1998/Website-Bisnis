import type { Locale } from "@/i18n/ui";
import { localeHref } from "@/i18n/utils";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";

interface Props {
  locale: Locale;
  /** Path halaman saat ini tanpa prefix lokale (diambil server-side). */
  path: string;
}

export default function LanguageSwitcher({ locale, path }: Props) {
  const nextLocale: Locale = locale === "id" ? "en" : "id";
  return (
    <a href={localeHref(nextLocale, path)} title={nextLocale === "en" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}>
      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="uppercase text-xs font-semibold">{locale}</span>
      </Button>
    </a>
  );
}