// Merge the two NotableFigure rows named "Matonabbee" in Turso into one.
//
// Live census 2026-10-15: 19 NotableFigure rows, 18 distinct names. Matonabbee exists
// twice:
//   - "matonabbee_leader" (hand-written id like the other *_leader rows): has the R2
//     portrait, short biography/significance, no achievements/locations/explorers.
//   - "cmlhvyhgy0005m2vxb41rnqqp": no image, longer biography and significance, plus
//     birthPlace, associatedExplorers, achievements, associatedLocations, active period,
//     isFeatured = true.
// Nothing references NotableFigure by id (no foreign keys; the waterway/location routes
// match on names), so the merge keeps the stable id "matonabbee_leader", copies every
// field the other row has and this one lacks (taking the longer biography and
// significance), then deletes the cuid row. Both rows are backed up first.
//
// Usage (from backend/, with TURSO_DATABASE_URL / TURSO_AUTH_TOKEN in the env):
//   bun run prisma/turso-migrations/2026-10-15-merge-duplicate-matonabbee.ts            # dry run
//   bun run prisma/turso-migrations/2026-10-15-merge-duplicate-matonabbee.ts --apply    # backup, then write
// Idempotent: with one Matonabbee row left it reports "nothing to do".
import { createClient } from "@libsql/client";

const KEEP_ID = "matonabbee_leader";
const DROP_ID = "cmlhvyhgy0005m2vxb41rnqqp";

type Row = Record<string, unknown>;

/** Fields to fill on KEEP from DROP when KEEP's value is null/empty. */
const FILL_IF_EMPTY = [
  "alternateNames",
  "birthPlace",
  "associatedExplorers",
  "achievements",
  "associatedLocations",
  "activePeriodStart",
  "activePeriodEnd",
  "imageUrl",
] as const;

/** Text fields where the longer of the two versions wins. */
const LONGER_WINS = ["biography", "significance", "role"] as const;

export function mergeRows(keep: Row, drop: Row): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of FILL_IF_EMPTY) {
    const k = keep[f];
    const d = drop[f];
    if ((k === null || k === undefined || k === "") && d !== null && d !== undefined && d !== "") out[f] = d;
  }
  for (const f of LONGER_WINS) {
    const k = String(keep[f] ?? "");
    const d = String(drop[f] ?? "");
    if (d.length > k.length) out[f] = d;
  }
  if (Number(drop.isFeatured) === 1 && Number(keep.isFeatured) !== 1) out.isFeatured = 1;
  return out;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN not set");
  const turso = createClient({ url, authToken });

  const rows = (await turso.execute("SELECT * FROM NotableFigure WHERE name = 'Matonabbee'")).rows as Row[];
  console.log(`Matonabbee rows: ${rows.length} (${rows.map((r) => r.id).join(", ")})`);
  const keep = rows.find((r) => r.id === KEEP_ID);
  const drop = rows.find((r) => r.id === DROP_ID);
  if (rows.length === 1 && keep) {
    console.log("Already merged; nothing to do.");
    return;
  }
  if (!keep || !drop || rows.length !== 2) throw new Error("Unexpected row set; refusing to continue.");

  const changes = mergeRows(keep, drop);
  console.log(`\nFields to set on ${KEEP_ID}:`);
  for (const [k, v] of Object.entries(changes)) console.log(`  ${k}: ${String(v).slice(0, 100)}`);
  console.log(`Then DELETE ${DROP_ID}.`);
  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to write.");
    return;
  }

  const backupPath = `${import.meta.dir}/backups/2026-10-15-matonabbee-rows-before.json`;
  await Bun.write(backupPath, JSON.stringify(rows, null, 2));
  console.log(`\nBackup written: ${backupPath}`);

  const sets = Object.keys(changes).map((k) => `${k} = ?`);
  sets.push("updatedAt = ?");
  const args = [...Object.values(changes), new Date().toISOString(), KEEP_ID] as (string | number | null)[];
  await turso.batch(
    [
      { sql: `UPDATE NotableFigure SET ${sets.join(", ")} WHERE id = ?`, args },
      { sql: "DELETE FROM NotableFigure WHERE id = ?", args: [DROP_ID] },
    ],
    "write"
  );
  const after = (await turso.execute("SELECT id, imageUrl, isFeatured, length(biography) AS bio FROM NotableFigure WHERE name = 'Matonabbee'")).rows;
  console.log("Verification:", JSON.stringify(after));
  if (after.length !== 1 || after[0]!.id !== KEEP_ID) process.exit(1);
}

if (import.meta.main) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
