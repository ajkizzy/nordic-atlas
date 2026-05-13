import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['da', 'en'] as const,
  defaultLocale: 'da',
  pathnames: {
    '/': '/',
    '/about': {
      da: '/om-os',
      en: '/about',
    },
    '/solutions': {
      da: '/losninger',
      en: '/solutions',
    },
    '/contact': {
      da: '/kontakt',
      en: '/contact',
    },
    '/design-your-bag': {
      da: '/design-din-pose',
      en: '/design-your-bag',
    },
    '/configurator/tote': {
      da: '/konfigurator/tote',
      en: '/configurator/tote',
    },
    '/configurator/retail': {
      da: '/konfigurator/detail',
      en: '/configurator/retail',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
