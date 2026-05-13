'use client';

import { useTranslations } from 'next-intl';
import { Section, AnimatedSection } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Palette, Paintbrush, Maximize2, Leaf } from 'lucide-react';

const features = [
  { key: 'logoPrinting', icon: Paintbrush },
  { key: 'colorMatching', icon: Palette },
  { key: 'customSizes', icon: Maximize2 },
  { key: 'sustainability', icon: Leaf },
] as const;

export function CustomBranding() {
  const t = useTranslations('customBranding');

  return (
    <Section background="white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: content */}
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            {t('subtitle')}
          </p>
        </AnimatedSection>

        {/* Right: feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={feature.key} delay={i * 0.1}>
                <GlassCard padding="sm" className="h-full">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-brand-700" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1.5">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>
                </GlassCard>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
