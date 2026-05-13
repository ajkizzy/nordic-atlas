'use client';

import { Link } from '@/i18n/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  title: string;
  description: string;
  cta: string;
  href: '/configurator/tote' | '/configurator/retail';
  gradient: string;
  index: number;
}

export function CategoryCard({ title, description, cta, href, gradient, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={href} className="group block">
        <GlassCard hover variant="elevated" padding="none" className="overflow-hidden">
          {/* Image area — replace with product photography */}
          <div className={`relative aspect-[16/10] bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
            </div>
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-7 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand-800 transition-colors">
              {title}
            </h3>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6">
              {description}
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 group-hover:text-brand-600 transition-colors">
              {cta}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
