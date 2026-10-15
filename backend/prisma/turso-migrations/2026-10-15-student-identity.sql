-- Student identity (design "Option A", 2026-10-15): one anonymous device id per
-- install. Two nullable columns let the server attribute class membership and quiz
-- attempts to that id. Mirrors the schema.prisma change of the same date.
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-15-student-identity.sql

ALTER TABLE "ClassStudent" ADD COLUMN "userId" TEXT;

CREATE INDEX "ClassStudent_userId_idx" ON "ClassStudent"("userId");

ALTER TABLE "QuizAttempt" ADD COLUMN "userId" TEXT;

CREATE INDEX "QuizAttempt_userId_idx" ON "QuizAttempt"("userId");
