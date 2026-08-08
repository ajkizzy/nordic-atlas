/**
 * Seed verified Roskilde restaurant leads.
 *
 *   node scripts/seed-roskilde.mjs
 *
 * PROVENANCE NOTE
 * ---------------
 * Every row below was geocoded and cross-checked against Google Places in
 * August 2026. Where the supplied source list disagreed with Places on the
 * address or phone number, the Places value was used and the discrepancy is
 * recorded in the `sourceListSaid` comment so it can be re-checked.
 *
 * Entries from the source list that could NOT be verified as existing in
 * Roskilde are listed in UNVERIFIED at the bottom and are NOT inserted.
 * Add them manually via the map UI once confirmed by phone or site visit.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.');
  process.exit(1);
}
const supabase = createClient(url, key);

const base = { category: 'restaurant', city: 'Roskilde', status: 'new', source: 'google_places' };

const VERIFIED = [
  // ── Burger, BBQ & Fastfood ───────────────────────────────────────────
  { name: 'Halifax', cuisine: 'burger', address: 'Skomagergade 38, 4000 Roskilde',
    lat: 55.6408389, lng: 12.0768865, phone: '+45 82 30 43 09',
    external_ref: 'ChIJlZXILNBfUkYRZTV0Rr7o0Ec' }, // sourceListSaid: Ro's Torv 1 / 82 43 43 55
  { name: "Bone's Roskilde", cuisine: 'bbq', address: 'Algade 55, 4000 Roskilde',
    lat: 55.6406402, lng: 12.0899944, phone: '+45 46 73 20 20',
    external_ref: 'ChIJqdoB9cVfUkYR7YYXRLAH9IM' }, // sourceListSaid: Københavnsvej 67 / 46 36 82 22
  { name: 'Smash Burger Roskilde', cuisine: 'burger', address: 'Algade 44, 4000 Roskilde',
    lat: 55.6406996, lng: 12.0879055, phone: '+45 60 68 62 27',
    external_ref: 'ChIJJ5naxelfUkYRolBhSGHPOzQ' }, // sourceListSaid: Skomagergade 34 / 50 12 00 00
  { name: "McDonald's (Københavnsvej)", cuisine: 'fastfood', address: 'Københavnsvej 118, 4000 Roskilde',
    lat: 55.6421726, lng: 12.1157793, phone: '+45 46 75 75 34',
    external_ref: 'ChIJee926rFfUkYRIE4dveMhmbI' }, // sourceListSaid: nr. 142 / 46 35 50 14
  { name: "McDonald's (Ringstedgade)", cuisine: 'fastfood', address: 'Ringstedgade 76, 4000 Roskilde',
    lat: 55.6343121, lng: 12.0736977, phone: '+45 46 32 03 50',
    external_ref: 'ChIJJ8v9M9xfUkYRrys7FnQICxQ' }, // sourceListSaid: nr. 75 / 46 32 02 00
  { name: 'Burger King', cuisine: 'fastfood', address: 'Køgevej 101, 4000 Roskilde',
    lat: 55.62657, lng: 12.091846, phone: '+45 53 72 88 18',
    external_ref: 'ChIJE5mS3-pfUkYRYxNOR65FPtk' }, // sourceListSaid: Københavnsvej 104 / 46 36 00 24

  // ── Asian & Sushi ────────────────────────────────────────────────────
  { name: 'Muban Thai Roskilde', cuisine: 'asian', address: 'Algade 41, 4000 Roskilde',
    lat: 55.6409162, lng: 12.08794, phone: '+45 28 57 38 66',
    external_ref: 'ChIJBXXVYxlfUkYRrAPBrzjmdcY' }, // sourceListSaid: Ringstedgade 21 / 46 35 46 45
  { name: 'La Tre Street Kitchen', cuisine: 'asian', address: 'Algade 66, 4000 Roskilde',
    lat: 55.6403534, lng: 12.091267, phone: '+45 35 95 15 88',
    external_ref: 'ChIJA5t6dKlfUkYRPVhTkEEfbz0' }, // sourceListSaid: Algade 33 / 42 75 75 92
  { name: 'Ja Dimsum Sushi Roskilde', cuisine: 'sushi', address: 'Helligkorsvej 12, 4000 Roskilde',
    lat: 55.6391415, lng: 12.068785, phone: '+45 30 84 88 66',
    external_ref: 'ChIJxb463JZfUkYRk9locm6v9Pc' }, // sourceListSaid: Algade 52 / 46 35 30 30
  { name: 'Wokshop', cuisine: 'asian', address: 'Københavnsvej 29, 4000 Roskilde',
    lat: 55.6413687, lng: 12.100099, phone: '+45 43 42 61 21',
    external_ref: 'ChIJ17NsUoZfUkYRVaLXZV4-sbE' }, // sourceListSaid: Ro's Torv 1 / 46 35 45 45

  // ── Indian & Middle Eastern ──────────────────────────────────────────
  { name: 'Namaste', cuisine: 'indian', address: 'Skomagergade 12, 4000 Roskilde',
    lat: 55.6410488, lng: 12.0793711, phone: '+45 77 77 07 17',
    external_ref: 'ChIJt4cW7-1fUkYReeAoRwwfFHU' }, // sourceListSaid: Ringstedgade 12 / 46 35 15 16
  { name: 'Shawarma Grill-House', cuisine: 'middle_eastern', address: 'Hestetorvet 3, 4000 Roskilde',
    lat: 55.6401071, lng: 12.0892856, phone: '+45 46 46 20 40',
    external_ref: 'ChIJuRRBksVfUkYRufb6kDumO_w' }, // sourceListSaid: Skomagergade 37 / 46 32 02 24

  // ── Pizza & Italian ──────────────────────────────────────────────────
  { name: 'Viking Pizza Roskilde', cuisine: 'pizza', address: 'Sankt Clara Vej 12, 4000 Roskilde',
    lat: 55.6472131, lng: 12.0789594, phone: '+45 46 32 12 90',
    external_ref: 'ChIJqfjaVtFfUkYRMxvy2vc5LqE' }, // sourceListSaid: "Vikingernes Spisehus", Helligkorsvej 2 — name differs, confirm
  { name: 'Algade Pizza', cuisine: 'pizza', address: 'Algade 25, 4000 Roskilde',
    lat: 55.6411572, lng: 12.0856217, phone: '+45 46 38 34 33',
    external_ref: 'ChIJ0bylWMVfUkYRmT0wc2YXR1k' }, // sourceListSaid: Algade 64 / 46 35 35 56
  { name: 'La Rustica Roskilde', cuisine: 'pizza', address: "Ro's Torv 1, 4000 Roskilde",
    lat: 55.6414858, lng: 12.0998819, phone: '+45 46 32 63 47',
    external_ref: 'ChIJV8JrIchfUkYRaRZ77o1Zgs4' }, // address matched source list

  // ── Sandwich, Bagels & Salad ─────────────────────────────────────────
  { name: 'Bagels To Eat', cuisine: 'sandwich', address: 'Hestetorvet 20, 4000 Roskilde',
    lat: 55.6402762, lng: 12.0882294, phone: '+45 46 36 66 86',
    external_ref: 'ChIJtaYkhcVfUkYRLBl2DIh5eJ8' }, // sourceListSaid: Hestetorvet 1 / 46 35 01 02
  { name: 'Korn To Go Roskilde', cuisine: 'sandwich', address: 'Skomagergade 2, 4000 Roskilde',
    lat: 55.6410911, lng: 12.0801079, phone: '+45 41 98 40 00',
    external_ref: 'ChIJgSfVi5RfUkYRyWn2H24EaHk' }, // sourceListSaid: Algade 10 / 46 36 33 55

  // ── Found while verifying; not on the source list but real and on-territory ──
  { name: 'Itacho Sushi Roskilde', cuisine: 'sushi', address: 'Skomagergade 34, 4000 Roskilde',
    lat: 55.6408767, lng: 12.0773032, phone: '+45 53 78 68 66',
    external_ref: 'ChIJBQC5cwBfUkYRWQEGiQKcXFY' },
  { name: 'Ramen Izakaya', cuisine: 'asian', address: 'Stationscentret 12, 4000 Roskilde',
    lat: 55.6375574, lng: 12.0838882, phone: '+45 46 37 06 99',
    external_ref: 'ChIJMyhjZsFfUkYR4MCIrC_n1OU' },
  { name: 'Il Bordo Vivo Pizzeria', cuisine: 'pizza', address: 'Ringstedgade 50, 4000 Roskilde',
    lat: 55.6370598, lng: 12.0756666, phone: '+45 29 60 60 78',
    external_ref: 'ChIJi6IQOgBfUkYRTJrEeIPNlKM' },
  { name: 'Mester Kebab & Pizza', cuisine: 'middle_eastern', address: 'Københavnsvej 28C, 4000 Roskilde',
    lat: 55.6410397, lng: 12.0997144, phone: '+45 21 73 77 77',
    external_ref: 'ChIJiU7g3-hfUkYRUoGfOfylu94' },
].map((r) => ({ ...base, ...r }));

/**
 * Could not be confirmed to exist in Roskilde. Searches returned either no
 * match or a business in a different city. NOT inserted — verify before use.
 */
