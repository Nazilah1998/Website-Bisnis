import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buttonVariants} from '@/components/ui/button';
import {Link} from '@/i18n/routing';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Pricing from '@/components/Pricing';
import BookingForm from '@/components/BookingForm';
import ClientLogos from '@/components/ClientLogos';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';
import Faqs from '@/components/Faqs';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FloatingLines from '@/components/ui/FloatingLines';
import { ShinyText } from '@/components/ui/ShinyText';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HomePage');

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <FloatingLines 
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={[4, 6, 8]}
            lineDistance={[8, 6, 4]}
            bendRadius={5.0}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Elevate Your Digital Presence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto">
            <ShinyText text={t('title')} />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mb-10 leading-relaxed mx-auto">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="#booking" className={buttonVariants({ size: "lg", className: "text-lg px-8 h-14 bg-white text-black hover:bg-gray-200" })}>
              {t('cta_booking')}
            </Link>
            <Link href="#portfolio" className={buttonVariants({ variant: "outline", size: "lg", className: "text-lg px-8 h-14 border-white/20 hover:bg-white/10" })}>
              {t('cta_portfolio')}
            </Link>
          </div>
        </div>
      </section>
      <ClientLogos />
      <Services />
      <Stats />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <Faqs />
      <BookingForm />
      <FloatingWhatsApp />
    </>
  );
}
