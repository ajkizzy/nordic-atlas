-- Separate file: new enum values can't be used in the same transaction
-- that created them.
create type public.bag_potential as enum ('high', 'medium', 'low');

alter table public.leads
  add column bag_potential public.bag_potential not null default 'medium';

create index leads_bag_potential_idx on public.leads (bag_potential);

comment on column public.leads.bag_potential is
  'Estimated takeaway-bag volume: high = bag on nearly every order (sushi, '
  'bakery, deli, salad/bowl takeaway), medium = dine-in led with some takeaway, '
  'low = little or no bagged output. Set by the rep; seeded values are estimates.';
