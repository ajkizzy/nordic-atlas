-- ============================================================
-- Nordic Atlas Portal — core schema + Row Level Security
-- Apply with: supabase db push   (after schema approval)
-- ============================================================

-- ---------- Enums ----------
create type public.user_role as enum ('owner', 'sales', 'warehouse');
create type public.lead_category as enum ('restaurant', 'market', 'retail', 'cafe', 'other');
create type public.lead_status as enum ('new', 'contacted', 'negotiating', 'won', 'lost');
create type public.lead_source as enum ('manual', 'cvr', 'google_places', 'wolt');
create type public.asset_kind as enum ('mockup', 'contract', 'document');

-- ---------- Profiles (1:1 with auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'sales',
  created_at timestamptz not null default now()
);

-- Auto-create a profile on signup. Role defaults to 'sales';
-- the Owner promotes users from the admin screen (or SQL editor).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Role helper (security definer avoids RLS recursion) ----------
create or replace function public.get_my_role()
returns public.user_role
language sql
security definer set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------- Clients ----------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_number text,                      -- Danish CVR number
  contact_name text,
  email text,
  phone text,
  address text,
  city text,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Leads (map nodes) ----------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category public.lead_category not null default 'other',
  lat double precision not null,
  lng double precision not null,
  address text,
  city text,
  status public.lead_status not null default 'new',
  color text,                           -- custom hex override, e.g. '#e11d48'
  client_id uuid references public.clients (id) on delete set null,
  source public.lead_source not null default 'manual',
  assigned_to uuid references public.profiles (id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_category_idx on public.leads (category);
create index leads_status_idx on public.leads (status);

-- ---------- Client assets (files live in Storage; this is metadata) ----------
create table public.client_assets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  file_path text not null,              -- path inside 'client-assets' bucket
  file_name text not null,
  file_type text,
  kind public.asset_kind not null default 'document',
  uploaded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ---------- Inventory ----------
create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category text,
  stock_qty integer not null default 0 check (stock_qty >= 0),
  unit text not null default 'pcs',
  low_stock_threshold integer not null default 0,
  unit_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Sales log ----------
create table public.sales (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.inventory_items (id),
  client_id uuid references public.clients (id) on delete set null,
  qty integer not null check (qty > 0),
  unit_price_at_sale numeric(12,2) not null,
  total numeric(12,2) generated always as (qty * unit_price_at_sale) stored,
  sold_by uuid references public.profiles (id),
  sold_at timestamptz not null default now(),
  note text
);

-- Atomic "log sale + decrement stock" to prevent race conditions
create or replace function public.log_sale(
  p_item_id uuid,
  p_qty integer,
  p_client_id uuid default null,
  p_note text default null
)
returns uuid
language plpgsql
security invoker  -- RLS still applies: only owner/warehouse can touch these tables
as $$
declare
  v_price numeric(12,2);
  v_sale_id uuid;
begin
  update public.inventory_items
     set stock_qty = stock_qty - p_qty, updated_at = now()
   where id = p_item_id and stock_qty >= p_qty
   returning unit_price into v_price;

  if not found then
    raise exception 'Insufficient stock or unknown item';
  end if;

  insert into public.sales (item_id, client_id, qty, unit_price_at_sale, sold_by, note)
  values (p_item_id, p_client_id, p_qty, v_price, auth.uid(), p_note)
  returning id into v_sale_id;

  return v_sale_id;
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
--   owner     → everything
--   sales     → CRM (clients, leads, assets); NO inventory/sales/financials
--   warehouse → inventory + sales log only; NO CRM
-- ============================================================
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.leads enable row level security;
alter table public.client_assets enable row level security;
alter table public.inventory_items enable row level security;
alter table public.sales enable row level security;

-- profiles: everyone reads own row; owner reads/updates all
create policy "profiles: read own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles: owner reads all" on public.profiles
  for select using (public.get_my_role() = 'owner');
create policy "profiles: owner updates roles" on public.profiles
  for update using (public.get_my_role() = 'owner');
create policy "profiles: update own name" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles p where p.id = auth.uid()));

-- clients / leads / client_assets: owner + sales
create policy "clients: crm roles all" on public.clients
  for all using (public.get_my_role() in ('owner', 'sales'))
  with check (public.get_my_role() in ('owner', 'sales'));

create policy "leads: crm roles all" on public.leads
  for all using (public.get_my_role() in ('owner', 'sales'))
  with check (public.get_my_role() in ('owner', 'sales'));

create policy "client_assets: crm roles all" on public.client_assets
  for all using (public.get_my_role() in ('owner', 'sales'))
  with check (public.get_my_role() in ('owner', 'sales'));

-- inventory / sales: owner + warehouse (sales reps are DENIED at the DB —
-- financial metrics derived from `sales` are therefore unreachable for them)
create policy "inventory: ops roles all" on public.inventory_items
  for all using (public.get_my_role() in ('owner', 'warehouse'))
  with check (public.get_my_role() in ('owner', 'warehouse'));

create policy "sales: ops roles all" on public.sales
  for all using (public.get_my_role() in ('owner', 'warehouse'))
  with check (public.get_my_role() in ('owner', 'warehouse'));

-- updated_at maintenance
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger clients_touch before update on public.clients
  for each row execute function public.touch_updated_at();
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();
create trigger inventory_touch before update on public.inventory_items
  for each row execute function public.touch_updated_at();
