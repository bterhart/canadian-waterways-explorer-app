-- 2026-10-20. Roadmap item 5, "Let the sources speak": each checked transcription is tied to the
-- exact spot on the map where its words were written or spoken, so the map can show it there and
-- a voyageur journey can quote it at the right node. Three columns on PrimarySourceDocument:
--   spotLatitude, spotLongitude — the spot (WGS84)
--   spotName                    — how the spot is described ("Mackenzie's Rock, Dean Channel")
-- Additive only (ALTER TABLE ADD COLUMN, as 2026-10-15-student-identity.sql). Mirrors the
-- schema.prisma change of the same date. Filled by 2026-10-20-voices-spots.ts.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-20-document-spot.sql

ALTER TABLE "PrimarySourceDocument" ADD COLUMN "spotLatitude" REAL;

ALTER TABLE "PrimarySourceDocument" ADD COLUMN "spotLongitude" REAL;

ALTER TABLE "PrimarySourceDocument" ADD COLUMN "spotName" TEXT;
