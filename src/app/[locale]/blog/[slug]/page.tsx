import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Calendar, Tag, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!result.length) return { title: 'Artikel Tidak Ditemukan' };
  const post = result[0];
  return {
    title: `${locale === 'id' ? post.titleId : post.titleEn} – ZilyaDigital Blog`,
    description: locale === 'id' ? post.excerptId : post.excerptEn,
    openGraph: { images: [post.coverImageUrl] },
  };
}

// Simple markdown to HTML converter (no external dependency)
function simpleMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-3 text-zinc-900 dark:text-zinc-100">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4 text-zinc-900 dark:text-zinc-100">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-4 text-zinc-900 dark:text-zinc-100">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">')
    .replace(/^(?!<[h|l])(.+)$/gm, '$1');
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!result.length || !result[0].isPublished) notFound();

  const post = result[0];
  const title = locale === 'id' ? post.titleId : post.titleEn;
  const content = locale === 'id' ? post.contentId : post.contentEn;
  const excerpt = locale === 'id' ? post.excerptId : post.excerptEn;
  let tags: string[] = [];
  try { tags = JSON.parse(post.tags); } catch { /* ignore */ }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover */}
      <div className="w-full h-72 md:h-96 overflow-hidden bg-zinc-800 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.coverImageUrl} alt={title} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 max-w-3xl -mt-20 relative z-10">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-8 md:p-12">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 capitalize flex items-center gap-1">
              <Tag className="w-3 h-3" /> {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Calendar className="w-3 h-3" />
              {post.publishedAt?.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">{title}</h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed border-l-4 border-blue-500/40 pl-4 italic">{excerpt}</p>

          {/* Content */}
          <div
            className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: `<p class="mb-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">${simpleMarkdown(content)}</p>` }}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              {tags.map((tag, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-center">
            <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Butuh Website Profesional?</p>
            <p className="text-sm text-zinc-500 mb-4">Konsultasikan kebutuhan Anda dengan tim kami sekarang.</p>
            <Link href="/#booking" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
              Konsultasi Gratis <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
