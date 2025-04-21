'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Settings,
  Menu,
  LogOut
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from '@/components/ui/sheet';
import { DashboardLogo } from '@/components/dashboard/main/dashboard-logo';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/context/user';
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  // In a real app, this would come from your auth context or API

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      href: '/dashboard/products',
      label: 'Products',
      icon: ShoppingBag
    },
    {
      href: '/dashboard/blogs',
      label: 'Blogs',
      icon: FileText
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="px-7">
          <Link
            href="/dashboard"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <DashboardLogo />
          </Link>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-2 px-7 py-2 text-base font-medium transition-colors hover:text-primary',
                pathname === route.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="px-7 flex flex-col gap-4">
          <Button
            variant="ghost"
            className="flex justify-start text-start gap-4 px-1 py-6 "
          >
            <Avatar className="h-10 w-10 flex justify-center items-center text-lg bg-secondary">
              {user?.name?.charAt(0)}
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => setOpen(false)}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
