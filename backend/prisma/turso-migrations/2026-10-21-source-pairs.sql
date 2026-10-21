-- 2026-10-21. Primary-source literacy unit (roadmap item 10, spec section 10.29). A SourcePair row
-- puts the passage a document first carried in the seed data (quoted, never checked) beside the
-- sentences as published in the edition the document now cites, with the kind of difference and a
-- student task. The published text is the document's live transcription; only the seed side and
-- the notes live here. CREATE-only, idempotent. Mirrors the schema.prisma change of the same date.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-21-source-pairs.sql

CREATE TABLE IF NOT EXISTS "SourcePair" (
  "id"           TEXT NOT NULL PRIMARY KEY,
  "documentId"   TEXT NOT NULL,
  "seedTitle"    TEXT NOT NULL,
  "seedText"     TEXT NOT NULL,
  "kind"         TEXT NOT NULL,
  "whatChanged"  TEXT NOT NULL,
  "task"         TEXT NOT NULL,
  "gradeLevel"   TEXT,
  "sortOrder"    INTEGER NOT NULL DEFAULT 0,
  "isPublished"  BOOLEAN NOT NULL DEFAULT 1,
  "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    DATETIME NOT NULL
);
CREATE INDEX IF NOT EXISTS "SourcePair_documentId_idx" ON "SourcePair"("documentId");
CREATE INDEX IF NOT EXISTS "SourcePair_kind_idx" ON "SourcePair"("kind");
