'use client';

import { usePathname } from 'next/navigation';
import { MainLayout } from './main-layout';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that should NOT have the sidebar/main layout
  const standalonePages = ['/', '/pitch-deck'];

  const isStandalonePage = standalonePages.includes(pathname);

  if (isStandalonePage) {
    // Render children directly without sidebar for standalone marketing pages
    return <>{children}</>;
  }

  // Use MainLayout (with sidebar) for app pages
  return <MainLayout>{children}</MainLayout>;
}
