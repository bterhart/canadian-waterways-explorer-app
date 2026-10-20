// Housekeeping (owner, 2026-10-20): "The Dubawnt River has no narration." It has one: Tyrrell's
// Journal of the Barren Lands Expedition, July 1893, spotted at Carey Lake on the Dubawnt, but
// the document was never linked to the waterway, so the Dubawnt's sheet showed no voice. The
// sweep of all 27 checked transcriptions found this and one other unlinked document, Joutel's
// account of La Salle's death near Navasota, Texas, which has no waterway in the app to link to
// and stays as it is (on the map at its spot).
//   bun run prisma/turso-migrations/2026-10-20-voices-links.ts [--apply]
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const LINKS: { documentId: string; waterwayId: string }[] = [
  { documentId: "cmlmsw8u50009m22so1t62x1f", waterwayId: "ww_dubawnt-river" },
];

async function main() {
  const plan: Record<string, unknown>[] = [];
  const problems: string[] = [];
  for (const link of LINKS) {
    const [doc, waterway] = await Promise.all([
      db.primarySourceDocument.findUnique({ where: { id: link.documentId }, select: { id: true, title: true, waterwayId: true, spotName: true, transcription: true } }),
      db.waterway.findUnique({ where: { id: link.waterwayId }, select: { id: true, name: true } }),
    ]);
    if (!doc) problems.push(`document not found: ${link.documentId}`);
    if (!waterway) problems.push(`waterway not found: ${link.waterwayId}`);
    if (doc && !doc.transcription) problems.push(`${doc.id} has no transcription; nothing to narrate`);
    if (doc && waterway) plan.push({ document: doc.title, spot: doc.spotName, from: doc.waterwayId, to: waterway.name });
  }
  const backupFile = writeBackup("2026-10-20-voices-links-before", { documents: await db.primarySourceDocument.findMany({ where: { id: { in: LINKS.map((l) => l.documentId) } } }) });
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }
  report("voice links", { plan, backupFile });
  if (!APPLY) return;
  for (const link of LINKS) await db.primarySourceDocument.update({ where: { id: link.documentId }, data: { waterwayId: link.waterwayId } });
  const verify = await db.primarySourceDocument.findMany({ where: { waterwayId: { in: LINKS.map((l) => l.waterwayId) }, transcription: { not: null }, spotLatitude: { not: null } }, select: { id: true, title: true, waterwayId: true } });
  report("verify", { voicesOnLinkedWaterways: verify });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
