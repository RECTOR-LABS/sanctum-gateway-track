'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BarChart3, TrendingUp, LineChart, Target } from 'lucide-react';

interface AnalyticsNavProps {
  className?: string;
}

const sections = [
  {
    id: 'cost-analysis',
    label: 'Cost Analysis',
    icon: BarChart3,
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: TrendingUp,
  },
  {
    id: 'trends',
    label: 'Trends',
    icon: LineChart,
  },
  {
    id: 'value',
    label: 'Gateway Value',
    icon: Target,
  },
];

export function AnalyticsNav({ className }: AnalyticsNavProps) {
  const [activeSection, setActiveSection] = useState('cost-analysis');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className={cn(
        'sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b',
        className
      )}
    >
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-4 py-2">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
              activeSection === id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
