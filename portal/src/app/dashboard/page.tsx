import { requireProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { TrendingUp, Users, Map, Boxes, AlertTriangle } from 'lucide-react';
import { MODULE_ACCESS } from '@/types/db';
import { BagSalesTicker } from '@/components/dashboard/BagSalesTicker';

const dkk = new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 });

function Stat({ label, value, icon: Icon, accent }: { label: string; value: string; icon: React.ElementType; accent?: boolean }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <span className={`h-11 w-11 rounded-lg flex items-center justify-center ${accent ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-700'}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-heading font-medium text-slate-900">{value}</p>
      </div>
    </Card>
  );
}

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const isOwner = profile.role === 'owner';
  const canCrm = isOwner || profile.role === 'sales';
  const canInventory = MODULE_ACCESS[profile.role].inventory;
  const canViewRevenue = canCrm;

  // Everything below is *also* enforced by RLS — a tampered client with a
  // sales-rep session gets zero rows from `sales` no matter what it requests.
  const [leadsRes, clientsRes, invRes, salesRes] = await Promise.all([
    canCrm ? supabase.from('leads').select('id, status', { count: 'exact' }) : Promise.resolve(null),
    canCrm ? supabase.from('clients').select('id', { count: 'exact', head: true }) : Promise.resolve(null),
    canInventory ? supabase.from('inventory_items').select('id, stock_qty, low_stock_threshold') : Promise.resolve(null),
    canViewRevenue ? supabase.from('sales').select('qty, total, sold_at') : Promise.resolve(null),
  ]);

  const wonLeads = leadsRes?.data?.filter((l) => l.status === 'won').length ?? 0;
  const lowStock = invRes?.data?.filter((i) => i.stock_qty <= i.low_stock_threshold) ?? [];

  // Financial metrics — computed only when the Owner's session fetched rows.
  let revenue30d = 0;
  let revenueTotal = 0;
  let bagsSold = 0;
  if (canViewRevenue && salesRes?.data) {
    const cutoff = Date.now() - 30 * 24 * 3600 * 1000;
    for (const s of salesRes.data) {
      bagsSold += Number(s.qty);
      revenueTotal += Number(s.total);
      if (new Date(s.sold_at).getTime() >= cutoff) revenue30d += Number(s.total);
    }
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl mb-1">Overview</h1>
      <p className="text-sm text-slate-500 mb-6">
        Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}.
      </p>

      {canViewRevenue && <BagSalesTicker total={bagsSold} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {canCrm && (
          <>
            <Stat label="Active leads" value={String(leadsRes?.count ?? 0)} icon={Map} />
            <Stat label="Won leads" value={String(wonLeads)} icon={TrendingUp} />
            <Stat label="Clients" value={String(clientsRes?.count ?? 0)} icon={Users} />
          </>
        )}
        {canInventory && <Stat label="Low stock items" value={String(lowStock.length)} icon={Boxes} />}
        {canViewRevenue && (
          <>
            <Stat label="My revenue (30 days)" value={dkk.format(revenue30d)} icon={TrendingUp} accent />
            <Stat label="My revenue (all time)" value={dkk.format(revenueTotal)} icon={TrendingUp} accent />
          </>
        )}
      </div>

      {canInventory && lowStock.length > 0 && (
        <Card className="mt-6 p-5 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
            <AlertTriangle size={16} />
            {lowStock.length} item{lowStock.length > 1 ? 's' : ''} at or below low-stock threshold — check Sales &amp; Inventory.
          </div>
        </Card>
      )}
    </div>
  );
}
