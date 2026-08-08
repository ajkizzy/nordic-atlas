'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp } from 'lucide-react';

const integer = new Intl.NumberFormat('da-DK', { maximumFractionDigits: 0 });

export function BagSalesTicker({ total }: { total: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || total === 0) {
      setDisplayed(total);
      return;
    }

    const duration = 900;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(total * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total]);

  return (
    <div className="mb-4 flex min-h-24 items-center gap-4 rounded-lg bg-slate-900 px-5 py-4 text-white shadow-sm sm:px-6">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-emerald-500/15 text-emerald-300">
        <ShoppingBag size={24} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-normal text-slate-400">Total bags sold</p>
        <p className="font-heading text-3xl font-semibold tabular-nums tracking-normal text-white" aria-label={`${integer.format(total)} total bags sold`}>
          {integer.format(displayed)}
        </p>
      </div>
      <span className="hidden items-center gap-1.5 text-xs font-semibold text-emerald-300 sm:flex">
        <TrendingUp size={15} /> All time
      </span>
    </div>
  );
}
