// Remove development-only student-side rows before the single device identity goes live.
// Owner confirmed 2026-10-15 that no real students exist and none of this data needs to persist.
// Content tables (lessons, quizzes, waterways, …), Teacher, Admin, Class and ClassAssignment are NOT touched.
//
// Usage (from backend/): bun run prisma/turso-migrations/2026-10-15-wipe-dev-student-rows.ts [--apply]
// Dry run prints the row counts; --apply writes a JSON backup of every row first, then deletes.
import { createClient } from "@libsql/client";

// Child tables first (FKs are ON DELETE CASCADE, but be explicit and order-safe).
const TABLES = [
  "StudentProgress",
  "ClassStudent",
  "JournalEntry",
  "SavedLocation",
  "StudentJournal",
  "UserAchievement",
  "DailyChallengeAttempt",
  "UserJourneyProgress",
  "UserProgress",
  "MapNote",
  "MapRoute",
  "MapPin",
  "UserMapAnnotation",
  "QuizAttempt",
];

async function main() {
  const apply = process.argv.includes("--apply");
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN not set");
  const turso = createClient({ url, authToken });

  const backup: Record<string, unknown[]> = {};
  for (const t of TABLES) {
    const rows = (await turso.execute(`SELECT * FROM "${t}"`)).rows;
    backup[t] = rows.map((r) => ({ ...r }));
    console.log(`${t.padEnd(22)} ${rows.length}`);
  }
  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to back up and delete.");
    return;
  }
  const backupPath = `${import.meta.dir}/backups/2026-10-15-dev-student-rows-before.json`;
  await Bun.write(backupPath, JSON.stringify(backup, null, 2));
  console.log(`\nBackup written: ${backupPath}`);
  await turso.batch(TABLES.map((t) => `DELETE FROM "${t}"`), "write");
  for (const t of TABLES) {
    const n = (await turso.execute(`SELECT COUNT(*) n FROM "${t}"`)).rows[0]?.n;
    if (Number(n) !== 0) throw new Error(`${t} still has ${n} rows`);
  }
  console.log("Deleted; every listed table now has 0 rows.");
}

main().catch((e) => { console.error(e); process.exit(1); });
