-- 2026-10-16. Two new tables, both decided in the content sweep:
--   ReadingGuide     — the "Additional Study" bibliographies move out of the two static
--                      files in the app binary (decision 12) so new places and people
--                      need no build. One row per entry, keyed by target type and id.
--   UserExploration  — one row per (device, activity, record) so the server can award
--                      waterway/location/document/pronunciation points once (decision 9).
-- Mirrors the schema.prisma change of the same date. CREATE-only, idempotent.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-16-reading-guides-and-exploration.sql

CREATE TABLE IF NOT EXISTS "ReadingGuide" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "targetType"   TEXT NOT NULL,
  "targetId"     TEXT NOT NULL,
  "sortOrder"    INTEGER NOT NULL DEFAULT 0,
  "title"        TEXT NOT NULL,
  "authorSource" TEXT,
  "publisher"    TEXT,
  "year"         TEXT,
  "url"          TEXT,
  "description"  TEXT,
  "gradeLevel"   TEXT,
  "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS "ReadingGuide_targetType_targetId_idx" ON "ReadingGuide"("targetType", "targetId");

CREATE TABLE IF NOT EXISTS "UserExploration" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "userId"       TEXT NOT NULL,
  "activityType" TEXT NOT NULL,
  "resourceId"   TEXT NOT NULL,
  "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserExploration_userId_activityType_resourceId_key" ON "UserExploration"("userId", "activityType", "resourceId");

CREATE INDEX IF NOT EXISTS "UserExploration_userId_idx" ON "UserExploration"("userId");
