'use client';

import { useTranslations } from 'next-intl';
import type { BagVariant } from '@/types/products';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface BagTypeSelectorProps {
  variants: BagVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
}

export function BagTypeSelector({ variants, selectedId, onSelect }: BagTypeSelectorProps) {
  const t = useTranslations();

  return (
    <div className="space-y-2">
      {variants.map((variant) => {
        const isSelected = variant.id === selectedId;
        return (
          <button
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            className={cn(
              'w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200',
              isSelected
                ? 'border-brand-600 bg-brand-50/60 ring-1 ring-brand-600/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cn(
                    'font-semibold text-sm',
                    isSelected ? 'text-brand-900' : 'text-slate-900'
                  )}>
                    {t(variant.nameKey)}
                  </p>
                  {variant.sizeLabel && (
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]',
                        isSelected ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {variant.sizeLabel}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {t(variant.descriptionKey)}
                </p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 ml-3">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
