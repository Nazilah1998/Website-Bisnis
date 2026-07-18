import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import PostFormDialog from './PostFormDialog';
import { PostActionButtons } from './PostActionButtons';

export default async function BlogAdminPage() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Kelola Blog & Artikel</h1>
          <p className="text-sm text-zinc-500 mt-1">Tulis dan kelola konten blog untuk meningkatkan SEO website.</p>
        </div>
        <PostFormDialog />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800">
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Judul Artikel</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Kategori</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Status</TableHead>
                <TableHead className="font-semibold text-zinc-600 dark:text-zinc-400">Tanggal</TableHead>
                <TableHead className="text-right font-semibold text-zinc-600 dark:text-zinc-400">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{post.titleId}</div>
                    <div className="text-xs text-zinc-400 font-mono">/{post.slug}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 capitalize">
                      {post.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={post.isPublished
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                    }>
                      {post.isPublished ? 'Terbit' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-xs">
                    {post.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <PostFormDialog editItem={post} />
                      <PostActionButtons item={post} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {allPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <BookOpen className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Belum ada artikel</p>
                      <p className="text-sm">Mulai tulis artikel pertama Anda.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
