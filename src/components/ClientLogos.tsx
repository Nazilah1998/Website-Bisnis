import { db } from '@/db';
import { clientLogos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Image from 'next/image';

export default async function ClientLogos() {
  const logos = await db.select().from(clientLogos).where(eq(clientLogos.isActive, true));

  if (logos.length === 0) return null;

  return (
    <section className="py-12 bg-background border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dipercaya oleh berbagai klien & menggunakan teknologi terkini</p>
      </div>
      <div className="relative flex max-w-[100vw] overflow-hidden group">
        <div className="animate-marquee flex w-max whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
            <div key={`${logo.id}-${index}`} className="flex-shrink-0 mx-8 md:mx-16 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <Image src={logo.logoUrl} alt={logo.name} width={120} height={60} className="object-contain h-12 w-auto max-w-[150px]" unoptimized />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
