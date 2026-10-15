// Normalize PrimarySourceDocument.vocabulary in Turso to one shape:
//   [{ word: string; definition: string }]
//
// Before (live, 2026-10-14 census): 14 documents store [{word, definition}],
// 34 store plain string[] (terms without definitions). A term without a
// definition becomes { word, definition: "" } — nothing is invented.
//
// Usage (from backend/, with TURSO_DATABASE_URL / TURSO_AUTH_TOKEN in the env):
//   bun run prisma/turso-migrations/2026-10-15-normalize-document-vocabulary.ts            # dry run
//   bun run prisma/turso-migrations/2026-10-15-normalize-document-vocabulary.ts --apply    # backup, then write
// Idempotent: rows already canonical are left untouched.
import { createClient } from "@libsql/client";

export interface VocabularyTerm {
  word: string;
  definition: string;
}

export function normalizeTerm(raw: unknown): VocabularyTerm {
  if (typeof raw === "string") {
    // Live strings are "term: definition" (e.g. "aurora borealis: Northern Lights");
    // split on the first ": ". A string without one keeps an empty definition.
    const idx = raw.indexOf(": ");
    if (idx > 0) {
      return { word: raw.slice(0, idx).trim(), definition: raw.slice(idx + 2).trim() };
    }
    return { word: raw.trim(), definition: "" };
  }
  const o = (raw ?? {}) as Record<string, unknown>;
  const word = typeof o.word === "string" ? o.word.trim()
    : typeof o.term === "string" ? o.term.trim() : "";
  const definition = typeof o.definition === "string" ? o.definition.trim() : "";
  return { word, definition };
}

export function normalizeList(json: string | null): VocabularyTerm[] | null {
  if (json === null || json === undefined) return null;
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error(`vocabulary column is not a JSON array: ${json.slice(0, 60)}`);
  return parsed.map(normalizeTerm).filter((t) => t.word.length > 0);
}

const isCanonical = (json: string | null): boolean =>
  json === null || JSON.stringify(normalizeList(json)) === JSON.stringify(JSON.parse(json));

async function main() {
  const apply = process.argv.includes("--apply");
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN not set");
  const turso = createClient({ url, authToken });

  const rows = (await turso.execute("SELECT id, title, vocabulary FROM PrimarySourceDocument ORDER BY title")).rows;
  const changes: { id: string; title: string; before: string; after: string }[] = [];
  let strings = 0;
  for (const r of rows) {
    const before = r.vocabulary === null ? null : String(r.vocabulary);
    if (before === null || isCanonical(before)) continue;
    for (const v of JSON.parse(before) as unknown[]) if (typeof v === "string") strings++;
    changes.push({ id: String(r.id), title: String(r.title), before, after: JSON.stringify(normalizeList(before)) });
  }
  console.log(`${rows.length} documents; ${changes.length} vocabulary values need normalizing (${strings} bare terms -> objects)`);
  for (const ch of changes.slice(0, 2)) {
    console.log(`\n--- ${ch.title}`);
    console.log("before:", ch.before.slice(0, 140));
    console.log("after: ", ch.after.slice(0, 140));
  }
  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to write.");
    return;
  }
  const backupPath = `${import.meta.dir}/backups/2026-10-15-document-vocabulary-before.json`;
  await Bun.write(backupPath, JSON.stringify(rows.map((r) => ({ id: r.id, title: r.title, vocabulary: r.vocabulary })), null, 2));
  console.log(`\nBackup written: ${backupPath}`);
  await turso.batch(changes.map((ch) => ({ sql: "UPDATE PrimarySourceDocument SET vocabulary = ? WHERE id = ?", args: [ch.after, ch.id] })), "write");
  console.log(`Applied ${changes.length} updates in one batch.`);
  const after = (await turso.execute("SELECT vocabulary FROM PrimarySourceDocument")).rows;
  const remaining = after.filter((r) => !isCanonical(r.vocabulary === null ? null : String(r.vocabulary))).length;
  console.log(`Verification: rows still non-canonical = ${remaining}`);
  if (remaining !== 0) process.exit(1);
}

if (import.meta.main) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
