import { getLocale, getTranslations } from 'next-intl/server';
import { db } from '@/db';
import { portfolios } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { SpotlightCard } from './ui/SpotlightCard';
import Image from 'next/image';

export default async function Portfolio() {
  const t = await getTranslations('Portfolio');
  const locale = await getLocale();

  const allPortfolios = await db.select().from(portfolios).orderBy(desc(portfolios.createdAt));

  return (
    <section id="portfolio" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allPortfolios.map((item) => {
            const title = locale === 'id' ? item.titleId : item.titleEn;

            return (
              <SpotlightCard key={item.id} className="group p-2 cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                  <Image src={item.imageUrl} alt={title} fill className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" unoptimized />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm p-4 text-center">
                    <h3 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{title}</h3>
                    <p className="text-white/80 text-sm mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.clientName} - {item.category}</p>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
          {allPortfolios.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">Belum ada portofolio.</div>
          )}
        </div>
      </div>
    </section>
  );
}
