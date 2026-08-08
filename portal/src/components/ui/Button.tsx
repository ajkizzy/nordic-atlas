'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-brand-700 text-white hover:bg-brand-800': variant === 'primary',
          'bg-white text-brand-900 border border-slate-200 hover:bg-slate-50 shadow-sm': variant === 'secondary',
          'border border-brand-800 text-brand-800 hover:bg-brand-800 hover:text-white': variant === 'outline',
          'text-slate-600 hover:text-slate-900 hover:bg-slate-100': variant === 'ghost',
          'bg-rose-600 text-white hover:bg-rose-700': variant === 'danger',
          'px-3 py-1.5 text-xs': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
