-- Keep inventory readable by every operational role without overlapping SELECT
-- policies. Only owner and warehouse accounts may change stock directly.
drop policy if exists "inventory: operations manage" on public.inventory_items;
drop policy if exists "inventory: sales read" on public.inventory_items;

create policy "inventory: operational roles read"
  on public.inventory_items for select
  to authenticated
  using ((select public.get_my_role()) in ('owner', 'sales', 'warehouse'));

create policy "inventory: operations insert"
  on public.inventory_items for insert
  to authenticated
  with check ((select public.get_my_role()) in ('owner', 'warehouse'));

create policy "inventory: operations update"
  on public.inventory_items for update
  to authenticated
  using ((select public.get_my_role()) in ('owner', 'warehouse'))
  with check ((select public.get_my_role()) in ('owner', 'warehouse'));

create policy "inventory: operations delete"
  on public.inventory_items for delete
  to authenticated
  using ((select public.get_my_role()) in ('owner', 'warehouse'));

create index if not exists client_assets_uploaded_by_idx on public.client_assets (uploaded_by);
create index if not exists leads_assigned_to_idx on public.leads (assigned_to);
create index if not exists leads_client_id_idx on public.leads (client_id);

alter function public.touch_updated_at() set search_path = '';

-- Trigger functions are not application RPC endpoints.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.get_my_role() from public, anon;
grant execute on function public.get_my_role() to authenticated;
