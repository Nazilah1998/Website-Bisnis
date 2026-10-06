import type { APIRoute } from 'astro';
import { getPublic } from '@/lib/server';
import { getEnv } from '@/lib/env';

const SITE_URL = getEnv('SITE_URL', 'https://zilyadigital.com').replace(/\/+$/, '');

const STATIC_PAGES = ['', '/about', '/privacy', '/terms', '/blog', '/portofolio', '/client/login'];

export const GET: APIRoute = async () => {
  const urls: string[] = [];

  for (const lang of ['id', 'en'] as const) {
    for (const page of STATIC_PAGES) {
      const path = lang === 'id' ? page : `/en${page}`;
      urls.push(`${SITE_URL}${path || '/'}`);
    }
  }

  const [posts, portfolios] = await Promise.all([
    getPublic('posts', { filter: 'isPublished=true' }).catch(() => []),
    getPublic('portfolios').catch(() => []),
  ]);

  for (const p of posts) {
    if (!p.slug) continue;
    urls.push(`${SITE_URL}/blog/${p.slug}`);
    urls.push(`${SITE_URL}/en/blog/${p.slug}`);
  }
  for (const f of portfolios) {
    urls.push(`${SITE_URL}/portofolio/${f.id}`);
    urls.push(`${SITE_URL}/en/portofolio/${f.id}`);
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`)
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};