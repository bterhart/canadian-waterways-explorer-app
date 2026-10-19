-- 2026-10-19. One new table, roadmap item 14 (spec section 10.5):
--   Citation — a structured source for a record: what the record was written from and cites.
--              targetType: waterway | location | explorer | notable_figure | document | discovery.
--              kind: dcb | encyclopedia | edition | archive | place_name_record | parks_canada |
--                    book | article | web.
--              The API formats rows as text, BibTeX, RIS and CSV.
-- Mirrors the schema.prisma change of the same date. CREATE-only, idempotent.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-19-citations.sql

CREATE TABLE IF NOT EXISTS "Citation" (
  "id"         TEXT NOT NULL PRIMARY KEY,
  "targetType" TEXT NOT NULL,
  "targetId"   TEXT NOT NULL,
  "sortOrder"  INTEGER NOT NULL DEFAULT 0,
  "kind"       TEXT NOT NULL,
  "author"     TEXT,
  "title"      TEXT NOT NULL,
  "container"  TEXT,
  "publisher"  TEXT,
  "year"       TEXT,
  "pages"      TEXT,
  "url"        TEXT,
  "accessed"   TEXT,
  "note"       TEXT,
  "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS "Citation_targetType_targetId_idx" ON "Citation"("targetType", "targetId");
