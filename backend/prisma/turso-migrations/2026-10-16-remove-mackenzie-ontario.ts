// Decision 6 (2026-10-16): delete the waterway "Mackenzie River (Ontario)" (no KML, no
// image, no explorer, location, discovery or event points at it) together with its four
// reading-guide rows, and replace the bogus string in Roderick McKenzie's
// associatedLocations with "Lake Superior", the waterway Fort William stands on. The real
// Mackenzie River row is not touched; its geometry and zoom come from its own KML.
//   bun run prisma/turso-migrations/2026-10-16-remove-mackenzie-ontario.ts [--apply]
import { db } from "../../src/db";
import { APPLY, writeBackup, report, parseJsonArray } from "./lib/migration";

const NAME = "Mackenzie River (Ontario)";

async function main() {
  const ww = await db.waterway.findFirst({ where: { name: NAME }, include: { _count: { select: { explorers: true, locations: true, discoveries: true, contributions: true } }, furTradeInfo: true } });
  if (!ww) { report("remove", "already gone"); return; }
  const refs = {
    ...ww._count,
    furTrade: ww.furTradeInfo ? 1 : 0,
    timeline: await db.timelineEvent.count({ where: { waterwayId: ww.id } }),
    historical: await db.historicalEvent.count({ where: { waterwayId: ww.id } }),
    documents: await db.primarySourceDocument.count({ where: { waterwayId: ww.id } }),
    stops: await db.fieldTripStop.count({ where: { waterwayId: ww.id } }),
    words: await db.indigenousWord.count({ where: { relatedWaterwayId: ww.id } }),
    stories: await db.indigenousStory.count({ where: { relatedWaterwayId: ww.id } }),
    pron: await db.pronunciationGuide.count({ where: { waterwayId: ww.id } }),
    pins: await db.mapPin.count({ where: { linkedWaterwayId: ww.id } }),
    journal: await db.journalEntry.count({ where: { waterwayId: ww.id } }),
    saved: await db.savedLocation.count({ where: { waterwayId: ww.id } }),
  };
  const guides = await db.readingGuide.findMany({ where: { targetType: "waterway", targetId: ww.id } });
  const figure = await db.notableFigure.findFirst({ where: { name: "Roderick McKenzie" } });
  const locs = parseJsonArray<string>(figure?.associatedLocations);
  const newLocs = [...new Set(locs.filter((l) => l !== NAME).concat(locs.includes(NAME) ? ["Lake Superior"] : []))];
  const { kmlData, ...wwNoKml } = ww;

  const backupFile = writeBackup("2026-10-16-remove-mackenzie-ontario-before", { waterway: { ...wwNoKml, hasKml: !!kmlData }, readingGuides: guides, figure });
  report("remove Mackenzie River (Ontario)", { id: ww.id, refs, readingGuides: guides.length, figure: figure ? { id: figure.id, before: locs, after: newLocs } : null, backupFile });

  const blocking = Object.entries(refs).filter(([, n]) => n > 0);
  if (blocking.length) throw new Error(`Rows still point at the waterway: ${JSON.stringify(blocking)}`);
  if (!APPLY) return;

  await db.$transaction(async (tx) => {
    await tx.readingGuide.deleteMany({ where: { targetType: "waterway", targetId: ww.id } });
    if (figure) await tx.notableFigure.update({ where: { id: figure.id }, data: { associatedLocations: JSON.stringify(newLocs) } });
    await tx.waterway.delete({ where: { id: ww.id } });
  });

  report("verify", {
    waterwayGone: (await db.waterway.count({ where: { name: NAME } })) === 0,
    realMackenzie: await db.waterway.findFirst({ where: { name: "Mackenzie River" }, select: { id: true, name: true } }),
    figure: parseJsonArray<string>((await db.notableFigure.findFirst({ where: { name: "Roderick McKenzie" } }))?.associatedLocations),
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
