"use client";

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Settings, Image as ImageIcon, CreditCard, HelpCircle, Star, LogOut, Menu, ShieldCheck, ChevronLeft, ChevronRight, BookOpen, Users, FolderOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';

import Image from 'next/image';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Layanan', href: '/admin/dashboard/services', icon: Settings },
  { name: 'Portofolio', href: '/admin/dashboard/portfolios', icon: ImageIcon },
  { name: 'Paket Harga', href: '/admin/dashboard/pricing', icon: CreditCard },
  { name: 'Blog & Artikel', href: '/admin/dashboard/blog', icon: BookOpen },
  { name: 'Testimoni', href: '/admin/dashboard/testimonials', icon: Star },
  { name: 'Daftar FAQ', href: '/admin/dashboard/faqs', icon: HelpCircle },
  { name: 'Logo Klien', href: '/admin/dashboard/logos', icon: ImageIcon },
  { name: 'Kelola Klien', href: '/admin/dashboard/clients', icon: Users },
  { name: 'Kelola Proyek', href: '/admin/dashboard/projects', icon: FolderOpen },
  { name: 'Tagihan (Invoice)', href: '/admin/dashboard/invoices', icon: CreditCard },
  { name: 'Tiket Bantuan', href: '/admin/dashboard/tickets', icon: HelpCircle },
];

const NavLinks = ({ isMobile = false, currentPath, isCollapsed = false }: { isMobile?: boolean, currentPath: string, isCollapsed?: boolean }) => {
  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return currentPath.endsWith('/admin/dashboard');
    }
    return currentPath.includes(href);
  };

  return (
    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 overflow-x-hidden">
      {!isCollapsed && <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2 whitespace-nowrap">Menu Utama</div>}
      {isCollapsed && <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2 text-center">...</div>}
      {navItems.map((item) => {
        const active = isActive(item.href);
        const content = (
          <div title={isCollapsed ? item.name : undefined} className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50'}`}>
            <item.icon className={`flex-shrink-0 w-5 h-5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
            {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
          </div>
        );

        if (isMobile) {
          return (
            <SheetClose key={item.href} render={<Link href={item.href} />}>
              {content}
            </SheetClose>
          );
        }

        return (
          <Link key={item.href} href={item.href}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
};

// Komponen logout terpisah menggunakan API route — BUKAN server action form
// Ini mencegah form submit terpanggil secara tidak sengaja saat navigasi
function LogoutButton({ className, showLabel = true }: { className?: string, showLabel?: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.href = '/id/admin/login';
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleLogout}
      disabled={loading}
      title={!showLabel ? 'Keluar Akun' : undefined}
      className={className}
    >
      <LogOut className={`flex-shrink-0 w-5 h-5 ${showLabel ? 'mr-3' : ''}`} />
      {showLabel && <span className="whitespace-nowrap">{loading ? 'Keluar...' : 'Keluar Akun'}</span>}
    </Button>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-zinc-950 sticky top-0 z-20 transition-all duration-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          <h2 className="text-lg font-bold tracking-tight">Admin CMS</h2>
        </div>
        <Sheet>
          <SheetTrigger render={<Button type="button" variant="ghost" size="icon" className="lg:hidden" />}>
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col bg-white dark:bg-zinc-950 border-r-zinc-200 dark:border-r-zinc-800">
            <SheetTitle className="sr-only">Admin Menu</SheetTitle>
            <SheetDescription className="sr-only">Navigasi Admin CMS</SheetDescription>
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <div className="flex-shrink-0">
                <Image src="/logo.jpg" alt="ZilyaDigital Logo" width={32} height={32} className="rounded-md" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight leading-tight">ZilyaDigital</h2>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            </div>
            <NavLinks isMobile currentPath={pathname} />
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
              <LogoutButton
                showLabel
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800/50 shadow-sm z-10 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-20' : 'w-72'}`}>
        
        {/* Toggle Button */}
        <Button 
          type="button"
          variant="outline" 
          size="icon"
          className="absolute -right-4 top-6 z-20 w-8 h-8 rounded-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 hover:text-zinc-900 shadow-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        <div className={`p-6 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center ${isCollapsed ? 'justify-center px-4' : 'gap-3'} transition-all duration-300 overflow-hidden`}>
          <div className="flex-shrink-0">
            <Image src="/logo.jpg" alt="ZilyaDigital Logo" width={32} height={32} className="rounded-md" />
          </div>
          {!isCollapsed && (
            <div className="whitespace-nowrap transition-opacity duration-300">
              <h2 className="text-base font-bold tracking-tight leading-tight text-zinc-900 dark:text-white">ZilyaDigital</h2>
              <p className="text-xs text-zinc-500">Admin Portal</p>
            </div>
          )}
        </div>
        <NavLinks currentPath={pathname} isCollapsed={isCollapsed} />
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/50">
          <LogoutButton
            showLabel={!isCollapsed}
            className={`w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}
          />
        </div>
      </aside>
    </>
  );
}
