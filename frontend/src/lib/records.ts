import { getPublic } from './server';

export interface PostRecord {
  id: string;
  slug?: string | null;
  category?: string | null;
  publishedAt?: string | null;
  titleId?: string | null;
  titleEn?: string | null;
  excerptId?: string | null;
  excerptEn?: string | null;
  contentId?: string | null;
  contentEn?: string | null;
  coverImageUrl?: string | null;
  tags?: string | null;
}

export async function getPublishedPost(slug: string): Promise<PostRecord | null> {
  const posts = await getPublic('posts', { filter: 'isPublished=true' });
  return posts.find((p) => p.slug === slug) ?? null;
}

export interface PortfolioRecord {
  id: string;
  titleId?: string | null;
  titleEn?: string | null;
  descId?: string | null;
  descEn?: string | null;
  imageUrl?: string | null;
  clientName?: string | null;
  category?: string | null;
  techStack?: string | null;
  challenge?: string | null;
  solution?: string | null;
  liveUrl?: string | null;
  results?: string | null;
}

export async function getPortfolio(id: string): Promise<PortfolioRecord | null> {
  const portfolios = await getPublic('portfolios');
  return portfolios.find((p) => p.id === id) ?? null;
}