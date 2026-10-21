-- 2026-10-21. Class content scope (spec section 10.27): what a class's students see.
-- scopeMode: 'all' (everything, the default and today's behaviour), 'bands' (only content in the
-- grade bands listed in contentBands, or the class's own band when none are listed), or
-- 'assigned' (only the lessons, quizzes and field trips the teacher assigned; other banded
-- content by band as above). contentBands is a JSON array of band labels (K-3, 4-6, 7-9, 10-12)
-- or NULL. Reference layers (map, waterways, explorers, figures, maps, timeline) are not banded
-- and are never hidden.
-- Additive only (ALTER TABLE ADD COLUMN, as 2026-10-15-student-identity.sql). Mirrors the
-- schema.prisma change of the same date.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-21-class-content-scope.sql

ALTER TABLE "Class" ADD COLUMN "scopeMode" TEXT NOT NULL DEFAULT 'all';
ALTER TABLE "Class" ADD COLUMN "contentBands" TEXT;
