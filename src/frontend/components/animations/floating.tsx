'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export function Floating({
  children,
  delay = 0,
  duration = 3,
  yOffset = 10,
  className = '',
}: FloatingProps) {
  return (
    <motion.div
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
