import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { Link } from '@/i18n/routing';
import { Calendar, ArrowRight } from 'lucide-react';
import { getLocale } from 'next-intl/server';

export default async function BlogPreview() {
  const locale = await getLocale();
  const latestPosts = await db.select().from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.createdAt))
    .limit(3);

  if (latestPosts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-zinc-950/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            Blog & Artikel
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Insight Terbaru</h2>
          <p className="text-muted-foreground">Tips dan tutorial seputar dunia website dan bisnis digital.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {latestPosts.map((post) => {
            const title = locale === 'id' ? post.titleId : post.titleEn;
            const excerpt = locale === 'id' ? post.excerptId : post.excerptEn;
            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-zinc-600 transition-all duration-300">
                <div className="aspect-video overflow-hidden bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 capitalize">{post.category}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {post.publishedAt?.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{excerpt}</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-blue-400">
                    Baca <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/blog" className="inline-flex items-center gap-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Lihat Semua Artikel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
