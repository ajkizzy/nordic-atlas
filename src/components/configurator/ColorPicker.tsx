'use client';

import { useTranslations } from 'next-intl';
import type { BagColor } from '@/types/products';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  colors: BagColor[];
  selectedId: string;
  onSelect: (colorId: string) => void;
}

export function ColorPicker({ colors, selectedId, onSelect }: ColorPickerProps) {
  const t = useTranslations();

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => {
          const isSelected = color.id === selectedId;
          const isLight = color.hex === '#FFFFFF' || color.hex === '#F5F0E8';

          return (
            <button
              key={color.id}
              onClick={() => onSelect(color.id)}
              className={cn(
                'relative w-10 h-10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2',
                isSelected
                  ? 'ring-2 ring-brand-600 ring-offset-2 scale-110'
                  : 'hover:scale-105 hover:shadow-md',
                isLight && 'border border-slate-200'
              )}
              style={{ backgroundColor: color.hex }}
              title={t(color.nameKey)}
              aria-label={t(color.nameKey)}
            >
              {isSelected && (
                <Check
                  size={16}
                  className={cn(
                    'absolute inset-0 m-auto',
                    isLight ? 'text-slate-800' : 'text-white'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      {/* Show selected color name */}
      <p className="mt-2 text-xs text-slate-500">
        {t(colors.find((c) => c.id === selectedId)?.nameKey ?? '')}
      </p>
    </div>
  );
}