const UNVERIFIED = [
  ['Sunset Boulevard', "Ro's Torv 1", 'nearest branch found is in Greve, not Roskilde'],
  ["Gorm's", "Ro's Torv 1", 'no pizza business by this name in Roskilde'],
  ['Casa Mia', 'Ringstedgade 30', 'nearest match is in Lillestrøm, Norway'],
  ['Mamma Mia', 'Skomagergade 26', 'no match in Roskilde'],
  ['Yumi Sushi', 'Københavnsvej 67', 'nearest match is in Aalborg'],
  ['Karat Sushi', 'Skomagergade 12', 'that address is Namaste; no Karat Sushi found'],
  ['Roskilde Pizza', 'Københavnsvej 61', 'no match; nearest is Mester Kebab & Pizza at nr. 28C'],
  ['Hyrdehøj Pizza', 'Hyrdehøj Bygade 6', 'no match returned'],
  ['Spisestedet Ro', "Ro's Torv 1", 'not checked — food-court stall, likely not separately listed'],
  ['The Bagel Co', "Ro's Torv 1", 'not checked — food-court stall, likely not separately listed'],
];

const { error, count } = await supabase
  .from('leads')
  .insert(VERIFIED, { count: 'exact' });

if (error) {
  console.error('Insert failed:', error.message);
  process.exit(1);
}

console.log(`✓ Seeded ${count ?? VERIFIED.length} verified Roskilde leads.`);
console.log(`\n⚠ ${UNVERIFIED.length} entries skipped as unverified:`);
for (const [name, addr, why] of UNVERIFIED) {
  console.log(`   · ${name} (${addr}) — ${why}`);
}
