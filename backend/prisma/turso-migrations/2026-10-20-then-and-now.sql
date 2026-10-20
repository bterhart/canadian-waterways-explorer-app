-- 2026-10-20. One new table, roadmap item 7 (spec section 10.2): then-and-now imagery. A
-- ThenAndNow row pairs a period image of a spot with a modern photograph of the same spot, each
-- with its year, caption, credit and source page, placed on a Location or Waterway (or by
-- coordinates), with a note on what changed between the two.
-- Mirrors the schema.prisma change of the same date. CREATE-only, idempotent.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-20-then-and-now.sql

CREATE TABLE IF NOT EXISTS "ThenAndNow" (
  "id"            TEXT NOT NULL PRIMARY KEY,
  "title"         TEXT NOT NULL,
  "locationId"    TEXT,
  "waterwayId"    TEXT,
  "latitude"      REAL NOT NULL,
  "longitude"     REAL NOT NULL,
  "thenUrl"       TEXT NOT NULL,
  "thenYear"      INTEGER,
  "thenYearLabel" TEXT,
  "thenCaption"   TEXT NOT NULL,
  "thenCredit"    TEXT NOT NULL,
  "thenSourceUrl" TEXT,
  "nowUrl"        TEXT NOT NULL,
  "nowYear"       INTEGER,
  "nowCaption"    TEXT NOT NULL,
  "nowCredit"     TEXT NOT NULL,
  "nowSourceUrl"  TEXT,
  "note"          TEXT,
  "sortOrder"     INTEGER NOT NULL DEFAULT 0,
  "createdAt"     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS "ThenAndNow_locationId_idx" ON "ThenAndNow"("locationId");
CREATE INDEX IF NOT EXISTS "ThenAndNow_waterwayId_idx" ON "ThenAndNow"("waterwayId");
