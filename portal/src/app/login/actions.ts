'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function signIn(_prev: { error?: string } | null, formData: FormData) {
  const remember = formData.get('remember') === 'on';
  const cookieStore = await cookies();
  cookieStore.set('nap-remember', remember ? '1' : '0', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    ...(remember ? { maxAge: 60 * 60 * 24 * 365 } : {}),
  });

  const supabase = await createClient({ remember });
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  });
  if (error) return { error: error.message };
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
