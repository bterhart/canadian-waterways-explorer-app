// Normalize LessonPlan.activities and LessonPlan.teacherActivities in Turso to one shape:
//   { title: string; description: string; duration: string | null; materials: string[] }
//
// Before (live, 2026-10-14): 97 objects keyed {name, description, duration},
// 100 keyed {title, description, duration, materials} with materials as a
// comma-separated STRING in 96 of them, and 4 bare strings.
//
// Usage (from backend/, with TURSO_DATABASE_URL / TURSO_AUTH_TOKEN in the env):
//   bun run prisma/turso-migrations/2026-10-14-normalize-lesson-activities.ts            # dry run, prints the diff
//   bun run prisma/turso-migrations/2026-10-14-normalize-lesson-activities.ts --apply    # writes; backup written first
// Idempotent: rows already in canonical shape are left untouched.
import { createClient } from "@libsql/client";

export interface CanonicalActivity {
  title: string;
  description: string;
  duration: string | null;
  materials: string[];
}

/** Split "a, b (c, d), e" into ["a", "b (c, d)", "e"] — commas inside parentheses are kept. */
export function splitMaterials(text: string): string[] {
  const items: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of text) {
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      items.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  items.push(current);
  return items.map((s) => s.trim()).filter((s) => s.length > 0);
}

export function normalizeActivity(raw: unknown): CanonicalActivity {
  if (typeof raw === "string") {
    // Bare instruction sentence: keep it verbatim as the title; nothing is invented.
    return { title: raw.trim(), description: "", duration: null, materials: [] };
  }
  const a = (raw ?? {}) as Record<string, unknown>;
  const title = typeof a.title === "string" && a.title.trim() ? a.title.trim()
    : typeof a.name === "string" ? a.name.trim() : "";
  const description = typeof a.description === "string" ? a.description.trim() : "";
  const duration = typeof a.duration === "string" && a.duration.trim() ? a.duration.trim()
    : typeof a.duration === "number" ? `${a.duration} minutes` : null;
  let materials: string[] = [];
  if (Array.isArray(a.materials)) materials = a.materials.map((m) => String(m).trim()).filter(Boolean);
  else if (typeof a.materials === "string") materials = splitMaterials(a.materials);
  return { title, description, duration, materials };
}

export function normalizeList(json: string | null): CanonicalActivity[] | null {
  if (json === null || json === undefined) return null;
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error(`activities column is not a JSON array: ${json.slice(0, 60)}`);
  return parsed.map(normalizeActivity);
}

const isCanonical = (json: string | null): boolean =>
  json === null || JSON.stringify(normalizeList(json)) === JSON.stringify(JSON.parse(json));

async function main() {
  const apply = process.argv.includes("--apply");
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN not set");
  const turso = createClient({ url, authToken });

  const rows = (await turso.execute("SELECT id, title, activities, teacherActivities FROM LessonPlan ORDER BY title")).rows;
  const changes: { id: string; title: string; column: string; before: string; after: string }[] = [];
  let strings = 0, renamed = 0, splitMats = 0;

  for (const r of rows) {
    for (const column of ["activities", "teacherActivities"] as const) {
      const before = r[column] === null ? null : String(r[column]);
      if (before === null || isCanonical(before)) continue;
      const parsed = JSON.parse(before) as unknown[];
      for (const a of parsed) {
        if (typeof a === "string") strings++;
        else if (a && typeof a === "object") {
          const o = a as Record<string, unknown>;
          if (!("title" in o) && "name" in o) renamed++;
          if (typeof o.materials === "string") splitMats++;
        }
      }
      changes.push({ id: String(r.id), title: String(r.title), column, before, after: JSON.stringify(normalizeList(before)) });
    }
  }

  console.log(`${rows.length} lesson plans; ${changes.length} column values need normalizing`);
  console.log(`  bare strings -> objects: ${strings}; name -> title: ${renamed}; materials string -> array: ${splitMats}`);
  for (const ch of changes.slice(0, 3)) {
    console.log(`\n--- ${ch.title} / ${ch.column}`);
    console.log("before:", ch.before.slice(0, 160) + (ch.before.length > 160 ? "…" : ""));
    console.log("after: ", ch.after.slice(0, 160) + (ch.after.length > 160 ? "…" : ""));
  }

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to write.");
    return;
  }

  const backupPath = `${import.meta.dir}/backups/2026-10-14-lesson-activities-before.json`;
  await Bun.write(backupPath, JSON.stringify(rows.map((r) => ({ id: r.id, title: r.title, activities: r.activities, teacherActivities: r.teacherActivities })), null, 2));
  console.log(`\nBackup written: ${backupPath}`);

  const stmts = changes.map((ch) => ({
    sql: `UPDATE LessonPlan SET "${ch.column}" = ? WHERE id = ?`,
    args: [ch.after, ch.id],
  }));
  await turso.batch(stmts, "write");
  console.log(`Applied ${stmts.length} updates in one batch.`);

  // Verify: nothing left to normalize
  const after = (await turso.execute("SELECT activities, teacherActivities FROM LessonPlan")).rows;
  const remaining = after.filter((r) => !isCanonical(r.activities === null ? null : String(r.activities)) || !isCanonical(r.teacherActivities === null ? null : String(r.teacherActivities))).length;
  console.log(`Verification: rows still non-canonical = ${remaining}`);
  if (remaining !== 0) process.exit(1);
}

if (import.meta.main) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
