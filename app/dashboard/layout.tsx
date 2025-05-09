'use client';
import type React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, FileText, Settings } from 'lucide-react';
import { DashboardLogo } from '@/components/dashboard/main/dashboard-logo';
import { MobileNav } from '@/components/dashboard/main/mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserNav } from '@/components/dashboard/main/user-nav';
import { useUser } from '@/context/user';

import { UIError } from '@/components/ui-error';
import { UILoading } from '@/components/ui-loading';
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, error } = useUser();
  if (loading) return <UILoading fullPage />;
  if (error) return <UIError error={error} />;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <MobileNav />
            <Link href="/dashboard" className="hidden md:flex">
              <DashboardLogo />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
            
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed  z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'justify-start'
                )}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/products"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'justify-start'
                )}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Products
              </Link>
              <Link
                href="/dashboard/blogs"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'justify-start'
                )}
              >
                <FileText className="mr-2 h-4 w-4" />
                Blogs
              </Link>
              <Link
                href="/dashboard/settings"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'justify-start'
                )}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
