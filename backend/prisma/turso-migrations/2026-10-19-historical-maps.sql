-- 2026-10-19. One new table, roadmap item 15 (spec section 10.5), the cartography gallery:
--   HistoricalMap — a map that made the country: title, mapmaker, year, what it shows and what it
--                   got wrong, the Commons image with credit and licence, the source record, the
--                   region, optional overlay bounds (south-west and north-east corners) for drawing
--                   it over the live map, and the waterways and explorers it relates to (JSON id
--                   arrays). Indigenous-made maps are entries like any other, with the mapmaker named.
-- Mirrors the schema.prisma change of the same date. CREATE-only, idempotent.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-19-historical-maps.sql

CREATE TABLE IF NOT EXISTS "HistoricalMap" (
  "id"                 TEXT NOT NULL PRIMARY KEY,
  "title"              TEXT NOT NULL,
  "mapmaker"           TEXT NOT NULL,
  "mapmakerNation"     TEXT,
  "cartographerId"     TEXT,
  "year"               INTEGER NOT NULL,
  "yearLabel"          TEXT,
  "description"        TEXT NOT NULL,
  "whatItShows"        TEXT,
  "whatItGotWrong"     TEXT,
  "region"             TEXT,
  "imageUrl"           TEXT NOT NULL,
  "imageCredit"        TEXT NOT NULL,
  "imageLicense"       TEXT NOT NULL,
  "sourceUrl"          TEXT,
  "sourceNote"         TEXT,
  "boundsSwLat"        REAL,
  "boundsSwLng"        REAL,
  "boundsNeLat"        REAL,
  "boundsNeLng"        REAL,
  "relatedWaterwayIds" TEXT,
  "relatedExplorerIds" TEXT,
  "sortOrder"          INTEGER NOT NULL DEFAULT 0,
  "createdAt"          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          DATETIME NOT NULL,
  CONSTRAINT "HistoricalMap_cartographerId_fkey" FOREIGN KEY ("cartographerId") REFERENCES "Cartographer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "HistoricalMap_year_idx" ON "HistoricalMap"("year");
