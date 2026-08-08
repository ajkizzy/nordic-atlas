'use client';

import { useActionState, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from './actions';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white p-4 sm:p-8">
      <section className="relative flex w-full max-w-sm items-center justify-center sm:h-[min(640px,calc(100dvh-4rem))] sm:min-h-[580px] sm:w-[min(92vw,1280px)] sm:max-w-[1280px] sm:justify-start sm:overflow-hidden sm:rounded-lg sm:border sm:border-slate-200 sm:shadow-xl">
        <Image
          src="/login-banner.png"
          alt=""
          fill
          priority
          sizes="(min-width: 640px) 92vw, 0px"
          className="hidden object-cover object-center sm:block"
        />

        <div className="relative z-10 w-full rounded-lg border border-slate-200 bg-white p-7 shadow-xl sm:ml-[4%] sm:w-[390px] sm:border-white/70 sm:bg-white/55 sm:p-9 sm:shadow-2xl sm:backdrop-blur-2xl">
          <div className="mb-7 text-center">
            <Image
              src="/naportal-icon-256.png"
              alt="NAPortal"
              width={84}
              height={84}
              className="mx-auto h-[84px] w-[84px]"
              priority
            />
            <p className="mt-2 text-sm font-semibold text-brand-800">NAPortal</p>
            <h1 className="mt-4 text-2xl font-semibold text-slate-950">Welcome back!</h1>
          </div>

          <form action={action} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@nordicatlaspackaging.com"
                className="bg-white/75"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="bg-white/75 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 transition-colors hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/40"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-xs">
              <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-600">
                <input
                  name="remember"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-300 accent-brand-700"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="font-semibold text-brand-800 hover:text-brand-950 hover:underline">
                Forgot password?
              </Link>
            </div>

            {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}
            <Button type="submit" loading={pending} className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Accounts are provisioned by the Owner.
          </p>
        </div>
      </section>
    </main>
  );
}
