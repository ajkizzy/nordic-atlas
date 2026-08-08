/**
 * Seed verified leads across the Køge → Solrød → Copenhagen corridor,
 * selected for takeaway-bag volume.
 *
 *   node scripts/seed-corridor.mjs
 *
 * SELECTION LOGIC
 * ---------------
 * Targets were chosen by business model, not cuisine snobbery: places whose
 * output leaves the building in a bag on most orders.
 *
 *   high   — a bag goes out with nearly every order. Sushi and poke (rigid
 *            trays that need a flat-bottom carrier), bakeries (high unit
 *            count, low value per bag — volume buyers), smørrebrød/deli
 *            takeaway, salad-bowl shops, dedicated takeaway kitchens.
 *   medium — dine-in led, with a takeaway/delivery side. Real volume, but
 *            seasonal and smaller.
 *
 * `bag_potential` is an *estimate from business model*, not measured data.
 * It's a call-ordering heuristic; reps should overwrite it after first contact.
 *
 * PROVENANCE
 * ----------
 * Every row was geocoded against Google Places in August 2026 — name, address,
 * coordinates and phone all come from the Places record, and `external_ref`
 * holds the place_id so a row can be re-verified later. Nothing here was taken
 * from a directory listing on trust.
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

const L = (r) => ({ category: 'restaurant', status: 'new', source: 'google_places', ...r });

const LEADS = [
  // ═══ KØGE ═══
  L({ name: 'Amisushi', cuisine: 'sushi', bag_potential: 'high',
      address: 'Torvet 7, 4600 Køge', city: 'Køge', lat: 55.4561939, lng: 12.1826075,
      phone: '+45 53 68 66 88', external_ref: 'ChIJ63JVonTxUkYRdm6oV8NJghc' }),
  L({ name: 'Kuruki Sushi', cuisine: 'sushi', bag_potential: 'high',
      address: 'Vestergade 20, 4600 Køge', city: 'Køge', lat: 55.4577088, lng: 12.1788041,
      phone: '+45 56 65 12 23', external_ref: 'ChIJLwIbgqzxUkYRfMWZR1gfM_E' }),
  L({ name: 'Lazy Lunches', cuisine: 'salad', bag_potential: 'high',
      address: 'Nørregade 46, 4600 Køge', city: 'Køge', lat: 55.4597081, lng: 12.1842282,
      phone: '+45 20 66 57 93', external_ref: 'ChIJzd1_AEzxUkYRSsDcbGLS5Ck',
      notes: 'Small independent lunch bistro — takeaway-led. Owner-operated, so one conversation closes it.' }),
  L({ name: "Nicolai's Bageri", cuisine: 'bakery', bag_potential: 'high',
      address: 'Nørre Blvd. 68, 4600 Køge', city: 'Køge', lat: 55.4647432, lng: 12.1830221,
      phone: '+45 56 65 08 58', external_ref: 'ChIJq-thXyD3UkYRw3eQZFuoot0',
      notes: 'Long-established local bakery. Opens 05:30 — high daily unit count.' }),
  L({ name: 'Konditoriet by Bager', cuisine: 'bakery', bag_potential: 'high',
      address: 'Nørregade 11, 4600 Køge', city: 'Køge', lat: 55.4576996, lng: 12.1831642,
      phone: '+45 60 19 05 88', external_ref: 'ChIJecZjkkXxUkYRFZqTZemdQRY' }),

  // ═══ SOLRØD ═══
  L({ name: 'Sushi Amor Solrød', cuisine: 'sushi', bag_potential: 'high',
      address: 'Solrød Center 130, 2680 Solrød Strand', city: 'Solrød Strand',
      lat: 55.5326633, lng: 12.2221801, phone: '+45 32 11 51 15',
      external_ref: 'ChIJe4n-6x33UkYRMCpgRi2P2W0' }),
  L({ name: 'Itacho Solrød', cuisine: 'sushi', bag_potential: 'high',
      address: 'Solrød Center 66, 2680 Solrød Strand', city: 'Solrød Strand',
      lat: 55.532985, lng: 12.2189889, phone: '+45 93 88 68 66',
      external_ref: 'ChIJBcAyV5P3UkYRAnjauAFR_GQ',
      notes: 'PRIORITY: reviews confirm they already charge separately for takeaway bags and refund when customers bring their own — they are actively managing bag cost. Direct opening for a better-unit-economics pitch.' }),
  L({ name: 'FavorEaten', cuisine: 'middle_eastern', bag_potential: 'high',
      address: 'Solrød Center 30, 2680 Solrød Strand', city: 'Solrød Strand',
      lat: 55.5333852, lng: 12.2161396, phone: '+45 56 13 13 50',
      external_ref: 'ChIJr3TbxHf3UkYRJ2Z7ca3SXl8' }),
  L({ name: 'Cafe Iso Solrød', cuisine: 'cafe', bag_potential: 'medium',
      address: 'Solrød Center 38, 2680 Solrød Strand', city: 'Solrød Strand',
      lat: 55.5334733, lng: 12.2166237, phone: '+45 53 52 98 95',
      external_ref: 'ChIJGXeBG0f3UkYRyNIO4x2Yr_s' }),

  // ═══ GREVE / HUNDIGE ═══
  L({ name: 'Great Sushi Greve', cuisine: 'sushi', bag_potential: 'high',
      address: 'Greve Strandvej 9, 2670 Greve', city: 'Greve',
      lat: 55.58227, lng: 12.312342, phone: '+45 43 90 35 00',
      external_ref: 'ChIJSfIe5QD4UkYRjT8SRnkCQ2o' }),
  L({ name: 'Yumi Hut Greve', cuisine: 'sushi', bag_potential: 'high',
      address: 'Greve Midtby Center 10K, 2670 Greve', city: 'Greve',
      lat: 55.582593, lng: 12.295474, phone: '+45 21 77 86 89',
      external_ref: 'ChIJqUnWWvz3UkYRkvPkO0YaqJ4' }),
  L({ name: "May'C Mosede", cuisine: 'sushi', bag_potential: 'high',
      address: 'Mosede Strandvej 50, 2670 Greve', city: 'Greve',
      lat: 55.5694778, lng: 12.2822169, phone: '+45 97 87 55 55',
      external_ref: 'ChIJdWLd6u33UkYR26lxbw62xGo',
      notes: 'Two locations (see May\u2019C Hundige) — chain deal potential.' }),
  L({ name: "May'C Hundige", cuisine: 'sushi', bag_potential: 'high',
      address: 'Hundige Strandvej 29, 2670 Greve', city: 'Greve',
      lat: 55.5981487, lng: 12.3484948, phone: '+45 97 87 22 22',
      external_ref: 'ChIJZy_FIgRXUkYRS4pK_SS9yjU',
      notes: 'Second May\u2019C site — approach together with Mosede.' }),

  // ═══ ISHØJ / VALLENSBÆK / BRØNDBY / HVIDOVRE / TAASTRUP / RØDOVRE ═══
  L({ name: 'Kyoto Sushi Ishøj', cuisine: 'sushi', bag_potential: 'high',
      address: 'Ishøj Bymidte, Lille Torv 20, 2635 Ishøj', city: 'Ishøj',
      lat: 55.6142622, lng: 12.3548244, phone: '+45 50 70 66 88',
      external_ref: 'ChIJC4o6Ur1XUkYRp7VWX6tKzbI',
      notes: 'PRIORITY: a customer review specifically praises their reusable packing bag — they already treat packaging as part of the brand experience. Warm lead for a premium reusable line.' }),
  L({ name: 'Golden Bread', cuisine: 'bakery', bag_potential: 'high',
      address: 'Vejlegårdsvej 41, 2665 Vallensbæk Strand', city: 'Vallensbæk Strand',
      lat: 55.622901, lng: 12.375655, phone: '+45 43 54 44 45',
      external_ref: 'ChIJIc4c_6dXUkYRkF8lDfLf1Ao',
      notes: 'Large independent bakery, open 7 days, ~900 reviews. High volume.' }),
  L({ name: 'Lagkagehuset Vallensbæk', cuisine: 'bakery', bag_potential: 'high',
      address: 'Vallensbæk Stationstorv 1, 2665 Vallensbæk Strand', city: 'Vallensbæk Strand',
      lat: 55.6241544, lng: 12.3880073, phone: '+45 73 70 94 03',
      external_ref: 'ChIJxYti5ABXUkYRmivAhXG9Yco',
      notes: 'Chain franchise — packaging likely centrally sourced. Worth qualifying who decides before spending time.' }),
  L({ name: 'Kai Sushi Brøndby', cuisine: 'sushi', bag_potential: 'high',
      address: 'Brøndbyøster Torv 29, 2605 Brøndby', city: 'Brøndby',
      lat: 55.6640228, lng: 12.4402504, phone: '+45 35 11 68 88',
      external_ref: 'ChIJw0jc8TRRUkYRrv6MklmF90k' }),
  L({ name: 'Yoki Restaurant', cuisine: 'sushi', bag_potential: 'high',
      address: 'Hvidovrevej 279, 2650 Hvidovre', city: 'Hvidovre',
      lat: 55.6369482, lng: 12.4799841, phone: '+45 29 61 02 03',
      external_ref: 'ChIJjxQFWxhUUkYRrCXwKt4ndB8' }),
  L({ name: 'Kirin Sushi', cuisine: 'sushi', bag_potential: 'high',
      address: 'Hvidovrevej 134A, 2650 Hvidovre', city: 'Hvidovre',
      lat: 55.6579907, lng: 12.4728924, phone: '+45 36 47 88 28',
      external_ref: 'ChIJOUv506pWUkYRl4m4wWi9uko' }),
  L({ name: 'Sushi Amor Taastrup', cuisine: 'sushi', bag_potential: 'high',
      address: 'Taastrup Hovedgade 77, 2630 Taastrup', city: 'Taastrup',
      lat: 55.6506842, lng: 12.3024854, phone: '+45 32 21 12 22',
      external_ref: 'ChIJB0v9aSlZUkYRZQYtpltjB28',
      notes: 'Same brand as Sushi Amor Solrød — check whether purchasing is shared.' }),
  L({ name: 'Noodle By Rice', cuisine: 'salad', bag_potential: 'high',
      address: 'Falsterbogade 35, 2630 Høje Taastrup', city: 'Høje Taastrup',
      lat: 55.6453913, lng: 12.2777113, phone: '+45 31 11 33 30',
      external_ref: 'ChIJmfjYzZpZUkYR2h4MEe0TG4Y',
      notes: 'Newer site, poke bowls + sushi, explicitly set up for to-go.' }),
  L({ name: 'OLIOLI Rødovre', cuisine: 'salad', bag_potential: 'high',
      address: 'Rødovre Centrum, 2610 Rødovre', city: 'Rødovre',
      lat: 55.6781728, lng: 12.4564035, phone: '+45 33 21 01 21',
      external_ref: 'ChIJDbEDTlFRUkYRaiakSgGcyz8',
      notes: 'Poke chain, same phone as the Ny Østergade site — central purchasing likely.' }),
  L({ name: 'Wildflower Copenhagen', cuisine: 'cafe', bag_potential: 'medium',
      address: 'Gammel Køge Landevej 22M, 2500 København', city: 'København',
      lat: 55.659535, lng: 12.514828, phone: '+45 71 81 48 52',
      external_ref: 'ChIJyYSk7tVTUkYRB2erdX2fo6E' }),

  // ═══ COPENHAGEN — VESTERBRO / INDRE BY ═══
  L({ name: 'Fukuto', cuisine: 'sushi', bag_potential: 'medium',
      address: 'Vesterbrogade 6E, 1620 København', city: 'København',
      lat: 55.6741669, lng: 12.5621658, phone: '+45 31 11 08 88',
      external_ref: 'ChIJp_1z4mBTUkYRTv-VCu_RMbc' }),
  L({ name: 'Takuya Sushi & Ramen', cuisine: 'sushi', bag_potential: 'medium',
      address: 'Istedgade 1, 1651 København', city: 'København',
      lat: 55.6723198, lng: 12.5635257, phone: '+45 50 22 11 29',
      external_ref: 'ChIJaX4BUD9TUkYRihGCkYiAloI',
      notes: 'By Hovedbanegården — heavy commuter grab-and-go footfall.' }),
  L({ name: 'Poke.Poke', cuisine: 'salad', bag_potential: 'high',
      address: 'Vestergade 4, 1456 København', city: 'København',
      lat: 55.6781105, lng: 12.5709557, phone: '+45 32 14 00 03',
      external_ref: 'ChIJrw5BMm1TUkYR9FfZHnFTLb0' }),
  L({ name: 'OLIOLI Ny Østergade', cuisine: 'salad', bag_potential: 'high',
      address: 'Ny Østergade 28A, 1112 København', city: 'København',
      lat: 55.6819363, lng: 12.5819874, phone: '+45 33 21 01 21',
      external_ref: 'ChIJo6fA15VTUkYRb6rNTgWBwEA' }),
  L({ name: 'Hallernes Smørrebrød', cuisine: 'deli', bag_potential: 'high',
      address: 'Rømersgade 18 (Torvehallerne), 1360 København', city: 'København',
      lat: 55.6838612, lng: 12.5690346, phone: '+45 31 76 73 64',
      external_ref: 'ChIJzSGiCwVTUkYRM2XmxLIIRqc',
      notes: 'Torvehallerne stall — very high footfall, most orders leave the hall. Reference customer if won.' }),
  L({ name: 'Josephines Smørrebrød', cuisine: 'deli', bag_potential: 'high',
      address: 'Rantzausgade 20B, 2200 København', city: 'København',
      lat: 55.6862166, lng: 12.5507502, phone: '+45 50 13 93 07',
      external_ref: 'ChIJL95ScUpTUkYR2-XiBwkDY9o',
      notes: 'Owner-operated, 4.9 rating — cares about presentation. Good fit for branded bags.' }),
  L({ name: 'Better Bakery', cuisine: 'bakery', bag_potential: 'high',
      address: 'Helgolandsgade 10, 1650 København', city: 'København',
      lat: 55.6720066, lng: 12.5611418, phone: null,
      external_ref: 'ChIJ5wd5foBTUkYRvZ8ziyAgQ-s',
      notes: 'No phone listed in Places — walk-in or find contact via their socials.' }),
  L({ name: 'Andersen Bakery', cuisine: 'bakery', bag_potential: 'high',
      address: 'Thorshavnsgade 26, 2300 København', city: 'København',
      lat: 55.6672402, lng: 12.5785336, phone: '+45 33 75 07 35',
      external_ref: 'ChIJZ7Yecw1TUkYREYMSW_uwIQQ',
      notes: 'Very high traffic (~2900 reviews), queues out the door. Volume account.' }),
  L({ name: 'Wedo Kødbyen', cuisine: 'salad', bag_potential: 'high',
      address: 'Halmtorvet 21, 1700 København', city: 'København',
      lat: 55.6689327, lng: 12.5580688, phone: '+45 77 10 17 00',
      external_ref: 'ChIJX7HignNTUkYRSkvB1mJ-9y0',
      notes: 'Reviews describe it as primarily a takeaway-lunch salad spot with ~8 seats.' }),
  L({ name: 'Encke & Duers', cuisine: 'salad', bag_potential: 'high',
      address: 'Vesterbrogade 204, 1800 Frederiksberg', city: 'Frederiksberg',
      lat: 55.6708791, lng: 12.5321135, phone: '+45 33 22 22 32',
      external_ref: 'ChIJl5APZpdTUkYRUBWNANxb_c0',
      notes: 'Weekday lunch takeaway, near-zero seating. 4.8 rating.' }),

  // ═══ COPENHAGEN — FREDERIKSBERG ═══
  L({ name: 'Izumi', cuisine: 'sushi', bag_potential: 'medium',
      address: 'Gl. Kongevej 142, 1850 Frederiksberg', city: 'Frederiksberg',
      lat: 55.6771503, lng: 12.538872, phone: '+45 31 66 20 80',
      external_ref: 'ChIJx57w-q1TUkYRXtaUs4cdkcY',
      notes: 'A review complains their takeaway packaging spilled in the bag — concrete pain point to lead with.' }),
  L({ name: 'Yue Noodle & Sushi Bar', cuisine: 'sushi', bag_potential: 'medium',
      address: 'Smallegade 8, 2000 Frederiksberg', city: 'Frederiksberg',
      lat: 55.6787896, lng: 12.5317706, phone: '+45 91 95 70 85',
      external_ref: 'ChIJ_cNfmAFTUkYRIr--pJFouVQ',
      notes: 'Husband-and-wife owned, own ordering site + Wolt. Decision-maker is on site.' }),

  // ═══ COPENHAGEN — NØRREBRO ═══
  L({ name: "bar'sushi Nørrebrogade", cuisine: 'sushi', bag_potential: 'high',
      address: 'Nørrebrogade 152, 2200 København', city: 'København',
      lat: 55.695037, lng: 12.547991, phone: '+45 55 55 22 00',
      external_ref: 'ChIJsWtHA_5TUkYROiTyXtoz2-4' }),
  L({ name: 'Yankii Sushi', cuisine: 'sushi', bag_potential: 'high',
      address: 'Blågårdsgade 35, 2200 København', city: 'København',
      lat: 55.6853274, lng: 12.5571714, phone: '+45 35 35 10 00',
      external_ref: 'ChIJ__8TiQdTUkYRBuIP9-8UMeg' }),
  L({ name: 'Meyers Bageri Jægersborggade', cuisine: 'bakery', bag_potential: 'high',
      address: 'Jægersborggade 9, 2200 København', city: 'København',
      lat: 55.691859, lng: 12.5449609, phone: '+45 25 10 11 34',
      external_ref: 'ChIJZxwgla1TUkYRrwIwj0hyQ1o',
      notes: 'Meyers group — multi-site, likely central purchasing. Qualify the decision-maker early.' }),
  L({ name: 'Bageriet Benji', cuisine: 'bakery', bag_potential: 'high',
      address: 'Mjølnerparken 52, 2200 København', city: 'København',
      lat: 55.7038803, lng: 12.5417881, phone: null,
      external_ref: 'ChIJF9KsPadTUkYRg7L6BRhjBI8',
      notes: 'No phone in Places. Ex-Noma baker; strong brand identity, good branded-bag prospect.' }),

  // ═══ COPENHAGEN — ØSTERBRO / NORDHAVN ═══
  L({ name: 'Sushi Nord', cuisine: 'sushi', bag_potential: 'high',
      address: 'Bordeauxgade 2, 2150 København', city: 'København',
      lat: 55.7065411, lng: 12.5958178, phone: '+45 60 90 58 88',
      external_ref: 'ChIJjY_sZWpTUkYRMzaPavs5Op0',
      notes: 'Nordhavn — new-build area, affluent takeaway catchment.' }),
  L({ name: 'Sushi Don', cuisine: 'sushi', bag_potential: 'high',
      address: 'Nordre Frihavnsgade 78, 2100 København', city: 'København',
      lat: 55.7031083, lng: 12.5859447, phone: '+45 31 60 70 70',
      external_ref: 'ChIJc8yQLjNTUkYR6kY7TU4puZ4',
      notes: 'Owner runs it single-handed — one conversation, fast decision. 4.9 rating.' }),
  L({ name: 'Aamanns Deli & Takeaway Østerbro', cuisine: 'deli', bag_potential: 'high',
      address: 'Øster Farimagsgade 10, 2100 København', city: 'København',
      lat: 55.6900178, lng: 12.5751697, phone: '+45 20 80 52 01',
      external_ref: 'ChIJuas_1gJTUkYRKtII2qLTOpg',
      notes: 'Takeaway is in the name. Premium smørrebrød brand — best-fit account for a high-end bag line.' }),
  L({ name: 'Helges Ost', cuisine: 'deli', bag_potential: 'high',
      address: 'Rosenvængets Allé 6, 2100 København', city: 'København',
      lat: 55.6987776, lng: 12.5794659, phone: '+45 93 92 18 49',
      external_ref: 'ChIJpaM5XwBTUkYRCfsy0AML3y4',
      notes: 'Cheese deli + sandwiches; reviews note most customers take away.' }),
  L({ name: 'OHO Authentic Thai Food', cuisine: 'asian', bag_potential: 'high',
      address: 'Nordre Frihavnsgade 23, 2100 København', city: 'København',
      lat: 55.7011884, lng: 12.5801068, phone: '+45 71 42 34 94',
      external_ref: 'ChIJGdL9kFpTUkYRzgJyc7R6xCc' }),
  L({ name: 'Thai Take Away Randersgade', cuisine: 'asian', bag_potential: 'high',
      address: 'Randersgade 61, 2100 København', city: 'København',
      lat: 55.7069077, lng: 12.5801048, phone: '+45 51 53 65 65',
      external_ref: 'ChIJLT50qfFSUkYRVp9Ii8WZ6IQ' }),

  // ═══ COPENHAGEN — AMAGER ═══
  L({ name: 'Sushi Joint Amager Strand', cuisine: 'sushi', bag_potential: 'high',
      address: 'Amager Strandvej 140B, 2300 København', city: 'København',
      lat: 55.658541, lng: 12.6346927, phone: '+45 93 89 06 22',
      external_ref: 'ChIJB0qmbeutU0YReOf8DohKutg' }),
  L({ name: 'Itacho Sushi & Wok Amager', cuisine: 'sushi', bag_potential: 'high',
      address: 'Øresundsvej 150D, 2300 København', city: 'København',
      lat: 55.6617016, lng: 12.6302222, phone: '+45 53 66 23 00',
      external_ref: 'ChIJVxx_H9KtU0YR-jt23Ux4FVQ',
      notes: 'Itacho brand also in Solrød and Roskilde — three sites in territory, chain deal worth chasing.' }),
];

const { error, count } = await supabase.from('leads').insert(LEADS, { count: 'exact' });
if (error) {
  console.error('Insert failed:', error.message);
  process.exit(1);
}

const byPotential = LEADS.reduce((a, l) => ((a[l.bag_potential] = (a[l.bag_potential] ?? 0) + 1), a), {});
const byCity = LEADS.reduce((a, l) => ((a[l.city] = (a[l.city] ?? 0) + 1), a), {});

console.log(`✓ Seeded ${count ?? LEADS.length} verified corridor leads.\n`);
console.log('  By bag potential:', byPotential);
console.log('  By city:', byCity);
console.log('\n  Chain opportunities flagged in notes: Itacho (3 sites incl. Roskilde),');
console.log('  May\'C (2), OLIOLI (2), Sushi Amor (2), Meyers, Lagkagehuset.');
