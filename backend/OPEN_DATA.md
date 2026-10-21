# Open data

The records behind the app are available read-only, as they stand in the live database, from the
production server:

- Human page, licence, scope and every dataset with its fields:
  `https://canadian-waterways-explorer-app-production.up.railway.app/open-data`
- Machine index (JSON): `/api/open-data`
- One dataset: `/api/open-data/<key>.csv`, `.json`, or `.geojson` where the rows carry coordinates

Licence: Creative Commons Attribution 4.0 (CC BY 4.0). Attribution: *Canadian Interactive
Waterways Initiative, open data, CC BY 4.0*. What the licence covers, and what is referenced rather
than relicensed, is stated on the page and in the index; the dataset list, the fields and the
licence text live in one place, `src/lib/open-data.ts`, so the page, the index and the files cannot
drift from each other.

Responses are cached ten minutes in memory and carry `Cache-Control` to match. Nothing about users,
classes, teachers, journals or progress is exported, nor the provincial curriculum outcomes or the
teaching material.
