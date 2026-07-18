import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/client/dashboard/'],
    },
    sitemap: 'https://ZilyaDigital.com/sitemap.xml',
  };
}
