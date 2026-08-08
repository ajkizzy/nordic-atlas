# Lead dataset inbox

Put new UTF-8 CSV or Excel (`.xlsx`) files in `inbox/`. Keep the source files
unchanged so they remain an audit trail. Use one row per restaurant and these
core columns:

```csv
Nr,Restaurant,Kategorier,Wolt URL,Phone Number,Phone Source
```

`Address` may be supplied as an additional column. `Contact Source` is accepted
as an alias for `Phone Source`. `Note` and `Notes` are accepted as optional
columns and are preserved in the imported lead notes.

Use `lead-template.csv` as the starting point. Quote a field when it contains a
comma. File names should describe the source and date, for example
`wolt-roskilde-2026-08-08.csv`.

Import mapping:

- The normalized `Wolt URL` becomes the stable external reference used to
  prevent duplicates across files. `Nr` is retained as source provenance.
- `Restaurant` becomes the lead name.
- The first comma-separated value in `Kategorier` determines the cuisine glyph.
  Portal users do not edit imported cuisine classifications manually.
- `Wolt URL` is retained as the source URL.
- `Phone Number` becomes the lead phone number.
- `Phone Source` is retained as source evidence.

When an address is absent, a lead must not be placed on the map until its
location has been verified separately. After adding files, ask Codex to import
the datasets in this inbox; successfully processed files are moved to
`imported/` with an import report.
