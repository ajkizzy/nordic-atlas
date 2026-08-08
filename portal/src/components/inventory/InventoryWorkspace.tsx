'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { InventoryItem, Sale } from '@/types/db';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Label } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { Minus, Plus, ShoppingCart, PackagePlus, X } from 'lucide-react';

const dkk = new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' });

export function InventoryWorkspace({
  initialItems,
  initialSales,
  canManageInventory,
  showRevenue,
}: {
  initialItems: InventoryItem[];
  initialSales: Sale[];
  canManageInventory: boolean;
  showRevenue: boolean;
}) {
  const supabase = createClient();
  const [items, setItems] = useState(initialItems);
  const [sales, setSales] = useState(initialSales);
  const [tab, setTab] = useState<'stock' | 'sales'>('stock');
  const [saleItem, setSaleItem] = useState<InventoryItem | null>(null);
  const [showNewItem, setShowNewItem] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Big-target +/- adjusters: the primary warehouse interaction on mobile.
  async function adjustStock(item: InventoryItem, delta: number) {
    const next = Math.max(0, item.stock_qty + delta);
    setItems((xs) => xs.map((x) => (x.id === item.id ? { ...x, stock_qty: next } : x))); // optimistic
    const { error } = await supabase.from('inventory_items').update({ stock_qty: next }).eq('id', item.id);
    if (error) {
      setError(error.message);
      setItems((xs) => xs.map((x) => (x.id === item.id ? item : x))); // rollback
    }
  }

  async function logSale(item: InventoryItem, qty: number, note: string) {
    setError(null);
    const { data, error } = await supabase.rpc('log_sale', { p_item_id: item.id, p_qty: qty, p_note: note || null });
    if (error) return setError(error.message);
    setItems((xs) => xs.map((x) => (x.id === item.id ? { ...x, stock_qty: x.stock_qty - qty } : x)));
    setSales((s) => [
      { id: data as string, item_id: item.id, client_id: null, qty, unit_price_at_sale: item.unit_price, total: qty * item.unit_price, sold_by: null, sold_at: new Date().toISOString(), note },
      ...s,
    ]);
    setSaleItem(null);
  }

  async function createItem(form: { sku: string; name: string; category: string; stock_qty: number; unit: string; unit_price: number; low_stock_threshold: number }) {
    setError(null);
    const { data, error } = await supabase.from('inventory_items').insert(form).select().single();
    if (error) return setError(error.message);
    setItems((xs) => [...xs, data as InventoryItem].sort((a, b) => a.name.localeCompare(b.name)));
    setShowNewItem(false);
  }

  const itemName = (id: string) => items.find((i) => i.id === id)?.name ?? '—';

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Sales &amp; Inventory</h1>
        {canManageInventory && (
          <Button size="sm" onClick={() => setShowNewItem(true)}><PackagePlus size={14} /> New item</Button>
        )}
      </div>

      {/* Mobile-friendly tab switch */}
      <div className="flex rounded-md border border-slate-200 overflow-hidden mb-4 w-fit">
        {(['stock', 'sales'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn('px-5 py-2 text-sm font-semibold', tab === t ? 'bg-brand-700 text-white' : 'bg-white text-slate-600')}
          >
            {t === 'stock' ? 'Stock' : 'My sales'}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-rose-600 mb-3">{error}</p>}

      {tab === 'stock' ? (
        <div className="space-y-3">
          {items.map((item) => {
            const low = item.stock_qty <= item.low_stock_threshold;
            return (
              <Card key={item.id} className={cn('p-4', low && 'border-amber-300 bg-amber-50/50')}>
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.sku} · {dkk.format(item.unit_price)}/{item.unit}
                      {low && <span className="text-amber-700 font-semibold"> · LOW STOCK</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {canManageInventory && (
                      <button
                        onClick={() => adjustStock(item, -1)}
                        className="h-11 w-11 rounded-lg border border-slate-300 grid place-items-center text-slate-700 active:bg-slate-100"
                        aria-label="Decrease stock"
                      >
                        <Minus size={18} />
                      </button>
                    )}
                    <span className="w-14 text-center text-lg font-heading font-medium text-slate-900 tabular-nums">
                      {item.stock_qty}
                    </span>
                    {canManageInventory && (
                      <button
                        onClick={() => adjustStock(item, 1)}
                        className="h-11 w-11 rounded-lg border border-slate-300 grid place-items-center text-slate-700 active:bg-slate-100"
                        aria-label="Increase stock"
                      >
                        <Plus size={18} />
                      </button>
                    )}
                    <Button size="sm" variant="outline" className="h-11" onClick={() => setSaleItem(item)}>
                      <ShoppingCart size={14} /> <span className="hidden sm:inline">Sell</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
          {items.length === 0 && (
            <Card className="p-10 text-center text-sm text-slate-400">No inventory items yet.</Card>
          )}
        </div>
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-slate-500 bg-slate-50">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Qty</th>
                {showRevenue && <th className="px-4 py-3">Total</th>}
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-medium text-slate-900">{itemName(s.item_id)}</td>
                  <td className="px-4 py-2.5">{s.qty}</td>
                  {showRevenue && <td className="px-4 py-2.5">{dkk.format(Number(s.total))}</td>}
                  <td className="px-4 py-2.5 text-slate-500">{new Date(s.sold_at).toLocaleString('da-DK')}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr><td colSpan={showRevenue ? 4 : 3} className="px-4 py-8 text-center text-slate-400">No sales logged yet.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {saleItem && <SaleSheet item={saleItem} onClose={() => setSaleItem(null)} onSubmit={logSale} />}
      {showNewItem && <NewItemSheet onClose={() => setShowNewItem(false)} onSubmit={createItem} />}
    </div>
  );
}

function SaleSheet({ item, onClose, onSubmit }: { item: InventoryItem; onClose: () => void; onSubmit: (item: InventoryItem, qty: number, note: string) => void }) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  return (
    <Sheet onClose={onClose} title={`Log sale — ${item.name}`}>
      <div className="flex items-center justify-center gap-4 py-2">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-12 w-12 rounded-lg border border-slate-300 grid place-items-center"><Minus size={20} /></button>
        <span className="text-3xl font-heading font-medium w-20 text-center tabular-nums">{qty}</span>
        <button onClick={() => setQty((q) => Math.min(item.stock_qty, q + 1))} className="h-12 w-12 rounded-lg border border-slate-300 grid place-items-center"><Plus size={20} /></button>
      </div>
      <p className="text-center text-xs text-slate-400">{item.stock_qty} in stock</p>
      <div><Label>Note (optional)</Label><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Order ref, customer…" /></div>
      <Button size="lg" className="w-full" disabled={qty < 1 || qty > item.stock_qty} onClick={() => onSubmit(item, qty, note)}>
        Confirm sale
      </Button>
    </Sheet>
  );
}

function NewItemSheet({ onClose, onSubmit }: { onClose: () => void; onSubmit: (f: { sku: string; name: string; category: string; stock_qty: number; unit: string; unit_price: number; low_stock_threshold: number }) => void }) {
  const [f, setF] = useState({ sku: '', name: '', category: '', stock_qty: 0, unit: 'pcs', unit_price: 0, low_stock_threshold: 0 });
  return (
    <Sheet onClose={onClose} title="New inventory item">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>SKU *</Label><Input value={f.sku} onChange={(e) => setF({ ...f, sku: e.target.value })} /></div>
        <div><Label>Category</Label><Input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></div>
      </div>
      <div><Label>Name *</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Initial stock</Label><Input type="number" min={0} value={f.stock_qty} onChange={(e) => setF({ ...f, stock_qty: +e.target.value })} /></div>
        <div><Label>Unit</Label><Input value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} /></div>
        <div><Label>Unit price (DKK)</Label><Input type="number" min={0} step="0.01" value={f.unit_price} onChange={(e) => setF({ ...f, unit_price: +e.target.value })} /></div>
        <div><Label>Low-stock alert at</Label><Input type="number" min={0} value={f.low_stock_threshold} onChange={(e) => setF({ ...f, low_stock_threshold: +e.target.value })} /></div>
      </div>
      <Button className="w-full" disabled={!f.sku.trim() || !f.name.trim()} onClick={() => onSubmit(f)}>Create item</Button>
    </Sheet>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-end sm:items-center sm:justify-center" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 space-y-4 max-h-[85dvh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
