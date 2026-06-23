import { getTranslations } from 'next-intl/server';
import { db } from '@/db';
import { pricingPlans } from '@/db/schema';
import { SpotlightCard } from './ui/SpotlightCard';
import { Check } from 'lucide-react';
import { Badge } from './ui/badge';
import { Link } from '@/i18n/routing';
import { buttonVariants } from './ui/button';

export default async function Pricing() {
  const t = await getTranslations('Pricing');
  
  const allPricing = await db.select().from(pricingPlans);

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {allPricing.map((p) => {
            let features: string[] = [];
            try {
              features = JSON.parse(p.featuresJson);
            } catch {
              // ignore
            }

            return (
              <SpotlightCard key={p.id} className={`relative flex flex-col p-6 md:p-8 ${p.isPopular ? 'md:-translate-y-4 ring-1 ring-blue-500/50 shadow-2xl shadow-blue-500/20' : ''}`}>
                {p.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <Badge className="px-4 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 rounded-full">{t('popular')}</Badge>
                  </div>
                )}
                <div className="text-center pb-8 pt-4">
                  <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-extrabold">{p.price}</span>
                    <span className="text-muted-foreground mb-1">{p.type !== 'custom' ? t('per_project') : ''}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <ul className="space-y-4">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 z-10 relative">
                  <Link href="#booking" className={buttonVariants({ variant: p.isPopular ? 'default' : 'outline', className: `w-full text-md h-12 ${p.isPopular ? 'bg-white text-black hover:bg-gray-200' : ''}` })}>
                    {t('contact_us')}
                  </Link>
                </div>
              </SpotlightCard>
            );
          })}
          {allPricing.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">Belum ada paket harga.</div>
          )}
        </div>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">{t('custom_quote')}</p>
        </div>
      </div>
    </section>
  );
}
