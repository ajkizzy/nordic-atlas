# Nordic Atlas Portal

Internal ERP/CRM for Nordic Atlas Packaging. Isolated Next.js app intended for
`portal.nordicatlaspackaging.com`, built on the same stack as the marketing site
(Next.js 15 · React 19 · TypeScript · Tailwind, shared brand tokens & fonts).

## Setup

1. **Supabase project** — create a free project at supabase.com, then:
   ```bash
   cp .env.example .env.local   # paste in URL + anon key (Settings → API)
   ```
2. **Apply migrations** (after schema approval):
   ```bash
   npx supabase link --project-ref YOUR_REF
   npx supabase db push          # runs supabase/migrations/0001 + 0002
   ```
3. **Create the Owner account** — invite yourself via Supabase Auth dashboard,
   then in the SQL editor:
   ```sql
   update public.profiles set role = 'owner' where id = 'YOUR-USER-UUID';
   ```
   New signups default to `sales`; promote warehouse staff the same way.
4. **Seed the map** (optional):
   ```bash
   npm run seed:roskilde                   # 21 verified Roskilde restaurants
   npm run seed:corridor                   # 47 verified Køge→Solrød→Copenhagen leads
   npm run seed:leads                      # starter Copenhagen/Sjælland dataset
   npm run seed:leads -- --source=cvr      # Danish CVR register (needs credentials)
   npm run seed:leads -- --source=places   # Google Places (needs API key)
   ```

   CSV lead lists can be dropped into `data/lead-imports/inbox/`. See the
   README in that folder for the exact six-column format and import rules.
   `seed-roskilde.mjs` prints a list of source-list entries it could **not**
   verify; those are deliberately not inserted. See the provenance comments at
   the top of that file.

## Map pin encoding

Pins are teardrops with two independent channels:

- **Fill colour = lead status** (`new` grey → `contacted` amber → `negotiating`
  blue → `won` brand green → `lost` rose), overridable per node via the colour
  swatches in the lead editor.
- **Glyph = cuisine** (burger, BBQ, fast food, sushi, asian, indian, middle
  eastern, pizza, sandwich, other) — lucide icon paths embedded as raw markup in
  `src/lib/cuisine.ts` so the same glyph renders in the Leaflet pin, the filter
  chips, the list view, and the legend without shipping `react-dom/server`.

Cuisine chips above the map toggle visibility independently of the coarse
category filter.

## Bag potential

`leads.bag_potential` (high / medium / low) estimates takeaway-bag volume from
the business model — sushi, bakeries, delis and salad-bowl shops bag nearly
every order; dine-in-led restaurants bag a fraction. It's a call-ordering
heuristic, **not measured data**, and reps should overwrite it after first
contact. Filter by it from the toolbar dropdown; it also shows as a column in
the list view and is editable in the lead panel.
5. `npm run dev`

## Role model (enforced by RLS, mirrored in the UI)

| | Owner | Sales Rep | Warehouse |
|---|---|---|---|
| Map CRM + Clients + Assets | ✅ | ✅ | ❌ |
| Sales & Inventory | ✅ | ✅ (stock read-only) | ✅ |
| Lead records and contact status | ✅ shared | ✅ shared | ❌ |
| Clients and client files | Own only | Own only | ❌ |
| Sales and revenue | Own only | Own only | Own sales rows; totals hidden |
| User administration | ✅ | ❌ | ❌ |

Frontend gates (`requireModule`, conditional rendering) are convenience only —
Postgres RLS is the actual security boundary, so a modified client cannot read
rows its role is denied.

## Deployment

Deploy to Vercel (or any Node host) as its own project; point the
`portal.nordicatlaspackaging.com` CNAME at it. Set the two `NEXT_PUBLIC_SUPABASE_*`
env vars in the host. The service-role key is used only by local seed scripts —
never add it to the deployed environment.
