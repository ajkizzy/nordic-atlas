# Wolt Allerod import report

Source: `Wolt_Allerød_med_adresser_og_telefonnumre.xlsx`

- Source rows: 108
- Imported: 90
- Existing lead matches: 0
- Constraint skips: 0
- Excluded virtual venues: 9
- Excluded unverified addresses: 9

Imported rows received stable `wolt:` external references. The database now
rejects duplicate source references and duplicate normalized name/address
pairs. Phone numbers are not unique because separate brands can legitimately
share a central number or kitchen.

## Virtual venues not mapped

- 10 - Ella Pizza Allerod
- 27 - Ella Pizza Lynge
- 28 - Ella Pizza Bistrupvej
- 30 - Ella Pizza Farum
- 31 - Ella Pizza Ballerupvej
- 33 - Ella Pizza Usserod Kongevej
- 36 - Ella Pizza Hillerod
- 93 - Deli Shoppen Catering
- 105 - Cheeky Chicken Frederiksborgvej

## Addresses not verified

- 7 - La Qualita - Bistrupvej 32, 3460 Birkerod-Farum
- 19 - Montalbano - Helsingorsgade 19, 3400 Hillerod
- 24 - Pizza Pizza Hillerod - Tamsborgvej 19, 3400 Hillerod
- 34 - Piccante Gastronomia - Usserod Kongevej 46, 2970 Horsholm-Rungsted
- 64 - La Tre Birkerod - Hovedgaden 41, 3460 Birkerod
- 69 - India Imperial Birkerod - Vasevej 105, 3460 Birkerod-Farum
- 73 - Mr Singh's Indisk kokken - Slotsgade 57, 3400 Hillerod
- 89 - Cafe Kaiser Hillerod - Slotsakaderne 52, 3400 Hillerod
- 92 - Hestkobgaard Cafe & Bistro - Hestekob vaenge 4, 3460 Birkerod-Farum

No approximate coordinates were created for these rows. They can be imported
later after a permanent operating address is confirmed.
