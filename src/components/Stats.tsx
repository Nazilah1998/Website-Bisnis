import { getLocale } from 'next-intl/server';
import { db } from '@/db';
import { stats } from '@/db/schema';
import { asc } from 'drizzle-orm';

export default async function Stats() {
  const locale = await getLocale();
  const allStats = await db.select().from(stats).orderBy(asc(stats.orderIdx));

  if (allStats.length === 0) return null;

  return (
    <section className="py-16 bg-blue-600 text-white border-y border-blue-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {allStats.map((stat) => {
            const label = locale === 'id' ? stat.labelId : stat.labelEn;
            return (
              <div key={stat.id} className="flex flex-col items-center justify-center space-y-2">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tighter">{stat.value}</span>
                <span className="text-sm md:text-base text-blue-100 font-medium uppercase tracking-wider">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
