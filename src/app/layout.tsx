import type { ReactNode } from 'react';

/**
 * Root layout — delegates to [locale]/layout.tsx for HTML/body rendering.
 * This file is required by Next.js but the locale layout handles the real structure.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
