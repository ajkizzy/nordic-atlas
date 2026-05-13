'use client';

import { useTranslations } from 'next-intl';
import { Section, AnimatedSection } from '@/components/ui/Section';
import { MousePointerClick, PenTool, Factory, Truck } from 'lucide-react';

const steps = [
  { key: 'step1', icon: MousePointerClick, number: '01' },
  { key: 'step2', icon: PenTool, number: '02' },
  { key: 'step3', icon: Factory, number: '03' },
  { key: 'step4', icon: Truck, number: '04' },
] as const;

export function HowItWorks() {
  const t = useTranslations('howItWorks');

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <AnimatedSection key={step.key} delay={i * 0.12}>
              <div className="relative text-center">
                {/* Connector line (hidden on mobile / last item) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand-300 to-transparent" />
                )}

                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5">
                    <Icon size={24} className="text-brand-700" />
                  </div>
                  <span className="text-xs font-bold text-brand-600 tracking-widest uppercase mb-2 block">
                    {step.number}
                  </span>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {t(`${step.key}.title`)}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[220px] mx-auto">
                    {t(`${step.key}.description`)}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </Section>
  );
}
