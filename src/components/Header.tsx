import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import { MagnetButton } from "./ui/MagnetButton";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";

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

        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher />
          <MagnetButton className="hidden md:inline-block">
            <Link
              href="#booking"
              className="bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
            >
              Hubungi Kami
            </Link>
          </MagnetButton>
          
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-md">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <SheetDescription className="sr-only">Menu navigasi utama untuk website NazilahWeb</SheetDescription>
              <div className="flex flex-col gap-6 mt-10">
                <Link
                  href="#services"
                  className="text-lg font-medium hover:text-white/80 transition-colors"
                >
                  {t("services")}
                </Link>
                <Link
                  href="#portfolio"
                  className="text-lg font-medium hover:text-white/80 transition-colors"
                >
                  {t("portfolio")}
                </Link>
                <Link
                  href="#pricing"
                  className="text-lg font-medium hover:text-white/80 transition-colors"
                >
                  {t("pricing")}
                </Link>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Link
                    href="#booking"
                    className="flex w-full justify-center bg-white text-black px-5 py-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                  >
                    Hubungi Kami
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
