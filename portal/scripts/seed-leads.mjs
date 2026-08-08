/**
 * Seed map leads into Supabase.
 *
 * Usage:  node scripts/seed-leads.mjs [--source=starter|cvr|places]
 *
 * - starter (default): built-in Copenhagen/Roskilde dataset so the map is
 *   populated on first run. No external API needed.
 * - cvr:     Danish CVR register (Erhvervsstyrelsen). Requires CVR_API_USER /
 *            CVR_API_PASS system-to-system credentials in .env.
 * - places:  Google Places API. Requires GOOGLE_PLACES_API_KEY in .env.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (server-side only — bypasses RLS to seed).
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.');
  process.exit(1);
}
const supabase = createClient(url, key);
const source = (process.argv.find((a) => a.startsWith('--source=')) ?? '--source=starter').split('=')[1];

// ---------- starter dataset: Copenhagen / Roskilde / Sjælland ----------
const STARTER = [
  { name: 'Torvehallerne', category: 'market', lat: 55.6839, lng: 12.5713, city: 'København', address: 'Frederiksborggade 21' },
  { name: 'Restaurant Schønnemann', category: 'restaurant', lat: 55.6813, lng: 12.5768, city: 'København', address: 'Hauser Plads 16' },
  { name: 'Reffen Street Food', category: 'market', lat: 55.6900, lng: 12.6103, city: 'København', address: 'Refshalevej 167' },
  { name: 'Illums Bolighus', category: 'retail', lat: 55.6786, lng: 12.5793, city: 'København', address: 'Amagertorv 10' },
  { name: 'Coffee Collective Jægersborggade', category: 'cafe', lat: 55.6941, lng: 12.5442, city: 'København', address: 'Jægersborggade 57' },
  { name: 'Roskilde Bymidte Bageri', category: 'retail', lat: 55.6419, lng: 12.0808, city: 'Roskilde', address: 'Algade 12' },
  { name: 'Restaurant Snekken', category: 'restaurant', lat: 55.6507, lng: 12.0800, city: 'Roskilde', address: 'Vindeboder 16' },
  { name: 'Køge Torv Grønt', category: 'market', lat: 55.4580, lng: 12.1821, city: 'Køge', address: 'Torvet 1' },
  { name: 'Helsingør Havnecafé', category: 'cafe', lat: 56.0361, lng: 12.6136, city: 'Helsingør', address: 'Havnepladsen 3' },
  { name: 'Næstved Storcenter Deli', category: 'retail', lat: 55.2419, lng: 11.7625, city: 'Næstved', address: 'Merkurvej 1' },
].map((l) => ({ ...l, status: 'new', source: 'manual' }));

// ---------- CVR source (Erhvervsstyrelsen Elasticsearch endpoint) ----------
async function fetchCvr() {
  const user = process.env.CVR_API_USER;
  const pass = process.env.CVR_API_PASS;
  if (!user || !pass) throw new Error('CVR_API_USER / CVR_API_PASS not set');
  const res = await fetch('http://distribution.virk.dk/cvr-permanent/virksomhed/_search', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      size: 100,
      query: {
        bool: {
          must: [
            // Restaurants (DB07 branch code 561010) in the Capital Region — adjust as needed
            { term: { 'Vrvirksomhed.virksomhedMetadata.nyesteHovedbranche.branchekode': '561010' } },
            { match: { 'Vrvirksomhed.virksomhedMetadata.nyesteBeliggenhedsadresse.kommune.kommuneNavn': 'København' } },
          ],
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`CVR request failed: ${res.status}`);
  const json = await res.json();
  return (json.hits?.hits ?? [])
    .map((h) => {
      const v = h._source?.Vrvirksomhed;
      const meta = v?.virksomhedMetadata;
      const addr = meta?.nyesteBeliggenhedsadresse;
      if (!addr?.koordinater) return null; // skip entries without coordinates
      const [lng, lat] = String(addr.koordinater).split(',').map(Number);
      return {
        name: meta?.nyesteNavn?.navn ?? 'Ukendt virksomhed',
        category: 'restaurant',
        lat, lng,
        city: addr?.postdistrikt ?? null,
        address: [addr?.vejnavn, addr?.husnummerFra].filter(Boolean).join(' ') || null,
        status: 'new',
        source: 'cvr',
      };
    })
    .filter(Boolean);
}

// ---------- Google Places source ----------
async function fetchPlaces() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY not set');
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.displayName,places.location,places.formattedAddress,places.primaryType',
    },
    body: JSON.stringify({
      textQuery: 'restaurants in Copenhagen',
      locationBias: { circle: { center: { latitude: 55.676, longitude: 12.568 }, radius: 15000 } },
      maxResultCount: 20,
    }),
  });
  if (!res.ok) throw new Error(`Places request failed: ${res.status}`);
  const json = await res.json();
  return (json.places ?? []).map((p) => ({
    name: p.displayName?.text ?? 'Unknown',
    category: 'restaurant',
    lat: p.location.latitude,
    lng: p.location.longitude,
    address: p.formattedAddress ?? null,
    city: 'København',
    status: 'new',
    source: 'google_places',
  }));
}

const rows = source === 'cvr' ? await fetchCvr() : source === 'places' ? await fetchPlaces() : STARTER;
const { error, count } = await supabase.from('leads').insert(rows, { count: 'exact' });
if (error) {
  console.error('Insert failed:', error.message);
  process.exit(1);
}
console.log(`Seeded ${count ?? rows.length} leads from source "${source}".`);
