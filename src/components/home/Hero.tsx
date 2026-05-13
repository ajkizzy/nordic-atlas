'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient + pattern */}
      <div className="absolute inset-0 gradient-subtle" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,78,59,0.05),transparent_60%)]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-width relative z-10 py-32 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              {t('subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/design-your-bag"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-full gradient-brand hover:shadow-xl hover:shadow-brand-900/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                {t('cta')}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12m0 0L9 3m5 5L9 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-brand-900 rounded-full border-2 border-brand-900/20 hover:border-brand-900/40 hover:bg-brand-50/50 transition-all duration-300"
              >
                {t('secondaryCta')}
              </Link>
            </div>
          </motion.div>

          {/* Hero visual — placeholder for product imagery/video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card">
              {/* Replace with actual product image/video */}
              <div className="absolute inset-0 gradient-brand opacity-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl gradient-brand flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">Product imagery / video</p>
                  <p className="text-xs text-slate-400 mt-1">Replace with Nordic Atlas assets</p>
                </div>
              </div>
            </div>

            {/* Floating accent elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-brand-100/60 backdrop-blur-sm -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-2xl bg-brand-50/80 backdrop-blur-sm -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
