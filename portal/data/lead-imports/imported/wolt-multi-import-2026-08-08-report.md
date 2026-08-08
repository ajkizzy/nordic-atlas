# Wolt multi-dataset import report

Import date: 2026-08-08

## Result

- Processed 1,275 rows from seven CSV/XLSX files.
- Found 1,163 unique normalized Wolt URLs; 112 rows repeated a URL present in another file.
- Verified 1,119 physical Wolt venue locations. Supplied addresses were checked with Dataforsyningen; addressless or initially unresolved rows were recovered from Wolt's structured venue address and coordinates.
- Stored 1,100 Wolt leads. Nineteen additional source URLs were intentionally merged into existing nodes with the same normalized restaurant name and address: seventeen existing manual Roskilde leads and two Wolt records already represented under another source URL.
- The live database contains 1,127 leads, including 1,100 Wolt leads.
- Imported Wolt names, addresses, cities, and notes were rewritten from the UTF-8 source to repair the original mojibake encoding. The final check found zero malformed Wolt text rows.
- Post-import checks found zero duplicate external references and zero duplicate normalized name/address groups.
- Existing lead status, assignment, ownership, and client links were not overwritten.

## Source files

| File | Rows | Verified unique venues represented |
| --- | ---: | ---: |
| `Wolt_Allerod_med_adresser_og_telefonnumre.xlsx` | 108 | 102 |
| `Wolt_Ballerup_med_telefonnumre.xlsx` | 192 | 192 |
| `Wolt_Birkerod_med_adresser_og_telefonnumre.csv` | 152 | 142 |
| `Wolt_Copenhagen_med_adresser_og_telefonnumre.xlsx` | 678 | 646 |
| `Wolt_Frederiksvaerk_med_adresser_og_telefonnumre.csv` | 13 | 13 |
| `Wolt_KOGE_med_telefonnumre.xlsx` | 48 | 47 |
| `Wolt_Roskilde_med_telefonnumre.xlsx` | 84 | 83 |

A venue can be represented by more than one source file, so the final column is not additive.

## Exclusions

- 43 virtual venues were not placed on the physical map.
- Addressless and initially unresolved rows were only imported when Wolt returned a concrete structured address and coordinates. No location was inferred from a restaurant name alone.
- Milas Pizzaria remains the separately documented food-truck lead with an approximate, unverified marker; no permanent street address was inferred from these datasets.
- The optional `Note` columns in the supplied CSV files were parsed successfully but contained no populated values in this batch.

## Duplicate handling

Imports use a normalized Wolt URL as `external_ref`. The database also enforces a unique normalized restaurant-name/address pair. This protects against duplicates both within one file and across independently supplied datasets.
