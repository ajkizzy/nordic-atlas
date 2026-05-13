'use client';

import { useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoUploaderProps {
  logoPreviewUrl: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
const MAX_SIZE_MB = 10;

export function LogoUploader({ logoPreviewUrl, onUpload, onRemove }: LogoUploaderProps) {
  const t = useTranslations('configurator');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) return;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) return;
      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (logoPreviewUrl) {
    return (
      <div className="relative group">
        <div className="relative w-full aspect-video rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center p-4">
          <img
            src={logoPreviewUrl}
            alt="Uploaded logo"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
          title={t('removeLogo')}
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        'relative w-full aspect-video rounded-xl border-2 border-dashed border-slate-200',
        'bg-slate-50/50 hover:bg-slate-50 hover:border-brand-300 transition-all duration-200',
        'flex flex-col items-center justify-center gap-3 cursor-pointer group'
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
        <Upload size={18} className="text-brand-600" />
      </div>
      <div className="text-center">
        <p className="text-sm text-slate-600 font-medium">{t('dragDrop')}</p>
        <p className="text-xs text-slate-400 mt-1">PNG, JPG, SVG — max {MAX_SIZE_MB}MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  );
}
