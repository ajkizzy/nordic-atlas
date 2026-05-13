'use client';

import { useTranslations } from 'next-intl';
import { Section } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedSection } from '@/components/ui/Section';
import { ShoppingBag, UtensilsCrossed, PartyPopper, Briefcase } from 'lucide-react';

const segments = [
  { key: 'retail', icon: ShoppingBag },
  { key: 'food', icon: UtensilsCrossed },
  { key: 'events', icon: PartyPopper },
  { key: 'corporate', icon: Briefcase },
] as const;

export function WhoWeServe() {
  const t = useTranslations('whoWeServe');

  return (
    <Section background="white">
      <AnimatedSection>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {segments.map((segment, i) => {
          const Icon = segment.icon;
          return (
            <AnimatedSection key={segment.key} delay={i * 0.1}>
              <GlassCard hover padding="md" className="text-center h-full">
                <div className="w-12 h-12 mx-auto rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-brand-700" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t(`${segment.key}.title`)}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t(`${segment.key}.description`)}
                </p>
              </GlassCard>
            </AnimatedSection>
          );
        })}
      </div>
    </Section>
  );
}
