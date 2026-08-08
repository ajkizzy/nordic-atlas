import { requireModule } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { MapWorkspace } from '@/components/map/MapWorkspace';
import type { Lead } from '@/types/db';

export default async function MapPage() {
  await requireModule('crm'); // warehouse staff redirected server-side; RLS blocks data regardless
  const supabase = await createClient();
  const leads: Lead[] = [];
  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at')
      .order('id')
      .range(from, from + pageSize - 1);

    if (error) throw error;
    const page = (data ?? []) as Lead[];
    leads.push(...page);
    if (page.length < pageSize) break;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Map CRM</h1>
      <MapWorkspace initialLeads={leads} />
    </div>
  );
}
