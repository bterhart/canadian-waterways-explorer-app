-- 2026-10-20. Roadmap item 6, "Finish the journeys": a voyageur journey's stops are tied to the
-- app's own records and its choices are scored against what happened, with the source.
-- JourneyNode gains the links and the source of the stop; VoyageurJourney gains the source of
-- the journey. (Choices stay JSON in JourneyNode.choices; each choice gains `whatHappened` and
-- `source` fields there, no column needed.)
-- Additive only (ALTER TABLE ADD COLUMN, as 2026-10-15-student-identity.sql). Mirrors the
-- schema.prisma change of the same date.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-20-journey-links.sql

ALTER TABLE "JourneyNode" ADD COLUMN "locationId" TEXT;

ALTER TABLE "JourneyNode" ADD COLUMN "waterwayId" TEXT;

ALTER TABLE "JourneyNode" ADD COLUMN "explorerId" TEXT;

ALTER TABLE "JourneyNode" ADD COLUMN "documentId" TEXT;

ALTER TABLE "JourneyNode" ADD COLUMN "knowledgeId" TEXT;

ALTER TABLE "JourneyNode" ADD COLUMN "source" TEXT;

ALTER TABLE "JourneyNode" ADD COLUMN "sourceUrl" TEXT;

ALTER TABLE "VoyageurJourney" ADD COLUMN "source" TEXT;

ALTER TABLE "VoyageurJourney" ADD COLUMN "sourceUrl" TEXT;
