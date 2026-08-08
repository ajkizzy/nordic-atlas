-- Exact source identities are authoritative. The normalized name/address guard
-- catches the same physical venue arriving from a different source dataset.
drop index if exists public.leads_external_ref_idx;

create unique index leads_external_ref_unique_idx
  on public.leads (lower(btrim(external_ref)))
  where external_ref is not null and btrim(external_ref) <> '';

create unique index leads_name_address_unique_idx
  on public.leads (
    lower(regexp_replace(btrim(name), '\s+', ' ', 'g')),
    lower(regexp_replace(btrim(address), '\s+', ' ', 'g'))
  )
  where address is not null and btrim(address) <> '';
