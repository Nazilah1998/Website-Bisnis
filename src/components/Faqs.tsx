import { getLocale } from 'next-intl/server';
import { db } from '@/db';
import { faqs } from '@/db/schema';
import { asc } from 'drizzle-orm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function Faqs() {
  const locale = await getLocale();

  const allFaqs = await db.select().from(faqs).orderBy(asc(faqs.orderIdx));

  if (allFaqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{locale === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}</h2>
          <p className="text-muted-foreground text-lg">{locale === 'id' ? 'Temukan jawaban atas pertanyaan umum terkait layanan kami.' : 'Find answers to common questions about our services.'}</p>
        </div>
        
        <Accordion className="w-full">
          {allFaqs.map((faq) => {
            const question = locale === 'id' ? faq.questionId : faq.questionEn;
            const answer = locale === 'id' ? faq.answerId : faq.answerEn;
            
            return (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left text-lg font-medium">{question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-md leading-relaxed">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
