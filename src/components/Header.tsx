import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import { MagnetButton } from "./ui/MagnetButton";

export default function Header() {
  const t = useTranslations("Navigation");

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 text-foreground transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Nazilah<span className="text-blue-500">Web</span>
        </Link>

        <nav className="hidden md:flex gap-8">
          <Link
            href="#services"
            className="text-sm font-medium hover:text-white/80 transition-colors"
          >
            {t("services")}
          </Link>
          <Link
            href="#portfolio"
            className="text-sm font-medium hover:text-white/80 transition-colors"
          >
            {t("portfolio")}
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-white/80 transition-colors"
          >
            {t("pricing")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <MagnetButton className="hidden md:inline-block">
            <Link
              href="#booking"
              className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
            >
              Hubungi Kami
            </Link>
          </MagnetButton>
        </div>
      </div>
    </header>
  );
}
