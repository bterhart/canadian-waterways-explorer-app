// Decision 3 (2026-10-16): the fort "pairs" are the same fort, destroyed and rebuilt,
// so each becomes one Location row.
//   bun run prisma/turso-migrations/2026-10-16-merge-fort-pairs.ts [--apply]
// Kept row: the plain name, except Fort Garry where "Upper Fort Garry" is the standard
// name and the one on the right waterway (Red River; the plain "Fort Garry" row sat on
// Lake Winnipeg). Merge: earliest year; longer description; historical notes joined when
// the other's text is not already contained; gallery union by url; Indigenous name kept
// or taken from the other; the kept row's hero image stays. Reading guides move to the
// kept row (duplicates by title+source+url dropped). Notable-figure associatedLocations
// strings naming a removed row are rewritten to the kept name. Prince of Wales Fort is
// a different structure on the other bank and is not touched; Fort Kaministiquia and
// Fort Augustus (NWC) are different posts and are not touched.
import { db } from "../../src/db";
import { APPLY, writeBackup, report, parseJsonArray } from "./lib/migration";

const MERGES: Array<{ keep: string; drop: string[]; rename?: string }> = [
  { keep: "Fort William", drop: ["Fort William (NWC)"] },
  { keep: "Fort Edmonton", drop: ["Fort Edmonton (HBC)"] },
  { keep: "Fort Churchill", drop: ["Fort Churchill (HBC)"] },
  { keep: "Upper Fort Garry", drop: ["Fort Garry", "Fort Garry (Upper)"] },
  { keep: "Rocky Mountain House", drop: ["Rocky Mountain House (NWC)"] },
];

interface Gallery { url: string; caption?: string; credit?: string }

