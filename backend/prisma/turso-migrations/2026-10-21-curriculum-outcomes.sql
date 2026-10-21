-- 2026-10-21. Two new tables, roadmap item 9 (spec section 10.3): curriculum alignment by
-- province. A CurriculumOutcome row is one outcome (expectation, learning standard, knowledge
-- element) quoted from a province's published social-studies or history curriculum, with the
-- province, grade or course, strand, the ministry's code where the document has one, the text
-- as published, and the source. A LessonOutcome row maps a lesson plan to an outcome, with an
-- optional note on how the lesson meets it. Teachers search outcomes by province, grade and
-- code, and lesson plans by outcome.
-- Mirrors the schema.prisma change of the same date. CREATE-only, idempotent.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-21-curriculum-outcomes.sql

CREATE TABLE IF NOT EXISTS "CurriculumOutcome" (
  "id"          TEXT NOT NULL PRIMARY KEY,
  "province"    TEXT NOT NULL,
  "grade"       TEXT NOT NULL,
  "course"      TEXT NOT NULL,
  "strand"      TEXT,
  "code"        TEXT,
  "text"        TEXT NOT NULL,
  "kind"        TEXT NOT NULL DEFAULT 'expectation',
  "sourceTitle" TEXT NOT NULL,
  "sourceUrl"   TEXT NOT NULL,
  "sourceYear"  TEXT,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   DATETIME NOT NULL
);
CREATE INDEX IF NOT EXISTS "CurriculumOutcome_province_grade_idx" ON "CurriculumOutcome"("province", "grade");
CREATE INDEX IF NOT EXISTS "CurriculumOutcome_code_idx" ON "CurriculumOutcome"("code");

CREATE TABLE IF NOT EXISTS "LessonOutcome" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "lessonPlanId" TEXT NOT NULL,
  "outcomeId"    TEXT NOT NULL,
  "note"         TEXT,
  "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "LessonOutcome_lessonPlanId_outcomeId_key" ON "LessonOutcome"("lessonPlanId", "outcomeId");
CREATE INDEX IF NOT EXISTS "LessonOutcome_outcomeId_idx" ON "LessonOutcome"("outcomeId");
