'use client';

import { MobileSidebar } from '@/components/navigation/mobile-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <MobileSidebar />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
