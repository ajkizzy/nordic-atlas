'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import { signIn } from './actions';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-black p-4">
      <Image
        src="/login-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div className="w-full max-w-sm rounded-lg border border-white/30 bg-white p-8 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Image src="/nordic-atlas-logo.png" alt="Nordic Atlas" width={40} height={40} className="h-10 w-10" priority />
          <h1 className="text-lg leading-tight">NAPortal</h1>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@nordicatlaspackaging.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}
          <Button type="submit" loading={pending} className="w-full">
            Sign in
          </Button>
        </form>
        <p className="text-xs text-slate-400 mt-4">
          Accounts are provisioned by the Owner. Contact admin if you need access.
        </p>
      </div>
    </main>
  );
}
