import { MetadataRoute } from 'next';
import { db } from '@/db';
import { posts, portfolios } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://ZilyaDigital.com';
const LOCALES = ['id', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/about',
    '/client/login',
  ];

  const mapRoutes = routes.flatMap(route => 
    LOCALES.map(locale => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  // Fetch blogs
  const allPosts = await db.select().from(posts).where(eq(posts.isPublished, true)).orderBy(desc(posts.createdAt));
  const postRoutes = allPosts.flatMap(post => 
    LOCALES.map(locale => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  // Fetch portfolios
  const allPortfolios = await db.select().from(portfolios).orderBy(desc(portfolios.createdAt));
  const portfolioRoutes = allPortfolios.flatMap(port => 
    LOCALES.map(locale => ({
      url: `${BASE_URL}/${locale}/portfolio/${port.id}`,
      lastModified: new Date(port.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...mapRoutes, ...postRoutes, ...portfolioRoutes];
}
