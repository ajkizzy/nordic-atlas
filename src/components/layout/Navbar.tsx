'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/' as const, labelKey: 'home' },
  { href: '/about' as const, labelKey: 'about' },
  { href: '/solutions' as const, labelKey: 'solutions' },
  { href: '/contact' as const, labelKey: 'contact' },
] as const;

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="relative z-50 transition-all duration-300 pt-[26px]">
      <div className="container-main">
        <div className="flex items-center justify-between rounded-2xl px-5 py-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Nordic Atlas Packaging"
              width={167}
              height={50}
              className="hidden md:block"
              priority
            />
            <Image
              src="/images/logo.png"
              alt="Nordic Atlas Packaging"
              width={65}
              height={20}
              className="md:hidden"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isHovered = hoveredLink === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={cn(
                      'px-4 py-2 text-[15px] font-medium rounded-lg transition-all duration-200 font-heading inline-block',
                      isActive
                        ? 'text-[#010101] font-semibold'
                        : 'text-[#4a4a4a] hover:text-[#010101]'
                    )}
                    style={{
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      transformOrigin: 'center'
                    }}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right: Language + CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <Link
              href="/design-your-bag"
              className="hidden lg:flex items-center bg-[#010101] hover:bg-[#095d36] text-white rounded-pill px-5 py-2.5 text-sm font-medium font-heading transition-colors duration-200"
            >
              {t('designCTA')}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2"
              aria-label="Toggle menu"
            >
              <Image src="/images/icons/menu.svg" alt="Menu" width={24} height={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Offcanvas */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[9998]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-white z-[9999] shadow-2xl"
            >
              <div className="p-6">
                <div className="flex justify-end mb-8">
                  <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                    <Image src="/images/icons/close.svg" alt="Close" width={20} height={20} />
                  </button>
                </div>
                <ul className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'block px-4 py-3 text-lg font-heading font-medium rounded-lg transition-colors',
                            isActive
                              ? 'text-brand-700 bg-brand-50'
                              : 'text-dark-100 hover:bg-gray-600'
                          )}
                        >
                          {t(link.labelKey)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
