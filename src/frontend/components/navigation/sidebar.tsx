'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  LayoutDashboard,
  BarChart3,
  Receipt,
  Radar,
  Settings,
} from 'lucide-react';

const routes = [
  {
    label: 'Home',
    icon: Home,
    href: '/',
    color: 'text-primary',
  },
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    color: 'text-violet-500',
  },
  {
    label: 'Transactions',
    icon: Receipt,
    href: '/transactions',
    color: 'text-pink-700',
  },
  {
    label: 'Monitor',
    icon: Radar,
    href: '/monitor',
    color: 'text-emerald-500',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background text-foreground">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <img src="/logo.svg" alt="Gateway Insights" className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">
            Gateway <span className="text-muted-foreground">Insights</span>
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-foreground hover:bg-accent rounded-lg transition',
                pathname === route.href
                  ? 'text-foreground bg-accent'
                  : 'text-muted-foreground'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
