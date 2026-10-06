import { defaultLang, languages, messages, type Locale } from './ui';

export function isLocale(value: string): value is Locale {
  return value in languages;
}

/**
 * Blog/posts: nama file pakai sufiks -id / -en (replikasi pola lama).
 */
export function pickByLocale<TDev = unknown, TEn = unknown>(
  locale: Locale,
  idValue: TDev,
  enValue: TEn,
): TDev | TEn {
  return locale === 'en' ? enValue : idValue;
}

export type TranslateFn = (key: string) => string;

/** Resolver get-bertingkat (mis. "HomePage.title", "Services.items.company_profile.title"). */
export function t(lang: Locale, key: string): string {
  const dict: unknown = messages[lang] ?? messages[defaultLang];
  const fallback: unknown = messages[defaultLang];
  const value = lookup(dict, key);
  if (typeof value === 'string') return value;
  const fb = lookup(fallback, key);
  return typeof fb === 'string' ? fb : key;
}

function lookup(source: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
}

/** next-intl Link dengan localePrefix "as-needed": id tanpa prefix, en ber-prefix. */
export function localeHref(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLang) return clean;
  return `/${locale}${clean}`;
}

export function getLangFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  if (first && isLocale(first)) return first;
  return defaultLang;
}

/** Konversi path nama halaman antarlokale (id → path polos, en → /en/path). */
export function translatedPath(currentLocale: Locale, path: string, targetLocale: Locale): string {
  return localeHref(targetLocale, path);
}