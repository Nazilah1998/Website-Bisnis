import { getLocale, getTranslations } from 'next-intl/server';
import { db } from '@/db';
import { services } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as LucideIcons from 'lucide-react';
import { SpotlightCard } from './ui/SpotlightCard';

export default async function Services() {
  const t = await getTranslations('Services');
  const locale = await getLocale();
  
  const allServices = await db.select().from(services).where(eq(services.isActive, true));

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allServices.map((s) => {
            const IconComponent = (LucideIcons as any)[s.iconName] || LucideIcons.CheckCircle;
            const title = locale === 'id' ? s.titleId : s.titleEn;
            const description = locale === 'id' ? s.descId : s.descEn;

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
          {allServices.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">Belum ada layanan.</div>
          )}
        </div>
      </div>
    </section>
  );
}
