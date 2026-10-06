import type { Locale } from "@/i18n/ui";
import { SpotlightCard } from "../ui/SpotlightCard";

interface PortfolioRecord {
  id: string;
  imageUrl?: string | null;
  titleId?: string | null;
  titleEn?: string | null;
  clientName?: string | null;
  category?: string | null;
  [key: string]: unknown;
}

interface Props {
  lang: Locale;
  items: PortfolioRecord[];
  labels: { title: string; subtitle: string };
}

export default function PortfolioGrid({ lang, items, labels }: Props) {
  return (
    <section id="portfolio" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{labels.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{labels.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => {
            const title = lang === "en" ? item.titleEn : item.titleId;

            return (
              <SpotlightCard key={item.id} className="group p-2 cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={title ?? ""} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" />
                  ) : null}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm p-4 text-center">
                    <h3 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{title}</h3>
                    <p className="text-white/80 text-sm mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.clientName} - {item.category}</p>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">Belum ada portofolio.</div>
          )}
        </div>
      </div>
    </section>
  );
}