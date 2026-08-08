import { CUISINE_META, CUISINE_ORDER } from '@/lib/cuisine';
import { STATUS_COLORS, type LeadStatus } from '@/types/db';
import { CuisineIcon } from './CuisineIcon';

const STATUSES = Object.keys(STATUS_COLORS) as LeadStatus[];

export function MapLegend() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 backdrop-blur p-3 text-xs space-y-3">
      <div>
        <p className="font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Pin colour = status</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {STATUSES.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s] }} />
              {s}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Glyph = cuisine</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {CUISINE_ORDER.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 text-slate-600">
              <CuisineIcon cuisine={c} size={13} className="text-slate-500" />
              {CUISINE_META[c].label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
