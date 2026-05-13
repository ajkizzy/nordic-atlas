'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AnimatedSection } from '@/components/ui/Section';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const t = useTranslations('ctaSection');

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-brand" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />

      <div className="container-width relative z-10 py-24 md:py-32 text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-tight">
            {t('title')}
          </h2>
          <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="mt-8">
            <Link
              href="/design-your-bag"
              className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-brand-900 bg-white rounded-full hover:bg-brand-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('cta')}
              <ArrowRight size={18} />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
