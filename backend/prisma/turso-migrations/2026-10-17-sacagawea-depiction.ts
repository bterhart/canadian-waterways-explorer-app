// A labelled depiction for Sacagawea (owner's decision, 2026-10-17).
//   bun run prisma/turso-migrations/2026-10-17-sacagawea-depiction.ts [--apply]
//
// No likeness of Sacagawea made in her lifetime exists. The owner chose to show a labelled
// depiction instead: Leonard Crunelle's bronze "Sakakawea" (1910), carrying her son Jean Baptiste,
// which stands on the North Dakota Capitol grounds in Bismarck. The Commons photograph used is of
// the replica of that statue in the United States Capitol (Architect of the Capitol photograph,
// public domain), whose file record names the sculptor and the original. The record's text is
// extended so the reader is told what the picture is and is not. Idempotent: skips if the image
// is already set.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const FILE = "U.S. Capitol Sakakawea Statue.jpg";
const URL = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(FILE)}?width=1280`;
const LABEL = " The image shown is not a portrait: no likeness of Sacagawea made in her lifetime exists. It is Leonard Crunelle's bronze Sakakawea (1910), which shows her carrying her son Jean Baptiste and stands on the North Dakota Capitol grounds in Bismarck; the photograph is of the replica of that statue in the United States Capitol.";

async function main() {
  const f = await db.notableFigure.findFirst({ where: { name: "Sacagawea" } });
  if (!f) throw new Error("Sacagawea not found");
  const r = await fetch(URL, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } });
  const already = f.imageUrl === URL && f.significance.includes("Crunelle");
  const backupFile = writeBackup("2026-10-17-sacagawea-before", { id: f.id, imageUrl: f.imageUrl, significance: f.significance });
  report("Sacagawea depiction", { id: f.id, imageStatus: r.status, imageUrl: URL, already, newSignificanceTail: LABEL.trim().slice(0, 120) + "…", backupFile });
  if (!r.ok && r.status !== 429) throw new Error(`image URL answered ${r.status}`);
  if (already || !APPLY) return;
  await db.notableFigure.update({ where: { id: f.id }, data: { imageUrl: URL, significance: f.significance.includes("Crunelle") ? f.significance : f.significance + LABEL } });
  const after = await db.notableFigure.findFirst({ where: { id: f.id }, select: { imageUrl: true, significance: true } });
  report("verify", { imageUrl: after?.imageUrl, significanceEndsWithLabel: after?.significance.endsWith("United States Capitol.") });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
