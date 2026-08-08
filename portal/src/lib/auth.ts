import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile, UserRole } from '@/types/db';
import { MODULE_ACCESS } from '@/types/db';

/** Fetch the signed-in user's profile (server-side). Redirects to /login if unauthenticated. */
export async function requireProfile(): Promise<Profile & { email: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile) redirect('/login');
  return { ...(profile as Profile), email: user.email ?? '' };
}

/** Server-side module gate. RLS is the real enforcement; this prevents rendering. */
export async function requireModule(module: 'crm' | 'inventory' | 'admin'): Promise<Profile> {
  const profile = await requireProfile();
  if (!MODULE_ACCESS[profile.role][module]) redirect('/dashboard');
  return profile;
}

export function roleLabel(role: UserRole) {
  return { owner: 'Owner', sales: 'Sales Rep', warehouse: 'Warehouse' }[role];
}