async function main() {
  const names = MERGES.flatMap((m) => [m.keep, ...m.drop]);
  const rows = await db.location.findMany({ where: { name: { in: names } } });
  const byName = new Map(rows.map((r) => [r.name, r]));
  for (const n of names) if (!byName.has(n)) throw new Error(`Location not found: ${n}`);

  const dropIds = MERGES.flatMap((m) => m.drop.map((d) => byName.get(d)!.id));
  const guides = await db.readingGuide.findMany({ where: { targetType: "location", targetId: { in: rows.map((r) => r.id) } }, orderBy: { sortOrder: "asc" } });
  const figures = await db.notableFigure.findMany({ select: { id: true, name: true, associatedLocations: true } });

  // Refuse if anything else points at a dropped row
  const refs = {
    contributions: await db.userContribution.count({ where: { locationId: { in: dropIds } } }),
    timeline: await db.timelineEvent.count({ where: { locationId: { in: dropIds } } }),
    historical: await db.historicalEvent.count({ where: { locationId: { in: dropIds } } }),
    documents: await db.primarySourceDocument.count({ where: { locationId: { in: dropIds } } }),
    stops: await db.fieldTripStop.count({ where: { locationId: { in: dropIds } } }),
    words: await db.indigenousWord.count({ where: { relatedLocationId: { in: dropIds } } }),
    pron: await db.pronunciationGuide.count({ where: { locationId: { in: dropIds } } }),
    pins: await db.mapPin.count({ where: { linkedLocationId: { in: dropIds } } }),
    journal: await db.journalEntry.count({ where: { locationId: { in: dropIds } } }),
    saved: await db.savedLocation.count({ where: { locationId: { in: dropIds } } }),
  };

  const plan = MERGES.map((m) => {
    const keep = byName.get(m.keep)!;
    const drops = m.drop.map((d) => byName.get(d)!);
    const all = [keep, ...drops];
    const year = Math.min(...all.map((r) => r.yearEstablished ?? Number.POSITIVE_INFINITY));
    const description = all.reduce((best, r) => (r.description.length > best.length ? r.description : best), keep.description);
    let historicalNotes = keep.historicalNotes ?? "";
    for (const d of drops) {
      const t = d.historicalNotes?.trim();
      if (t && !historicalNotes.includes(t)) historicalNotes = historicalNotes ? `${historicalNotes}\n\n${t}` : t;
    }
    const gallery: Gallery[] = [];
    for (const r of all) for (const g of parseJsonArray<Gallery>(r.galleryImages)) if (!gallery.some((x) => x.url === g.url)) gallery.push(g);
    const indigenousName = keep.indigenousName ?? drops.find((d) => d.indigenousName)?.indigenousName ?? null;
    const indigenousLanguage = keep.indigenousLanguage ?? drops.find((d) => d.indigenousLanguage)?.indigenousLanguage ?? null;
    const cartographerId = keep.cartographerId ?? drops.find((d) => d.cartographerId)?.cartographerId ?? null;

    // reading guides: keep's first, then the dropped rows' entries not already present
    const keepGuides = guides.filter((g) => g.targetId === keep.id);
    const fp = (g: { title: string; authorSource: string | null; url: string | null }) => `${g.title}|${g.authorSource ?? ""}|${g.url ?? ""}`;
    const seen = new Set(keepGuides.map(fp));
    const moveGuides: Array<{ id: string; newSortOrder: number }> = [];
    const deleteGuides: string[] = [];
    let next = keepGuides.length;
    for (const d of drops) for (const g of guides.filter((x) => x.targetId === d.id)) {
      if (seen.has(fp(g))) deleteGuides.push(g.id);
      else { seen.add(fp(g)); moveGuides.push({ id: g.id, newSortOrder: next++ }); }
    }

    const figureRewrites = figures.flatMap((f) => {
      const locs = parseJsonArray<string>(f.associatedLocations);
      if (!locs.some((l) => m.drop.includes(l))) return [];
      const rewritten = [...new Set(locs.map((l) => (m.drop.includes(l) ? m.keep : l)))];
      return [{ id: f.id, name: f.name, before: locs, after: rewritten }];
    });

    return {
      keepId: keep.id, keepName: m.keep, dropIds: drops.map((d) => d.id), dropNames: m.drop,
      data: { yearEstablished: Number.isFinite(year) ? year : keep.yearEstablished, description, historicalNotes: historicalNotes || null, galleryImages: JSON.stringify(gallery), indigenousName, indigenousLanguage, cartographerId },
      waterwayNote: all.map((r) => `${r.name} on ${r.waterwayId}`),
      moveGuides, deleteGuides, figureRewrites,
    };
  });

  const backupFile = writeBackup("2026-10-16-merge-fort-pairs-before", { locations: rows, readingGuides: guides, figures: figures.filter((f) => plan.some((p) => p.figureRewrites.some((r) => r.id === f.id))) });
  report("merge fort pairs", { refsPointingAtDroppedRows: refs, plan: plan.map((p) => ({ ...p, data: { ...p.data, description: `${p.data.description.slice(0, 60)}…`, historicalNotes: `${(p.data.historicalNotes ?? "").length} chars`, galleryImages: `${JSON.parse(p.data.galleryImages).length} images` } })), backupFile });

  if (Object.values(refs).some((n) => n > 0)) throw new Error("Other rows point at a location to drop; extend the script before applying.");
  if (!APPLY) return;

  await db.$transaction(async (tx) => {
    for (const p of plan) {
      await tx.location.update({ where: { id: p.keepId }, data: p.data });
      for (const g of p.moveGuides) await tx.readingGuide.update({ where: { id: g.id }, data: { targetId: p.keepId, sortOrder: g.newSortOrder } });
      if (p.deleteGuides.length) await tx.readingGuide.deleteMany({ where: { id: { in: p.deleteGuides } } });
      for (const f of p.figureRewrites) await tx.notableFigure.update({ where: { id: f.id }, data: { associatedLocations: JSON.stringify(f.after) } });
      await tx.location.deleteMany({ where: { id: { in: p.dropIds } } });
    }
  });

  report("verify", {
    locations: await db.location.count(),
    remainingDropNames: await db.location.count({ where: { name: { in: MERGES.flatMap((m) => m.drop) } } }),
    guidesOnKept: await db.readingGuide.groupBy({ by: ["targetId"], where: { targetId: { in: plan.map((p) => p.keepId) } }, _count: true }),
    guidesOnDropped: await db.readingGuide.count({ where: { targetId: { in: dropIds } } }),
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
