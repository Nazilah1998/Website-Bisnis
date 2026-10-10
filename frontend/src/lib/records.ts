import { getPublic } from './server';

export interface ClientLogoRecord {
  id: string;
  logoUrl?: string | null;
  name?: string | null;
  [key: string]: unknown;
}

export interface ServiceRecord {
  id: string;
  iconName?: string | null;
  titleId?: string | null;
  titleEn?: string | null;
  descId?: string | null;
  descEn?: string | null;
  [key: string]: unknown;
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
  [key: string]: unknown;
}

export interface TestimonialRecord {
  id: string;
  contentId?: string | null;
  contentEn?: string | null;
  avatarUrl?: string | null;
  clientName?: string | null;
  role?: string | null;
  [key: string]: unknown;
}

export interface PricingRecord {
  id: string;
  name?: string | null;
  price?: string | null;
  type?: string | null;
  isPopular?: boolean | null;
  featuresJson?: string | null;
  [key: string]: unknown;
}

export interface FaqRecord {
  id: string;
  questionId?: string | null;
  questionEn?: string | null;
  answerId?: string | null;
  answerEn?: string | null;
  [key: string]: unknown;
}

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
  [key: string]: unknown;
}

export async function getPublishedPost(slug: string): Promise<PostRecord | null> {
  const posts = await getPublic<PostRecord>('posts', { filter: 'isPublished=true' });
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getPortfolio(id: string): Promise<PortfolioRecord | null> {
  const portfolios = await getPublic<PortfolioRecord>('portfolios');
  return portfolios.find((p) => p.id === id) ?? null;
}