import type { Locale } from "@/i18n/ui";
import { SpotlightCard } from "../ui/SpotlightCard";
import { Quote } from "lucide-react";

interface TestimonialRecord {
  id: string;
  contentId?: string | null;
  contentEn?: string | null;
  avatarUrl?: string | null;
  clientName?: string | null;
  role?: string | null;
  [key: string]: unknown;
}

interface Props {
  lang: Locale;
  items: TestimonialRecord[];
  labels: { title: string; subtitle: string };
}

function Card({ item, lang, suffix }: { item: TestimonialRecord; lang: Locale; suffix?: string }) {
  const content = lang === "en" ? item.contentEn : item.contentId;
  return (
    <div key={`${item.id}${suffix ?? ""}`} className="w-[350px] md:w-[400px] shrink-0">
      <SpotlightCard className="p-6 md:p-8 h-full flex flex-col">
        <Quote className="w-10 h-10 text-blue-500/20 mb-4" />
        <p className="flex-1 text-foreground/90 italic leading-relaxed mb-8">&quot;{content}&quot;</p>
        <div className="flex items-center gap-4 mt-auto">
          {item.avatarUrl ? (
            <img src={item.avatarUrl} alt={item.clientName ?? ""} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10" />
          ) : null}
          <div>
            <h4 className="font-bold">{item.clientName}</h4>
            <p className="text-sm text-muted-foreground">{item.role}</p>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}

export default function TestimonialsCarousel({ lang, items, labels }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{labels.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{labels.subtitle}</p>
        </div>

        <div className="flex overflow-hidden w-full relative group [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex min-w-full shrink-0 animate-marquee gap-6 py-4">
            {items.map((item) => (
              <Card key={item.id} item={item} lang={lang} />
            ))}
          </div>
          <div className="flex min-w-full shrink-0 animate-marquee gap-6 py-4" aria-hidden="true">
            {items.map((item) => (
              <Card key={item.id} item={item} lang={lang} suffix="-dup" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}