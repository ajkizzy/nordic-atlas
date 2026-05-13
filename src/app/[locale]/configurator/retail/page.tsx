import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RetailConfiguratorContent } from './RetailConfiguratorContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('configuratorRetailTitle'),
  };
}

export default function RetailConfiguratorPage() {
  return <RetailConfiguratorContent />;
}
