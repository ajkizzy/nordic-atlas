import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AboutContent } from './AboutContent';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('aboutTitle'), description: t('aboutDescription') };
}

export default function AboutPage() {
  return <AboutContent />;
}
