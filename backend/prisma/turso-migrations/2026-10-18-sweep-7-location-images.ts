// Template-field sweep, pass 7 (2026-10-18): images for the locations and waterways that had none.
//   bun run prisma/turso-migrations/2026-10-18-sweep-7-location-images.ts [--apply]
//
// 14 locations and 4 waterways had no image. A Commons search for each found a usable, freely
// licensed image for three: Fort Crèvecoeur (a 1932 book illustration of the fort), Hochelaga (the
// national historic site's landscape at Montreal) and the Pack River. Nothing usable came back for
// the others (Fort Confidence, Victory Point, Fort Halkett, South Branch House, Hudson House,
// Île-à-la-Crosse, Mackenzie Rock, Fort Richmond, Frances Lake Post, Fort Reliance (Yukon), Fort
// Constantine, Stadacona, Lac des Mille Lacs, Savanne River, McLeod Lake); the one hit for Fort
// Reliance (Yukon) was the ruin of Back's Fort Reliance on Great Slave Lake and was rejected.
// Sets only where the field is null; backup before --apply.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const MANIFEST = resolve(process.env.COMMONS_MANIFEST_DIR ?? resolve(import.meta.dir, "backups"), "2026-10-18-commons-sweep7-manifest.json");
type Entry = { file: string; license: string; artist: string; description: string };
const manifest = new Map<string, Entry>(Object.values(JSON.parse(readFileSync(MANIFEST, "utf8")) as Record<string, Entry[]>).flat().filter((e) => e.file).map((e) => [e.file, e]));
const url = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;
const credit = (e: Entry) => `Wikimedia Commons / ${e.artist || "unknown author"} / ${e.license}`;

const LOCATIONS: Array<{ name: string; file: string; caption: string }> = [
  { name: "Fort Crèvecoeur", file: "Fort Crevecoeur Illinois Historical Society.jpg", caption: "Fort Crèvecoeur as illustrated in a 1932 history of the Illinois River" },
  { name: "Hochelaga", file: "Hochelaga Site 03.jpg", caption: "The Hochelaga national historic site, a cultural landscape on the slope of Mount Royal" },
];
const WATERWAYS: Array<{ name: string; file: string; caption: string }> = [
  { name: "Pack River", file: "Pack River - panoramio.jpg", caption: "The Pack River" },
];

async function main() {
  for (const x of [...LOCATIONS, ...WATERWAYS]) if (!manifest.has(x.file)) throw new Error(`file not in manifest: ${x.file}`);
  const locs = await db.location.findMany({ where: { name: { in: LOCATIONS.map((l) => l.name) } }, select: { id: true, name: true, imageUrl: true } });
  const ww = await db.waterway.findMany({ where: { name: { in: WATERWAYS.map((w) => w.name) } }, select: { id: true, name: true, imageUrl: true, galleryImages: true } });
  const lUp = LOCATIONS.map((l) => { const r = locs.find((x) => x.name === l.name); if (!r) throw new Error(`location not found: ${l.name}`); return { ...l, row: r }; }).filter((l) => !l.row.imageUrl);
  const wUp = WATERWAYS.map((w) => { const r = ww.find((x) => x.name === w.name); if (!r) throw new Error(`waterway not found: ${w.name}`); return { ...w, row: r }; }).filter((w) => !w.row.imageUrl);
  const backupFile = writeBackup("2026-10-18-sweep-7-before", { locations: lUp.map((l) => ({ id: l.row.id, imageUrl: l.row.imageUrl })), waterways: wUp.map((w) => ({ id: w.row.id, imageUrl: w.row.imageUrl, galleryImages: w.row.galleryImages })) });
  report("sweep pass 7: location and waterway images", { locations: lUp.map((l) => `${l.name}: ${l.file} (${manifest.get(l.file)!.license})`), waterways: wUp.map((w) => `${w.name}: ${w.file} (${manifest.get(w.file)!.license})`), backupFile });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const l of lUp) await tx.location.update({ where: { id: l.row.id }, data: { imageUrl: url(l.file) } });
    for (const w of wUp) { const e = manifest.get(w.file)!; const gallery = [...(w.row.galleryImages ? JSON.parse(w.row.galleryImages) : []), { url: url(w.file), caption: w.caption, credit: credit(e) }]; await tx.waterway.update({ where: { id: w.row.id }, data: { imageUrl: url(w.file), galleryImages: JSON.stringify(gallery) } }); }
  });
  report("verify", { locationsWithoutImage: await db.location.count({ where: { imageUrl: null } }), waterwaysWithoutImage: await db.waterway.count({ where: { imageUrl: null } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
