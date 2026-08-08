import type { CookieOptions } from '@supabase/ssr';

export function sessionCookieOptions(options: CookieOptions, remember: boolean): CookieOptions {
  if (remember) return options;
  const { expires: _expires, maxAge: _maxAge, ...sessionOnly } = options;
  return sessionOnly;
}
