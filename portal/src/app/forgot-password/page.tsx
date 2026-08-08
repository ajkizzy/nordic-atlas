'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function sendReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage(null);
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });

    setSending(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMessage('If that account exists, a password reset link is on its way.');
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-7 text-center">
          <Image src="/naportal-icon.png" alt="NAPortal" width={64} height={64} className="mx-auto h-16 w-16" priority />
          <p className="mt-2 text-sm font-semibold text-brand-800">NAPortal</p>
          <h1 className="mt-4 text-2xl font-semibold text-slate-950">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-500">We will email you a secure reset link.</p>
        </div>
        <form onSubmit={sendReset} className="space-y-4">
          <div>
            <Label htmlFor="recovery-email">Email</Label>
            <Input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          <Button type="submit" loading={sending} className="w-full">Send reset link</Button>
        </form>
        <Link href="/login" className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </div>
    </main>
  );
}
