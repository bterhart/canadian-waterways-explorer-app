-- 2026-10-19. Two new tables, roadmap item 2 (spec section 10.5), the expedition route layer:
--   Expedition    — a dated journey by one explorer: name, years, summary, colour on the map, and
--                   the source the legs were ordered from.
--   ExpeditionLeg — one waterway on that journey, in order, with the year, an optional historic
--                   place on it, and a note. The app draws each leg's waterway geometry in order.
-- Mirrors the schema.prisma change of the same date. CREATE-only, idempotent.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-19-expeditions.sql

CREATE TABLE IF NOT EXISTS "Expedition" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "explorerId" TEXT NOT NULL,
  "name"       TEXT NOT NULL,
  "startYear"  INTEGER NOT NULL,
  "endYear"    INTEGER,
  "summary"    TEXT NOT NULL,
  "color"      TEXT,
  "source"     TEXT,
  "sortOrder"  INTEGER NOT NULL DEFAULT 0,
  "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  DATETIME NOT NULL,
  CONSTRAINT "Expedition_explorerId_fkey" FOREIGN KEY ("explorerId") REFERENCES "Explorer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Expedition_explorerId_idx" ON "Expedition"("explorerId");

CREATE TABLE IF NOT EXISTS "ExpeditionLeg" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "expeditionId" TEXT NOT NULL,
  "orderIndex"   INTEGER NOT NULL,
  "waterwayId"   TEXT NOT NULL,
  "locationId"   TEXT,
  "year"         INTEGER,
  "notes"        TEXT,
  "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExpeditionLeg_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ExpeditionLeg_waterwayId_fkey" FOREIGN KEY ("waterwayId") REFERENCES "Waterway" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ExpeditionLeg_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ExpeditionLeg_expeditionId_orderIndex_key" ON "ExpeditionLeg"("expeditionId", "orderIndex");

CREATE INDEX IF NOT EXISTS "ExpeditionLeg_waterwayId_idx" ON "ExpeditionLeg"("waterwayId");
