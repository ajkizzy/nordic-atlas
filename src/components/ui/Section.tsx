'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: 'white' | 'subtle' | 'dark' | 'brand';
  container?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, background = 'white', container = true, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          'section-padding',
          {
            'bg-white': background === 'white',
            'gradient-subtle': background === 'subtle',
            'bg-slate-950 text-white': background === 'dark',
            'gradient-brand text-white': background === 'brand',
          },
          className
        )}
        {...props}
      >
        {container ? (
          <div className="container-width">{children}</div>
        ) : (
          children
        )}
      </section>
    );
  }
);

Section.displayName = 'Section';

/** Animated wrapper for sections — fades in on scroll */
export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
