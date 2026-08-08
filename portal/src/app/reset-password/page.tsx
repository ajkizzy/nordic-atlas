'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    if (password.length < 12) {
      setError('Use at least 12 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setPassword('');
    setConfirmPassword('');
    setMessage('Password updated. You can continue to the portal.');
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-7 text-center">
          <Image src="/naportal-icon-256.png" alt="NAPortal" width={64} height={64} className="mx-auto h-16 w-16" priority />
          <p className="mt-2 text-sm font-semibold text-brand-800">NAPortal</p>
          <h1 className="mt-4 text-2xl font-semibold text-slate-950">Choose a new password</h1>
        </div>
        <form onSubmit={updatePassword} className="space-y-4">
          <PasswordField id="new-password" label="New password" value={password} onChange={setPassword} visible={showPassword} />
          <PasswordField id="confirm-password" label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} visible={showPassword} />
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
            <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-brand-700" />
            Show passwords
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          <Button type="submit" loading={saving} className="w-full">Update password</Button>
        </form>
        {message && <Link href="/dashboard" className="mt-4 block text-center text-sm font-semibold text-brand-800 hover:underline">Continue to portal</Link>}
      </div>
    </main>
  );
}

function PasswordField({ id, label, value, onChange, visible }: { id: string; label: string; value: string; onChange: (value: string) => void; visible: boolean }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input id={id} type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} autoComplete="new-password" minLength={12} required className="pr-10" />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400">
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </span>
      </div>
    </div>
  );
}
