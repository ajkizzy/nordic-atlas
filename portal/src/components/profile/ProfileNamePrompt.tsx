'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';

export function ProfileNamePrompt({ profileId, email }: { profileId: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fullName = name.trim();
    if (!fullName) return;

    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profileId)
      .select('full_name')
      .single();

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-slate-950/45 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="profile-name-title" className="w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <Image src="/nordic-atlas-logo.png" alt="" width={40} height={40} className="h-10 w-10" />
          <div>
            <h2 id="profile-name-title" className="text-lg font-semibold text-slate-900">Add your name</h2>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              autoFocus
              required
              maxLength={80}
              placeholder="Your name"
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <Button type="submit" loading={saving} disabled={!name.trim()} className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
