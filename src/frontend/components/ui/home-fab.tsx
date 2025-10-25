'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function HomeFAB() {
  const pathname = usePathname();

  // Only show on pitch-deck page
  if (pathname !== '/pitch-deck') {
    return null;
  }

  return (
    <Link
      href="/"
      className="fixed bottom-24 right-6 z-50 group flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-4 py-3 md:px-6 md:py-4"
      aria-label="Go to Homepage"
    >
      <Home className="h-5 w-5 md:h-6 md:w-6" />
      <span className="hidden sm:inline font-semibold text-sm md:text-base">
        Home
      </span>
      <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
    </Link>
  );
}
