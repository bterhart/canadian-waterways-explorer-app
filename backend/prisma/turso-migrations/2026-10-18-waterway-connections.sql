-- 2026-10-18. One new table, on the owner's decision of the same date (spec section 9.14):
--   WaterwayConnection — a hydrological link between two waterways: a river that flows into a
--                        lake, bay or larger river (flows_into); an arm, basin or channel that is
--                        part of a larger body (part_of); a strait or channel that joins two bodies
--                        (joins); a river that is the outlet of a lake (outlet_of). The API returns
--                        a waterway's connections in both directions.
-- Mirrors the schema.prisma change of the same date. CREATE-only, idempotent.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-18-waterway-connections.sql

CREATE TABLE IF NOT EXISTS "WaterwayConnection" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "fromId"    TEXT NOT NULL,
  "toId"      TEXT NOT NULL,
  "relation"  TEXT NOT NULL,
  "notes"     TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WaterwayConnection_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Waterway" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "WaterwayConnection_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Waterway" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "WaterwayConnection_fromId_toId_relation_key" ON "WaterwayConnection"("fromId", "toId", "relation");

CREATE INDEX IF NOT EXISTS "WaterwayConnection_toId_idx" ON "WaterwayConnection"("toId");
