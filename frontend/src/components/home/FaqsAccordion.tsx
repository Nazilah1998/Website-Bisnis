import type { Locale } from "@/i18n/ui";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface FaqRecord {
  id: string;
  questionId?: string | null;
  questionEn?: string | null;
  answerId?: string | null;
  answerEn?: string | null;
  [key: string]: unknown;
}

interface Props {
  lang: Locale;
  items: FaqRecord[];
  labels: { title: string; subtitle: string };
}

export default function FaqsAccordion({ lang, items, labels }: Props) {
  if (items.length === 0) return null;

  return (
    <section id="faq" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{labels.title}</h2>
          <p className="text-muted-foreground text-lg">{labels.subtitle}</p>
        </div>

        <Accordion className="w-full">
          {items.map((faq) => {
            const question = lang === "en" ? faq.questionEn : faq.questionId;
            const answer = lang === "en" ? faq.answerEn : faq.answerId;

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