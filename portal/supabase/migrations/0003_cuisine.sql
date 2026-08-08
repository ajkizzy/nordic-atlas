-- ============================================================
-- Add cuisine sub-classification to leads (restaurants only).
-- `category` stays the coarse filter (restaurant / market / retail / cafe);
-- `cuisine` drives the map pin glyph.
-- ============================================================
create type public.cuisine_type as enum (
  'burger', 'bbq', 'fastfood', 'sushi', 'asian',
  'indian', 'middle_eastern', 'pizza', 'sandwich', 'other'
);

alter table public.leads
  add column cuisine public.cuisine_type not null default 'other';

create index leads_cuisine_idx on public.leads (cuisine);

-- Optional provenance columns for externally-sourced nodes.
alter table public.leads
  add column phone text,
  add column external_ref text;   -- e.g. Google place_id, CVR number

create index leads_external_ref_idx on public.leads (external_ref);
