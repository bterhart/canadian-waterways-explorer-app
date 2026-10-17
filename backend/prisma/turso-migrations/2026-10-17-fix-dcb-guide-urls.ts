// Correct two Dictionary of Canadian Biography reading-guide URLs written with guessed slugs
// (2026-10-17). biographi.ca answers 200 with a "Biography not found" page for any slug, so
// a status check did not catch them; this session checked every DCB guide URL in Turso by
// page title and found these three rows (two URLs) wrong.
//   bun run prisma/turso-migrations/2026-10-17-fix-dcb-guide-urls.ts [--apply]
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const FIXES: Record<string, string> = {
  "https://www.biographi.ca/en/bio/tonty_henri_de_2E.html": "https://www.biographi.ca/en/bio/tonty_henri_2E.html",
  "https://www.biographi.ca/en/bio/tessouat_1603_1613_1E.html": "https://www.biographi.ca/en/bio/tessouat_1636_1E.html",
};

async function main() {
  const rows = await db.readingGuide.findMany({ where: { url: { in: Object.keys(FIXES) } }, select: { id: true, title: true, url: true } });
  const problems: string[] = [];
  for (const url of new Set(Object.values(FIXES))) {
    const html = await (await fetch(url, { headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } })).text();
    if (/<title>Biography not found/.test(html)) problems.push(`replacement still not found: ${url}`);
  }
  const backupFile = writeBackup("2026-10-17-fix-dcb-guide-urls-before", { rows });
  report("fix DCB guide URLs", { rows: rows.map((r) => `${r.id} | ${r.title} | ${r.url} → ${FIXES[r.url!]}`), problems, backupFile });
  if (problems.length) throw new Error("Fix the replacements first.");
  if (!APPLY) return;
  await db.$transaction(async (tx) => { for (const r of rows) await tx.readingGuide.update({ where: { id: r.id }, data: { url: FIXES[r.url!]! } }); });
  report("verify", { stillWrong: await db.readingGuide.count({ where: { url: { in: Object.keys(FIXES) } } }), fixed: await db.readingGuide.count({ where: { url: { in: Object.values(FIXES) } } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
