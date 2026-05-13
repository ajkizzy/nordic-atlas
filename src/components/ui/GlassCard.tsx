'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'dark';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', hover = false, padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-300',
          {
            // Variants
            'glass-card': variant === 'default',
            'glass-card shadow-lg': variant === 'elevated',
            'glass-dark': variant === 'dark',
            // Hover
            'hover:shadow-xl hover:-translate-y-1 hover:border-brand-200/40 cursor-pointer': hover,
            // Padding
            'p-0': padding === 'none',
            'p-4 md:p-5': padding === 'sm',
            'p-6 md:p-8': padding === 'md',
            'p-8 md:p-10': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
