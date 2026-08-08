'use client';

import { useActionState } from 'react';
import { signIn } from './actions';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Package } from 'lucide-react';

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <main className="min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="h-10 w-10 rounded-lg bg-brand-700 text-white flex items-center justify-center">
            <Package size={20} />
          </span>
          <div>
            <h1 className="text-lg leading-tight">Nordic Atlas</h1>
            <p className="text-xs text-slate-500">Internal Portal</p>
          </div>
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
