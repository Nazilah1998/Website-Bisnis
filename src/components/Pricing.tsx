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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
                <div className="text-center pb-8 pt-4 border-b border-border/50 mb-6 relative">
                  <h3 className="text-2xl font-bold mb-4">{p.name}</h3>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className={`text-3xl lg:text-3xl xl:text-4xl font-extrabold whitespace-nowrap tracking-tight ${p.isPopular ? 'text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-cyan-400 to-emerald-400 drop-shadow-sm' : ''}`}>
                      {p.price}
                    </span>
                    {p.type !== 'custom' && (
                      <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground bg-secondary/60 px-3 py-1 rounded-full ring-1 ring-border/50 shadow-inner">
                        {t('per_project')}
                      </span>
                    )}
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
