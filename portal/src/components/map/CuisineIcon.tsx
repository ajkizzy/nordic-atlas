import type { Cuisine } from '@/types/db';
import { CUISINE_META } from '@/lib/cuisine';

/** Inline cuisine glyph. Uses the same lucide path data as the map pins. */
export function CuisineIcon({ cuisine, size = 15, className }: { cuisine: Cuisine; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={CUISINE_META[cuisine].label}
      dangerouslySetInnerHTML={{ __html: CUISINE_META[cuisine].svg }}
    />
  );
}
