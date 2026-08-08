alter table public.leads
  add column if not exists email text;

comment on column public.leads.email is
  'User-maintained contact email for this lead; unrelated to portal authentication.';
