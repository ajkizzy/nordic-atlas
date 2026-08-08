-- Leads are shared across CRM users. Clients, assets, and sales belong to the
-- user who created them, including for users with the owner role.

alter table public.clients
  alter column created_by set default auth.uid(),
  alter column created_by set not null;

alter table public.sales
  alter column sold_by set default auth.uid(),
  alter column sold_by set not null;

create index if not exists clients_created_by_idx on public.clients (created_by);
create index if not exists client_assets_client_id_idx on public.client_assets (client_id);
create index if not exists sales_sold_by_sold_at_idx on public.sales (sold_by, sold_at desc);
create index if not exists sales_client_id_idx on public.sales (client_id);
create index if not exists sales_item_id_idx on public.sales (item_id);

drop policy if exists "clients: crm roles all" on public.clients;
create policy "clients: users manage own"
  on public.clients for all
  to authenticated
  using (
    (select public.get_my_role()) in ('owner', 'sales')
    and created_by = (select auth.uid())
  )
  with check (
    (select public.get_my_role()) in ('owner', 'sales')
    and created_by = (select auth.uid())
  );

drop policy if exists "client_assets: crm roles all" on public.client_assets;
create policy "client_assets: users manage own client files"
  on public.client_assets for all
  to authenticated
  using (
    exists (
      select 1
      from public.clients c
      where c.id = client_assets.client_id
        and c.created_by = (select auth.uid())
    )
  )
  with check (
    uploaded_by = (select auth.uid())
    and exists (
      select 1
      from public.clients c
      where c.id = client_assets.client_id
        and c.created_by = (select auth.uid())
    )
  );

drop policy if exists "leads: crm roles all" on public.leads;
create policy "leads: organization crm access"
  on public.leads for all
  to authenticated
  using ((select public.get_my_role()) in ('owner', 'sales'))
  with check ((select public.get_my_role()) in ('owner', 'sales'));

drop policy if exists "inventory: ops roles all" on public.inventory_items;
create policy "inventory: operations manage"
  on public.inventory_items for all
  to authenticated
  using ((select public.get_my_role()) in ('owner', 'warehouse'))
  with check ((select public.get_my_role()) in ('owner', 'warehouse'));
create policy "inventory: sales read"
  on public.inventory_items for select
  to authenticated
  using ((select public.get_my_role()) = 'sales');

drop policy if exists "sales: ops roles all" on public.sales;
create policy "sales: users read own"
  on public.sales for select
  to authenticated
  using (sold_by = (select auth.uid()));

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.log_sale_impl(
  p_item_id uuid,
  p_qty integer,
  p_client_id uuid default null,
  p_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_price numeric(12,2);
  v_sale_id uuid;
begin
  if v_user_id is null
     or public.get_my_role() not in ('owner', 'sales', 'warehouse') then
    raise exception 'Not authorized to log sales';
  end if;

  if p_qty <= 0 then
    raise exception 'Quantity must be greater than zero';
  end if;

  if p_client_id is not null and not exists (
    select 1 from public.clients c
    where c.id = p_client_id and c.created_by = v_user_id
  ) then
    raise exception 'Client is not owned by the signed-in user';
  end if;

  update public.inventory_items
     set stock_qty = stock_qty - p_qty, updated_at = now()
   where id = p_item_id and stock_qty >= p_qty
   returning unit_price into v_price;

  if not found then
    raise exception 'Insufficient stock or unknown item';
  end if;

  insert into public.sales (item_id, client_id, qty, unit_price_at_sale, sold_by, note)
  values (p_item_id, p_client_id, p_qty, v_price, v_user_id, p_note)
  returning id into v_sale_id;

  return v_sale_id;
end;
$$;

revoke all on function private.log_sale_impl(uuid, integer, uuid, text) from public, anon;
grant execute on function private.log_sale_impl(uuid, integer, uuid, text) to authenticated;

create or replace function public.log_sale(
  p_item_id uuid,
  p_qty integer,
  p_client_id uuid default null,
  p_note text default null
)
returns uuid
language sql
security invoker
set search_path = ''
as $$
  select private.log_sale_impl(p_item_id, p_qty, p_client_id, p_note);
$$;

revoke all on function public.log_sale(uuid, integer, uuid, text) from public, anon;
grant execute on function public.log_sale(uuid, integer, uuid, text) to authenticated;

drop policy if exists "client-assets: crm read" on storage.objects;
drop policy if exists "client-assets: crm insert" on storage.objects;
drop policy if exists "client-assets: crm delete" on storage.objects;

create policy "client-assets: owner read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'client-assets'
    and exists (
      select 1 from public.clients c
      where c.id::text = split_part(name, '/', 1)
        and c.created_by = (select auth.uid())
    )
  );

create policy "client-assets: owner insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'client-assets'
    and exists (
      select 1 from public.clients c
      where c.id::text = split_part(name, '/', 1)
        and c.created_by = (select auth.uid())
    )
  );

create policy "client-assets: owner delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'client-assets'
    and exists (
      select 1 from public.clients c
      where c.id::text = split_part(name, '/', 1)
        and c.created_by = (select auth.uid())
    )
  );

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'leads'
  ) then
    execute 'alter publication supabase_realtime add table public.leads';
  end if;
end
$$;
