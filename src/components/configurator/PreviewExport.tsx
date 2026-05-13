'use client';

import { useCallback, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

interface PreviewExportProps {
  /** Reference to the viewer container element for screenshot capture */
  viewerRef: React.RefObject<HTMLDivElement | null>;
  variantId: string;
  colorId: string;
}

/**
 * Handles exporting the product preview as an image.
 *
 * Current implementation uses html2canvas to capture the viewer DOM.
 * Future implementation can capture the Three.js canvas directly
 * using renderer.domElement.toDataURL().
 */
export function usePreviewExport({ viewerRef, variantId, colorId }: PreviewExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportPreview = useCallback(async () => {
    if (!viewerRef.current) return;
    setIsExporting(true);

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(viewerRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `nordic-atlas-${variantId}-${colorId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [viewerRef, variantId, colorId]);

  return { exportPreview, isExporting };
}
