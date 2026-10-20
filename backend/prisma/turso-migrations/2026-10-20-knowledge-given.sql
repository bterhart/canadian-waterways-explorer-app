-- 2026-10-20. One new table, roadmap item 16 (spec section 10.4): Indigenous contributions as
-- records. A KnowledgeGiven row is one thing a named person gave an expedition: a route shown,
-- a map drawn, words interpreted, testimony recorded, a cure or a rescue, a discovery, a peace.
--   kind: route_shown | map_drawn | interpreting | testimony | medicine_survival | discovery | diplomacy
--   personName/nation are always set; figureId links the NotableFigure when there is one.
--   explorerId links the Explorer who received it (explorerName when there is no row, e.g. the
--   North-West Mounted Police); waterwayId/locationId place it; latitude/longitude when neither.
--   given: what was given, in one or two sentences. outcome: what the expedition did with it.
-- Sources are Citation rows with targetType 'knowledge_given'.
-- Mirrors the schema.prisma change of the same date. CREATE-only, idempotent.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-20-knowledge-given.sql

CREATE TABLE IF NOT EXISTS "KnowledgeGiven" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "title"        TEXT NOT NULL,
  "kind"         TEXT NOT NULL,
  "year"         INTEGER,
  "yearLabel"    TEXT,
  "personName"   TEXT NOT NULL,
  "nation"       TEXT,
  "figureId"     TEXT,
  "explorerId"   TEXT,
  "explorerName" TEXT,
  "waterwayId"   TEXT,
  "locationId"   TEXT,
  "latitude"     REAL,
  "longitude"    REAL,
  "given"        TEXT NOT NULL,
  "outcome"      TEXT,
  "sortOrder"    INTEGER NOT NULL DEFAULT 0,
  "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS "KnowledgeGiven_kind_idx" ON "KnowledgeGiven"("kind");
CREATE INDEX IF NOT EXISTS "KnowledgeGiven_figureId_idx" ON "KnowledgeGiven"("figureId");
CREATE INDEX IF NOT EXISTS "KnowledgeGiven_explorerId_idx" ON "KnowledgeGiven"("explorerId");
CREATE INDEX IF NOT EXISTS "KnowledgeGiven_waterwayId_idx" ON "KnowledgeGiven"("waterwayId");
CREATE INDEX IF NOT EXISTS "KnowledgeGiven_locationId_idx" ON "KnowledgeGiven"("locationId");
