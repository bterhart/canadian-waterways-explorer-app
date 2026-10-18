// Template-field sweep, pass 8 (2026-10-18): a header image for every explorer and figure without one.
//   bun run prisma/turso-migrations/2026-10-18-sweep-8-people-header-images.ts [--apply]
//
// The owner's rules: no portrait that is not a likeness made in the person's lifetime (pass 6 set
// the seven that exist), and no card without an image. So every explorer and figure still without
// an image gets, as header, the primary image of the waterway they are most tied to: for an explorer
// the earliest-dated waterway link, for a figure the first entry in associatedLocations that is a
// waterway with an image. These are landscapes, maps and posts, never a person, so nothing reads as
// a portrait. Two exceptions are set by hand where no link or association carries an image. Sets
// only where imageUrl is null; backup before --apply.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

// People whose links and associations carry no image, with the waterway whose image stands in.
const BY_HAND: Record<string, string> = {
  "François de La Vérendrye": "Lake of the Woods", // his father's Fort St. Charles; the family's base for the western expeditions
  "Saukamappee": "Bow River", // Piikani country, where David Thompson heard his account in the winter of 1787-88
};

async function main() {
  const ww = await db.waterway.findMany({ select: { id: true, name: true, imageUrl: true } }); const wmap = new Map(ww.map((w) => [w.name, w.imageUrl]));
  const ex = await db.explorer.findMany({ where: { imageUrl: null }, select: { id: true, name: true, waterways: { orderBy: { yearExplored: "asc" }, select: { waterway: { select: { name: true, imageUrl: true } } } } } });
  const figs = await db.notableFigure.findMany({ where: { imageUrl: null }, select: { id: true, name: true, associatedLocations: true } });
  const exUp = ex.map((e) => { const link = e.waterways.find((x) => x.waterway.imageUrl); const hand = BY_HAND[e.name]; const src = link ? link.waterway.name : hand; const url = link ? link.waterway.imageUrl! : hand ? wmap.get(hand) ?? null : null; return { id: e.id, name: e.name, from: src, url }; });
  const figUp = figs.map((f) => { let a: string[] = []; try { a = JSON.parse(f.associatedLocations ?? "[]"); } catch { a = []; } const hit = a.find((n) => wmap.get(n)); const hand = BY_HAND[f.name]; const src = hit ?? hand; const url = src ? wmap.get(src) ?? null : null; return { id: f.id, name: f.name, from: src, url }; });
  const missing = [...exUp, ...figUp].filter((u) => !u.url).map((u) => u.name);
  if (missing.length) throw new Error(`no image source for: ${missing.join(", ")}`);
  const backupFile = writeBackup("2026-10-18-sweep-8-before", { explorers: exUp.map((u) => ({ id: u.id, imageUrl: null })), figures: figUp.map((u) => ({ id: u.id, imageUrl: null })) });
  report("sweep pass 8: header images for people", { explorers: exUp.length, figures: figUp.length, sample: [...exUp.slice(0, 6), ...figUp.slice(0, 4)].map((u) => `${u.name} ← ${u.from}`), backupFile });
  if (!APPLY) return;
  await db.$transaction(async (tx) => { for (const u of exUp) await tx.explorer.update({ where: { id: u.id }, data: { imageUrl: u.url! } }); for (const u of figUp) await tx.notableFigure.update({ where: { id: u.id }, data: { imageUrl: u.url! } }); }, { timeout: 60000 });
  report("verify", { explorersWithoutImage: await db.explorer.count({ where: { imageUrl: null } }), figuresWithoutImage: await db.notableFigure.count({ where: { imageUrl: null } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
