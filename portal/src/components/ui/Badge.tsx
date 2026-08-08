import { cn } from '@/lib/utils';

export function Badge({ children, color, className }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700', className)}
    >
      {color && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
      {children}
    </span>
  );
}
