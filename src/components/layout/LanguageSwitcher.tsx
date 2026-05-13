'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 p-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200 uppercase tracking-wider',
            loc === locale
              ? 'bg-brand-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-brand-900 hover:bg-white/60'
          )}
          aria-label={`Switch to ${loc === 'da' ? 'Danish' : 'English'}`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
