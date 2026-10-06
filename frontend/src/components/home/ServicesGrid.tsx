import type { Locale } from "@/i18n/ui";
import * as LucideIcons from "lucide-react";
import { SpotlightCard } from "../ui/SpotlightCard";

interface ServiceRecord {
  id: string;
  iconName?: string | null;
  titleId?: string | null;
  titleEn?: string | null;
  descId?: string | null;
  descEn?: string | null;
  [key: string]: unknown;
}

interface Props {
  lang: Locale;
  services: ServiceRecord[];
  labels: { title: string; subtitle: string };
}

export default function ServicesGrid({ lang, services, labels }: Props) {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{labels.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{labels.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s) => {
            const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[s.iconName ?? ""] ?? LucideIcons.CheckCircle;
            const title = lang === "en" ? s.titleEn : s.titleId;
            const description = lang === "en" ? s.descEn : s.descId;

            return (
              <SpotlightCard key={s.id} className="p-6 md:p-8 h-full text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white/5 rounded-full mb-6 ring-1 ring-white/10 shadow-inner">
                    <IconComponent className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </SpotlightCard>
            );
          })}
          {services.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">Belum ada layanan.</div>
          )}
        </div>
      </div>
    </section>
  );
}