'use client';

import { Sidebar } from '@/components/navigation/sidebar';
import { Header } from './header';
import { Footer } from './footer';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50 border-r">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-72">
        <Header />
        <main className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
