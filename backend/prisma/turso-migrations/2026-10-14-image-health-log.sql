-- ImageHealthLog: declared in schema.prisma but never created in Turso.
-- Written by src/jobs/image-health-check.ts (nightly) and read by
-- src/routes/admin-image-health.ts. Column types/defaults mirror what the
-- query library generates for the sqlite provider (see existing tables).
-- Apply with: bun run scripts/push-turso-schema.ts prisma/turso-migrations/2026-10-14-image-health-log.sql

CREATE TABLE "ImageHealthLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "model" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "resolvedUrl" TEXT
);

CREATE INDEX "ImageHealthLog_checkedAt_idx" ON "ImageHealthLog"("checkedAt");

CREATE INDEX "ImageHealthLog_status_idx" ON "ImageHealthLog"("status");

CREATE INDEX "ImageHealthLog_model_recordId_idx" ON "ImageHealthLog"("model", "recordId");
