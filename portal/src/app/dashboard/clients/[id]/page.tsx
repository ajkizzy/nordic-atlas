import { notFound } from 'next/navigation';
import { requireModule } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader } from '@/components/ui/Card';
import { AssetManager } from '@/components/clients/AssetManager';
import type { Client, ClientAsset } from '@/types/db';

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  await requireModule('crm');
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: client }, { data: assets }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase.from('client_assets').select('*').eq('client_id', id).order('created_at', { ascending: false }),
  ]);
  if (!client) notFound();
  const c = client as Client;

  const fields: Array<[string, string | null]> = [
    ['CVR number', c.org_number],
    ['Contact', c.contact_name],
    ['Email', c.email],
    ['Phone', c.phone],
    ['Address', c.address],
    ['City', c.city],
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl">{c.name}</h1>
        <p className="text-sm text-slate-500">Client since {new Date(c.created_at).toLocaleDateString('da-DK')}</p>
      </div>

      <Card>
        <CardHeader title="Details" />
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 p-5">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</dt>
              <dd className="text-sm text-slate-900 mt-0.5">{value || '—'}</dd>
            </div>
          ))}
          {c.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</dt>
              <dd className="text-sm text-slate-900 mt-0.5 whitespace-pre-wrap">{c.notes}</dd>
            </div>
          )}
        </dl>
      </Card>

      <AssetManager clientId={c.id} initialAssets={(assets ?? []) as ClientAsset[]} />
    </div>
  );
}
