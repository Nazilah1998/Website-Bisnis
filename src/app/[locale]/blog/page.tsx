import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { Link } from '@/i18n/routing';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Artikel – ZilyaDigital',
  description: 'Tips, tutorial, dan insight seputar pembuatan website, desain, dan pengembangan bisnis digital.',
};

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const allPosts = await db.select().from(posts).where(eq(posts.isPublished, true)).orderBy(desc(posts.createdAt));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-zinc-950 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-20 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <Tag className="w-3 h-3" /> Blog & Artikel
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Insight & Tutorial
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Tips, panduan, dan wawasan seputar dunia website, desain, dan bisnis digital.
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="container mx-auto px-4 py-16">
        {allPosts.length === 0 ? (
          <div className="text-center py-24 text-zinc-400">Belum ada artikel yang diterbitkan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map((post) => {
              let tags: string[] = [];
              try { tags = JSON.parse(post.tags); } catch { /* ignore */ }
              const title = locale === 'id' ? post.titleId : post.titleEn;
              const excerpt = locale === 'id' ? post.excerptId : post.excerptEn;

              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
                  <div className="aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.coverImageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt?.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) || '-'}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {title}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-4">{excerpt}</p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                      Baca Selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
