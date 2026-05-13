'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/' as const, labelKey: 'home' },
  { href: '/about' as const, labelKey: 'about' },
  { href: '/solutions' as const, labelKey: 'solutions' },
  { href: '/contact' as const, labelKey: 'contact' },
] as const;

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#010101] w-full pt-[80px] pb-[24px]">
      <div className="max-w-container mx-auto px-4">
        {/* Footer Top */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-12">
          {/* Left Column */}
          <div className="flex flex-col gap-8 lg:max-w-[600px]">
            <h2 className="font-heading text-white text-[28px] md:text-[40px] leading-[132%] tracking-[-0.8px] font-medium">
              {t('tagline')}
            </h2>

            {/* Search Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center w-full max-w-[480px]"
            >
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="flex-1 bg-white/10 text-white placeholder:text-white/40 font-body text-sm px-5 py-3 rounded-l-pill border border-white/10 border-r-0 outline-none focus:border-white/25 transition-colors"
              />
              <button
                type="submit"
                className="bg-brand-700 hover:bg-brand-600 text-white px-4 py-3 rounded-r-pill transition-colors flex items-center justify-center"
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>

            {/* Logo */}
            <div className="mt-4">
              <Image
                src="/images/footer800.png"
                alt="Nordic Atlas Packaging"
                width={280}
                height={140}
              />
            </div>
          </div>

          {/* Right Column — Nav */}
          <nav className="flex-shrink-0 w-full lg:w-[260px]">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-white/10 first:border-t first:border-white/10">
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between py-4 text-white font-body text-base hover:text-brand-300 transition-colors"
                  >
                    <span>{nav(link.labelKey)}</span>
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Image
                        src="/images/icons/arrow-right.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity"
                      />
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-16 mb-6 h-px bg-white/10" />

        {/* Footer Bottom */}
        <div className="flex items-center justify-center">
          <p className="text-white/40 font-body text-sm text-center">
            {t('copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
