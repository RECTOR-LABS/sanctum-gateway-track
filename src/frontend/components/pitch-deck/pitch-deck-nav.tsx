'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const sections = [
  { id: 1, label: 'Cover', shortLabel: 'Cover' },
  { id: 2, label: 'Problem', shortLabel: 'Problem' },
  { id: 3, label: 'Solution', shortLabel: 'Solution' },
  { id: 4, label: 'Demo Video', shortLabel: 'Video' },
  { id: 5, label: 'Gateway Proof', shortLabel: 'Proof' },
  { id: 6, label: 'Results', shortLabel: 'Results' },
  { id: 7, label: 'Technical', shortLabel: 'Tech' },
  { id: 8, label: 'Innovation', shortLabel: 'Innovation' },
  { id: 9, label: 'Live Demo', shortLabel: 'Demo' },
  { id: 10, label: 'Impact', shortLabel: 'Impact' },
  { id: 11, label: 'Tech Stack', shortLabel: 'Stack' },
  { id: 12, label: 'Summary', shortLabel: 'Summary' },
];

export function PitchDeckNav() {
  const [activeSection, setActiveSection] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = parseInt(entry.target.id.replace('section-', ''));
            setActiveSection(sectionId);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(`section-${id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block group"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col gap-3 bg-background/80 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
        {sections.map(({ id, label, shortLabel }) => (
          <a
            key={id}
            href={`#section-${id}`}
            className={cn(
              'flex items-center gap-3 transition-all duration-300 group/item',
              'hover:translate-x-0',
              activeSection === id
                ? 'translate-x-0'
                : '-translate-x-0'
            )}
            aria-label={`Go to ${label}`}
          >
            {/* Dot indicator */}
            <div
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300',
                activeSection === id
                  ? 'bg-primary scale-125 shadow-lg shadow-primary/50'
                  : 'bg-muted group-hover/item:bg-primary/50'
              )}
            />

            {/* Label - shows on hover or when active */}
            <span
              className={cn(
                'text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden',
                isExpanded || activeSection === id
                  ? 'opacity-100 max-w-[120px]'
                  : 'opacity-0 max-w-0'
              )}
            >
              {isExpanded ? label : shortLabel}
            </span>

            {/* Active indicator line */}
            {activeSection === id && (
              <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full -translate-x-3" />
            )}
          </a>
        ))}

        {/* Section counter */}
        <div className="mt-2 pt-2 border-t text-center">
          <span className="text-xs font-medium text-muted-foreground">
            {activeSection} / {sections.length}
          </span>
        </div>
      </div>
    </nav>
  );
}
