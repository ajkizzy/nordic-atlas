import { requireModule } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { InventoryWorkspace } from '@/components/inventory/InventoryWorkspace';
import type { InventoryItem, Sale } from '@/types/db';

export default async function InventoryPage() {
  const profile = await requireModule('inventory'); // sales reps redirected; RLS blocks data anyway
  const supabase = await createClient();

  const [{ data: items }, { data: sales }] = await Promise.all([
    supabase.from('inventory_items').select('*').order('name'),
    supabase.from('sales').select('*').order('sold_at', { ascending: false }).limit(30),
  ]);

  return (
    <InventoryWorkspace
      initialItems={(items ?? []) as InventoryItem[]}
      initialSales={(sales ?? []) as Sale[]}
      canManageInventory={profile.role === 'owner' || profile.role === 'warehouse'}
      showRevenue={profile.role === 'owner' || profile.role === 'sales'}
    />
  );
}
