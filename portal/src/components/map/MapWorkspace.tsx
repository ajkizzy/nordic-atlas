'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import type { BagPotential, Cuisine, Lead, LeadCategory, LeadStatus } from '@/types/db';
import { CATEGORY_LABELS, STATUS_COLORS } from '@/types/db';
import { CUISINE_META, CUISINE_ORDER } from '@/lib/cuisine';
import { CuisineIcon } from './CuisineIcon';
import { MapLegend } from './MapLegend';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { AlertTriangle, Check, ChevronDown, List, Map as MapIcon, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react';

// Leaflet touches `window` — must skip SSR.
const LeadMap = dynamic(() => import('./LeadMap'), {
  ssr: false,
  loading: () => <div className="h-full grid place-items-center text-sm text-slate-400">Loading map…</div>,
});

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as LeadCategory[];
const ALL_STATUSES = Object.keys(STATUS_COLORS) as LeadStatus[];
const SWATCHES = ['', '#e11d48', '#f59e0b', '#3b82f6', '#8b5cf6', '#14b8a6', '#257244', '#64748b'];

type Draft = Partial<Lead> & { lat: number; lng: number };

export function MapWorkspace({ initialLeads }: { initialLeads: Lead[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [leads, setLeads] = useState(initialLeads);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [activeCats, setActiveCats] = useState<Set<LeadCategory>>(new Set(ALL_CATEGORIES));
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCuisines, setActiveCuisines] = useState<Set<Cuisine>>(new Set(CUISINE_ORDER));
  const [bagFilter, setBagFilter] = useState<BagPotential | 'all'>('all');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusSavingId, setStatusSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Lead | null>(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState<Lead | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel('organization-leads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const id = (payload.old as Pick<Lead, 'id'>).id;
            setLeads((current) => current.filter((lead) => lead.id !== id));
            setSelected((current) => current?.id === id ? null : current);
            return;
          }

          const changed = payload.new as Lead;
          setLeads((current) => {
            const exists = current.some((lead) => lead.id === changed.id);
            return exists
              ? current.map((lead) => lead.id === changed.id ? changed : lead)
              : [...current, changed];
          });
          setSelected((current) => current?.id === changed.id ? changed : current);
        }
      )
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [supabase]);

  useEffect(() => () => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }, []);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('da-DK');
    return leads.filter((lead) => {
      const matchesSearch = !query || [
        lead.name,
        lead.address,
        lead.city,
        lead.phone,
        lead.email,
      ].some((value) => value?.toLocaleLowerCase('da-DK').includes(query));

      return matchesSearch &&
        activeCats.has(lead.category) &&
        activeCuisines.has(lead.cuisine) &&
        (bagFilter === 'all' || lead.bag_potential === bagFilter) &&
        (statusFilter === 'all' || lead.status === statusFilter);
    });
  }, [leads, searchQuery, activeCats, activeCuisines, bagFilter, statusFilter]);

  function toggleCuisine(c: Cuisine) {
    setActiveCuisines((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function toggleCat(cat: LeadCategory) {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  async function saveLead(patch: Partial<Lead>, id?: string) {
    setSaving(true);
    setError(null);
    if (id) {
      const { data, error } = await supabase.from('leads').update(patch).eq('id', id).select().single();
      if (error) setError(error.message);
      else {
        setLeads((ls) => ls.map((l) => (l.id === id ? (data as Lead) : l)));
        setSelected(data as Lead);
      }
    } else {
      const { data, error } = await supabase.from('leads').insert(patch).select().single();
      if (error) setError(error.message);
      else {
        setLeads((ls) => [...ls, data as Lead]);
        setDraft(null);
        setSelected(data as Lead);
      }
    }
    setSaving(false);
  }

  async function updateLeadStatus(lead: Lead, status: LeadStatus) {
    if (lead.status === status || statusSavingId === lead.id) return;
    const previousStatus = lead.status;
    setStatusSavingId(lead.id);
    setError(null);
    setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, status } : item));
    setSelected((current) => current?.id === lead.id ? { ...current, status } : current);

    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', lead.id)
      .select()
      .single();

    if (error) {
      setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, status: previousStatus } : item));
      setSelected((current) => current?.id === lead.id ? { ...current, status: previousStatus } : current);
      setError(`Could not update ${lead.name}: ${error.message}`);
    } else {
      const updated = data as Lead;
      setLeads((current) => current.map((item) => item.id === lead.id ? updated : item));
      setSelected((current) => current?.id === lead.id ? updated : current);
    }
    setStatusSavingId(null);
  }

  async function confirmDeleteLead() {
    if (!deleteCandidate) return;
    const lead = deleteCandidate;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from('leads').delete().eq('id', lead.id);
    setSaving(false);
    if (error) {
      setError(error.message);
      setDeleteCandidate(null);
      return;
    }

    setLeads((current) => current.filter((item) => item.id !== lead.id));
    setSelected(null);
    setDraft(null);
    setDeleteCandidate(null);
    setRecentlyDeleted(lead);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setRecentlyDeleted(null), 10_000);
  }

  async function undoDeleteLead() {
    if (!recentlyDeleted) return;
    const lead = recentlyDeleted;
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setRecentlyDeleted(null);
    const { data, error } = await supabase.from('leads').insert(lead).select().single();
    if (error) {
      setError(`Could not restore ${lead.name}: ${error.message}`);
      return;
    }
    const restored = data as Lead;
    setLeads((current) => current.some((item) => item.id === restored.id)
      ? current.map((item) => item.id === restored.id ? restored : item)
      : [...current, restored]);
  }

  const editorTarget = draft ?? selected;

  return (
    <div className="flex flex-col gap-4 h-[calc(100dvh-8rem)] md:h-[calc(100dvh-6rem)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border border-slate-200 overflow-hidden">
          {(['map', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold',
                view === v ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              )}
            >
              {v === 'map' ? <MapIcon size={15} /> : <List size={15} />}
              {v === 'map' ? 'Map' : 'List'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCat(cat)}
              className={cn(
                'rounded-pill px-3 py-1 text-xs font-semibold border transition-colors',
                activeCats.has(cat)
                  ? 'bg-brand-50 border-brand-300 text-brand-800'
                  : 'bg-white border-slate-200 text-slate-400'
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="relative ml-auto w-full sm:w-56 lg:w-64">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search leads"
            aria-label="Search leads"
            className="h-9 pl-9 pr-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-slate-400 hover:text-slate-700"
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <Select
          value={bagFilter}
          onChange={(e) => setBagFilter(e.target.value as BagPotential | 'all')}
          className="w-auto"
        >
          <option value="all">All bag potential</option>
          <option value="high">High bag use</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')} className="w-auto">
          <option value="all">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Button size="sm" onClick={() => { setSelected(null); setDraft({ lat: 55.641, lng: 12.080, category: 'restaurant', cuisine: 'other', status: 'new' }); }}>
          <Plus size={14} /> New lead
        </Button>
      </div>

      {/* Cuisine toggles — glyph matches the map pin */}
      <div className="flex flex-wrap items-center gap-1.5 -mt-1">
        {CUISINE_ORDER.map((c) => (
          <button
            key={c}
            onClick={() => toggleCuisine(c)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold border transition-colors',
              activeCuisines.has(c)
                ? 'bg-white border-slate-300 text-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-300'
            )}
          >
            <CuisineIcon cuisine={c} size={13} />
            {CUISINE_META[c].label}
          </button>
        ))}
        <button
          onClick={() => setActiveCuisines(new Set(activeCuisines.size === CUISINE_ORDER.length ? [] : CUISINE_ORDER))}
          className="text-xs text-slate-400 hover:text-slate-700 underline ml-1"
        >
          {activeCuisines.size === CUISINE_ORDER.length ? 'none' : 'all'}
        </button>
      </div>

      <p className="text-xs text-slate-400 -mt-1">
        {view === 'map' ? 'Tip: click anywhere on the map to drop a new lead at that spot.' : `${filtered.length} leads`}
      </p>

      <div className="flex flex-1 gap-4 min-h-0">
        {/* Map or list */}
        <div className="flex-1 min-w-0">
          {view === 'map' ? (
            <Card className="h-full overflow-hidden relative">
              <div className="absolute right-3 bottom-6 z-[500] max-w-[15rem] hidden md:block">
                <MapLegend />
              </div>
              <LeadMap
                leads={filtered}
                selectedId={selected?.id ?? null}
                onSelect={(l) => { setDraft(null); setSelected(l); }}
                onMapClick={(lat, lng) => {
                  setSelected(null);
                  setDraft({ lat, lng, category: 'restaurant', cuisine: 'other', status: 'new' });
                }}
              />
            </Card>
          ) : (
            <Card className="h-full overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Cuisine</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => { setDraft(null); setSelected(l); }}
                      className={cn('border-t border-slate-100 cursor-pointer hover:bg-slate-50', selected?.id === l.id && 'bg-brand-50/60')}
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-900">{l.name}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <CuisineIcon cuisine={l.cuisine} size={14} className="text-slate-400" />
                          {CUISINE_META[l.cuisine].label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">{l.city ?? '—'}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {l.phone ? (
                          <a
                            href={`tel:${l.phone.replace(/[^+\d]/g, '')}`}
                            onClick={(event) => event.stopPropagation()}
                            className="font-medium text-brand-700 hover:underline"
                          >
                            {l.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">No phone</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5" onClick={(event) => event.stopPropagation()}>
                        <InlineStatusPicker
                          lead={l}
                          disabled={statusSavingId === l.id}
                          onChange={(status) => updateLeadStatus(l, status)}
                        />
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No leads match the current filters.</td></tr>
                  )}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        {/* Editor panel */}
        {editorTarget && (
          <Card className="w-80 shrink-0 overflow-auto hidden lg:block">
            <LeadEditor
              key={selected?.id ?? 'new'}
              lead={editorTarget}
              isNew={!!draft}
              saving={saving}
              error={error}
              onClose={() => { setSelected(null); setDraft(null); setError(null); }}
              onSave={(patch) => saveLead(patch, selected?.id)}
              onDelete={selected ? () => setDeleteCandidate(selected) : undefined}
            />
          </Card>
        )}
      </div>

      {/* Mobile editor (bottom sheet style) */}
      {editorTarget && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 max-h-[70dvh] overflow-auto bg-white border-t border-slate-200 rounded-t-2xl shadow-2xl">
          <LeadEditor
            key={(selected?.id ?? 'new') + '-m'}
            lead={editorTarget}
            isNew={!!draft}
            saving={saving}
            error={error}
            onClose={() => { setSelected(null); setDraft(null); setError(null); }}
            onSave={(patch) => saveLead(patch, selected?.id)}
            onDelete={selected ? () => setDeleteCandidate(selected) : undefined}
          />
        </div>
      )}

      {deleteCandidate && (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-slate-950/45 p-4" onClick={() => setDeleteCandidate(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-lead-title"
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
                <AlertTriangle size={18} />
              </span>
              <div>
                <h3 id="delete-lead-title" className="text-base font-semibold text-slate-900">Delete {deleteCandidate.name}?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  This removes the lead from the shared organization map. You can undo for 10 seconds afterward.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteCandidate(null)}>Cancel</Button>
              <Button variant="danger" loading={saving} onClick={confirmDeleteLead}>
                <Trash2 size={15} /> Delete lead
              </Button>
            </div>
          </div>
        </div>
      )}

      {recentlyDeleted && (
        <div className="fixed bottom-5 left-1/2 z-[1000] flex w-[min(92vw,26rem)] -translate-x-1/2 items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-white shadow-2xl">
          <p className="min-w-0 flex-1 truncate text-sm"><span className="font-semibold">{recentlyDeleted.name}</span> deleted</p>
          <button
            type="button"
            onClick={undoDeleteLead}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-emerald-300 hover:bg-white/10"
          >
            <RotateCcw size={15} /> Undo
          </button>
          <button type="button" onClick={() => setRecentlyDeleted(null)} className="grid h-9 w-9 place-items-center text-slate-300 hover:text-white" aria-label="Dismiss undo">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function LeadEditor({
  lead, isNew, saving, error, onClose, onSave, onDelete,
}: {
  lead: Draft;
  isNew: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (patch: Partial<Lead>) => void;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState({
    name: lead.name ?? '',
    category: (lead.category ?? 'restaurant') as LeadCategory,
    cuisine: (lead.cuisine ?? 'other') as Cuisine,
    bag_potential: (lead.bag_potential ?? 'medium') as BagPotential,
    phone: lead.phone ?? '',
    email: lead.email ?? '',
    status: (lead.status ?? 'new') as LeadStatus,
    color: lead.color ?? '',
    address: lead.address ?? '',
    city: lead.city ?? '',
    notes: lead.notes ?? '',
  });

  return (
    <div className="p-5 space-y-4">
      <div className="sticky top-0 z-20 -mx-5 -mt-5 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
        <h3 className="text-base">{isNew ? 'New lead' : 'Edit lead'}</h3>
        <button
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>
      <p className="text-xs text-slate-400">
        {lead.lat.toFixed(4)}, {lead.lng.toFixed(4)}
      </p>

      <div>
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Café Norden" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Category</Label>
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as LeadCategory })}>
            {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      <div>
        <Label>Takeaway bag potential</Label>
        <Select
          value={form.bag_potential}
          onChange={(e) => setForm({ ...form, bag_potential: e.target.value as BagPotential })}
        >
          <option value="high">High — bag on nearly every order</option>
          <option value="medium">Medium — dine-in led</option>
          <option value="low">Low — little bagged output</option>
        </Select>
      </div>

      <div>
        <Label>Node colour (overrides status colour)</Label>
        <div className="flex flex-wrap gap-2">
          {SWATCHES.map((c) => (
            <button
              key={c || 'auto'}
              onClick={() => setForm({ ...form, color: c })}
              className={cn(
                'h-7 w-7 rounded-full border-2',
                form.color === c ? 'border-slate-900' : 'border-transparent'
              )}
              style={{ backgroundColor: c || STATUS_COLORS[form.status] }}
              title={c || 'Auto (status colour)'}
            >
              {!c && <span className="text-[9px] text-white font-bold">A</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Address</Label>
        <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>City</Label>
          <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Roskilde" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+45 …" />
        </div>
      </div>
      <div>
        <Label>E-Mail</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="contact@example.com"
        />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex gap-2 pt-1">
        <Button
          loading={saving}
          disabled={!form.name.trim()}
          onClick={() =>
            onSave({
              ...form,
              color: form.color || null,
              phone: form.phone || null,
              email: form.email || null,
              lat: lead.lat,
              lng: lead.lng,
              ...(isNew ? { source: 'manual' as const } : {}),
            })
          }
        >
          {isNew ? 'Create lead' : 'Save changes'}
        </Button>
        {onDelete && (
          <Button variant="danger" onClick={onDelete}><Trash2 size={15} /> Delete</Button>
        )}
      </div>
    </div>
  );
}

function InlineStatusPicker({
  lead, disabled, onChange,
}: {
  lead: Lead;
  disabled: boolean;
  onChange: (status: LeadStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-8 min-w-32 items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold capitalize text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change status for ${lead.name}. Current status: ${lead.status}`}
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: STATUS_COLORS[lead.status] }} />
        <span className="flex-1 text-left">{lead.status}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={`Status for ${lead.name}`}
          className="absolute right-0 z-30 mt-1 w-40 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg"
        >
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              role="option"
              aria-selected={lead.status === status}
              onClick={() => {
                setOpen(false);
                onChange(status);
              }}
              className="flex h-9 w-full items-center gap-2 px-3 text-left text-sm capitalize text-slate-700 hover:bg-slate-50"
            >
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} />
              <span className="flex-1">{status}</span>
              {lead.status === status && <Check size={14} className="text-brand-700" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
