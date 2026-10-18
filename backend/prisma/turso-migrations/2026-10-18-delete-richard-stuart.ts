// Delete the explorer row "Richard Stuart" (2026-10-18), on the owner's instruction.
//   bun run prisma/turso-migrations/2026-10-18-delete-richard-stuart.ts [--apply]
//
// The row said he was a Hudson's Bay Company servant who accompanied William Stuart inland from
// York Factory. No such person is in the Dictionary of Canadian Biography or the Hudson's Bay
// Company record as far as could be found (sweep pass 1, spec section 9.14); it looks like an
// invented seed row. The row, its reading guides and any links are backed up before deletion.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

async function main() {
  const row = await db.explorer.findFirst({ where: { name: "Richard Stuart" }, include: { waterways: true } });
  if (!row) { report("delete Richard Stuart", { result: "row not present; nothing to do" }); return; }
  const guides = await db.readingGuide.findMany({ where: { targetId: row.id } });
  const timeline = await db.timelineEvent.findMany({ where: { explorerId: row.id }, select: { id: true, title: true } });
  const historical = await db.historicalEvent.findMany({ where: { explorerId: row.id }, select: { id: true, title: true } });
  const documents = await db.primarySourceDocument.findMany({ where: { explorerId: row.id }, select: { id: true, title: true } });
  const backupFile = writeBackup("2026-10-18-delete-richard-stuart-before", { explorer: row, guides, timeline, historical, documents });
  report("delete Richard Stuart", { explorer: { id: row.id, name: row.name, links: row.waterways.length }, readingGuides: guides.length, timelineEventsToUnlink: timeline.map((t) => t.title), historicalEventsToUnlink: historical.map((h) => h.title), documentsToUnlink: documents.map((d) => d.title), backupFile });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    await tx.timelineEvent.updateMany({ where: { explorerId: row.id }, data: { explorerId: null } });
    await tx.historicalEvent.updateMany({ where: { explorerId: row.id }, data: { explorerId: null } });
    await tx.primarySourceDocument.updateMany({ where: { explorerId: row.id }, data: { explorerId: null } });
    await tx.readingGuide.deleteMany({ where: { targetId: row.id } });
    await tx.explorerWaterway.deleteMany({ where: { explorerId: row.id } });
    await tx.explorer.delete({ where: { id: row.id } });
  });
  report("verify", { explorers: await db.explorer.count(), richardStuart: await db.explorer.count({ where: { name: "Richard Stuart" } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
