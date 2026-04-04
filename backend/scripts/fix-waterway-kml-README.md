# fix-waterway-kml.ts

One-off helper to inspect, filter, write, apply, or clear KML for a single waterway row.

## Save to

- `backend/scripts/fix-waterway-kml.ts`

## Modes

### Dry-run
Parses the input KML, applies an optional filter, and prints a JSON summary.

```bash
bun run scripts/fix-waterway-kml.ts \
  --mode=dry-run \
  --waterway-id=<id> \
  --name="Churchill River (Saskatchewan)" \
  --input="../Churchill_River.kml" \
  --filter=churchill-west
```

### Write filtered KML to a file
```bash
bun run scripts/fix-waterway-kml.ts \
  --mode=write-kml \
  --waterway-id=<id> \
  --name="Churchill River (Saskatchewan)" \
  --input="../Churchill_River.kml" \
  --filter=churchill-west \
  --out="generated/Churchill_River_Saskatchewan.cleaned.kml"
```

### Apply filtered KML directly to the DB
```bash
bun run scripts/fix-waterway-kml.ts \
  --mode=apply \
  --waterway-id=<id> \
  --name="Churchill River (Saskatchewan)" \
  --input="../Churchill_River.kml" \
  --filter=churchill-west
```

### Clear bad KML from a row
```bash
bun run scripts/fix-waterway-kml.ts \
  --mode=clear \
  --waterway-id=<id> \
  --name="Mackenzie River"
```

## Filters

### `none`
No filtering. Keeps all placemarks.

### `churchill-west`
Keeps only the western Churchill system placemarks. This is appropriate for the mixed file where western Churchill geometry sits around roughly `-108 .. -95` longitude and Labrador geometry sits around `-65 .. -60`.

## Recommended sequence for your current cleanup

### Churchill
1. Dry-run with `churchill-west`
2. Write cleaned KML to `generated/...`
3. Apply to the `Churchill River (Saskatchewan)` row
4. Regenerate `generated/river-overview.json`
5. Redeploy preview backend

### Mackenzie
1. Clear the incorrect Ontario KML from the NWT `Mackenzie River` row
2. Leave the row without KML until the correct Arctic Mackenzie KML is sourced
3. Regenerate `generated/river-overview.json`
4. Redeploy preview backend
