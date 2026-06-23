import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Settings, Image as ImageIcon, CreditCard, HelpCircle, Star, BarChart3, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';

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
    redirect(`/${locale}/management-gateway/login`);
  }

  async function logoutAction() {
    'use server';
    const cookiesStore = await cookies();
    cookiesStore.delete('admin_token');
    // Using string redirect instead of routing Link for server action
    redirect(`/${locale}/management-gateway/login`);
  }

  const navItems = [
    { name: 'Dashboard (Prospek)', href: '/management-gateway/dashboard', icon: LayoutDashboard },
    { name: 'Layanan', href: '/management-gateway/dashboard/services', icon: Settings },
    { name: 'Portofolio', href: '/management-gateway/dashboard/portfolios', icon: ImageIcon },
    { name: 'Paket Harga', href: '/management-gateway/dashboard/pricing', icon: CreditCard },
    { name: 'Testimoni', href: '/management-gateway/dashboard/testimonials', icon: Star },
    { name: 'Daftar FAQ', href: '/management-gateway/dashboard/faqs', icon: HelpCircle },
    { name: 'Logo Klien', href: '/management-gateway/dashboard/logos', icon: ImageIcon },
    { name: 'Statistik', href: '/management-gateway/dashboard/stats', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <h2 className="text-xl font-bold tracking-tight">Admin CMS</h2>
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Admin Menu</SheetTitle>
            <SheetDescription className="sr-only">Navigasi Admin CMS</SheetDescription>
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold tracking-tight">Admin CMS</h2>
                <p className="text-sm text-muted-foreground">Kelola website Anda</p>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => (
                  <SheetClose key={item.href} render={<Link href={item.href} />}>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </div>
                  </SheetClose>
                ))}
              </nav>
              <div className="p-4 border-t">
                <form action={logoutAction}>
                  <Button variant="ghost" type="submit" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10">
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </Button>
                </form>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-card flex-col h-full">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold tracking-tight">Admin CMS</h2>
          <p className="text-sm text-muted-foreground">Kelola website Anda</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors">
                <item.icon className="w-4 h-4" />
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <form action={logoutAction}>
            <Button variant="ghost" type="submit" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-0 md:p-4">
        {children}
      </main>
    </div>
  );
}
