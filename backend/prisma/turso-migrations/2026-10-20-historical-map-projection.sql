-- 2026-10-20. Two columns on HistoricalMap, owner's instruction of the same day: record each
-- sheet's map projection, because the difference between these sheets and Mercator's projection
-- (on which the live map is drawn) is itself part of the story the gallery tells.
--   projection      — short label: "Mercator", "Plate carrée", "Trapezoidal (Paris meridian)",
--                     "Conic, apex above the sheet", "Plane chart (Dieppe school)" ...
--   projectionNote  — a sentence or two on how the sheet is constructed, read from its graticule,
--                     and how (or whether) it was re-projected for the overlay.
-- Additive only (ALTER TABLE ADD COLUMN, as 2026-10-15-student-identity.sql). Mirrors the
-- schema.prisma change of the same date.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-20-historical-map-projection.sql

ALTER TABLE "HistoricalMap" ADD COLUMN "projection" TEXT;

ALTER TABLE "HistoricalMap" ADD COLUMN "projectionNote" TEXT;
