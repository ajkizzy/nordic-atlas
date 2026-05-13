'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Section, AnimatedSection } from '@/components/ui/Section';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    key: 'tote',
    href: '/configurator/tote' as const,
    gradient: 'from-brand-800 to-brand-600',
  },
  {
    key: 'retail',
    href: '/configurator/retail' as const,
    gradient: 'from-slate-800 to-slate-600',
  },
] as const;

export function ProductCategories() {
  const t = useTranslations('productCategories');

  return (
    <Section background="subtle">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {categories.map((cat, i) => (
          <AnimatedSection key={cat.key} delay={i * 0.15}>
            <Link href={cat.href} className="group block">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[3/2]">
                {/* Background gradient — replace with product imagery */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />

                {/* Placeholder content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {t(`${cat.key}.title`)}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base max-w-sm leading-relaxed">
                      {t(`${cat.key}.description`)}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 group-hover:bg-white/30 transition-all duration-300">
                      {t('explore')}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </Section>
  );
}
