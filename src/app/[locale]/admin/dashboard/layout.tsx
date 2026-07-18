import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  const { locale } = await params;
  
  if (token?.value !== (process.env.ADMIN_SECRET || 'secret123')) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 flex-col lg:flex-row overflow-hidden">
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
