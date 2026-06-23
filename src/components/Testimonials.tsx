import { getLocale } from 'next-intl/server';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { SpotlightCard } from './ui/SpotlightCard';
import { Quote } from 'lucide-react';

export default async function Testimonials() {
  const locale = await getLocale();
  const allTestimonials = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));

  if (allTestimonials.length === 0) return null;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{locale === 'id' ? 'Apa Kata Klien Kami' : 'What Our Clients Say'}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{locale === 'id' ? 'Pengalaman nyata dari mereka yang telah mempercayakan proyek digitalnya kepada kami.' : 'Real experiences from those who have trusted us with their digital projects.'}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTestimonials.map((item) => {
            const content = locale === 'id' ? item.contentId : item.contentEn;
            
            return (
              <SpotlightCard key={item.id} className="p-6 md:p-8 h-full flex flex-col">
                <Quote className="w-10 h-10 text-blue-500/20 mb-4" />
                <p className="flex-1 text-foreground/90 italic leading-relaxed mb-8">&quot;{content}&quot;</p>
                <div className="flex items-center gap-4 mt-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.avatarUrl} alt={item.clientName} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10" />
                  <div>
                    <h4 className="font-bold">{item.clientName}</h4>
                    <p className="text-sm text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
