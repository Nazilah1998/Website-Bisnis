'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/i18n/routing';
import {Button} from './ui/button';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function toggleLocale() {
    const nextLocale = locale === 'id' ? 'en' : 'id';
    // Using Next-Intl router to preserve pathname but change locale
    router.replace(pathname, {locale: nextLocale});
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLocale} className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <span className="uppercase text-xs font-semibold">{locale}</span>
    </Button>
  );
}
