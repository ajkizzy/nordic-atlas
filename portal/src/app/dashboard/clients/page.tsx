import Link from 'next/link';
import { requireModule } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { NewClientButton } from '@/components/clients/NewClientButton';
import type { Client } from '@/types/db';

export default async function ClientsPage() {
  await requireModule('crm');
  const supabase = await createClient();
  const { data } = await supabase.from('clients').select('*').order('name');
  const clients = (data ?? []) as Client[];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Clients</h1>
        <NewClientButton />
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-500 bg-slate-50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 hidden sm:table-cell">CVR</th>
              <th className="px-4 py-3 hidden md:table-cell">Contact</th>
              <th className="px-4 py-3 hidden sm:table-cell">City</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/clients/${c.id}`} className="font-medium text-brand-800 hover:underline">
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">{c.org_number ?? '—'}</td>
                <td className="px-4 py-3 hidden md:table-cell">{c.contact_name ?? '—'}</td>
                <td className="px-4 py-3 hidden sm:table-cell">{c.city ?? '—'}</td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-400">No clients yet. Create the first one.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
