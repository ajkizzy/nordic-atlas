-- ============================================================
-- Expand cuisine taxonomy for the Copenhagen corridor sweep, and add
-- `bag_potential` — the field the sales team actually prioritises on.
-- ============================================================

-- New cuisine values (Postgres requires these outside a transaction block;
-- the Supabase CLI runs each migration file in its own transaction, so these
-- live in their own file ahead of any usage.)
alter type public.cuisine_type add value if not exists 'bakery';
alter type public.cuisine_type add value if not exists 'deli';
alter type public.cuisine_type add value if not exists 'salad';
alter type public.cuisine_type add value if not exists 'cafe';
