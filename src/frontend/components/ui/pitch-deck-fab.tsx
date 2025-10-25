'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';

/**
 * Floating Action Button - Links to Pitch Deck
 *
 * Appears on all pages (bottom-right corner) to provide easy access to the pitch deck.
 * Uses Sanctum blue branding.
 */
export function PitchDeckFAB() {
  const pathname = usePathname();

  // Don't show FAB on pitch deck page itself
  if (pathname === '/pitch-deck') {
    return null;
  }

  return (
    <Link
      href="/pitch-deck"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-4 py-3 md:px-6 md:py-4"
      aria-label="View Pitch Deck"
    >
      <FileText className="h-5 w-5 md:h-6 md:w-6" />
      <span className="hidden sm:inline font-semibold text-sm md:text-base">
        View Pitch Deck
      </span>
      <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
    </Link>
  );
}
