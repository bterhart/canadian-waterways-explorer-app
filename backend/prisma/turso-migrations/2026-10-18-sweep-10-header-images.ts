// Template-field sweep, pass 10 (2026-10-18): a header image for every waterway and location.
//   bun run prisma/turso-migrations/2026-10-18-sweep-10-header-images.ts [--apply]
//
// The owner's rule of 2026-10-18: no card without an image. After pass 7, 3 waterways and 12 locations
// had nothing on Commons at the size the search accepted. A second search with a lower size threshold
// found period illustrations and photographs for eight of the locations (Everette's 1884 drawing of
// Fort Reliance, the 1820 view of the Île-à-la-Crosse forts, Pike's 1896 Frances River, the Smith
// River falls at Fort Halkett's site, the Mounted Police post at Forty Mile, a nineteenth-century
// painting of Cartier at Stadacona, the Richmond Gulf satellite view, the map of the Saskatchewan
// posts) and a historical view of Fort McLeod for McLeod Lake. The rest take the primary image of
// their own waterway, as the people did in pass 8: Fort Confidence (Great Bear Lake), Victory Point
// (Victoria Strait), South Branch House (South Saskatchewan), Mackenzie Rock (Dean Channel); and the
// Savanne River and Lac des Mille Lacs, which have no photograph on Commons, take the Seine River's,
// the river that drains the lake. Sets only where imageUrl is null; backup before --apply.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const MANIFEST = resolve(process.env.COMMONS_MANIFEST_DIR ?? resolve(import.meta.dir, "backups"), "2026-10-18-commons-sweep10-manifest.json");
type Entry = { file: string; license: string; artist: string; description: string };
const manifest = new Map<string, Entry>(Object.values(JSON.parse(readFileSync(MANIFEST, "utf8")) as Record<string, Entry[]>).flat().filter((e) => e.file).map((e) => [e.file, e]));
const url = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;
const credit = (e: Entry) => `Wikimedia Commons / ${e.artist || "unknown author"} / ${e.license}`;

const LOCATION_FILES: Array<{ name: string; file: string }> = [
  { name: "Stadacona", file: "Jacques Cartier Meeting the Indians at Stadacona, 1535.jpg" },
  { name: "Fort Halkett", file: "Smith River Falls Recreation Site (34664512116).jpg" },
  { name: "Hudson House", file: "Map. Location of Buckingham House (HBC) and other trading posts in Canada.png" },
  { name: "Île-à-la-Crosse", file: "Fort de l'Île-à-la-Crosse en 1820.jpg" },
  { name: "Fort Richmond", file: "Richmond Gulf.png" },
  { name: "Frances Lake Post", file: "PIKE(1896) p151 Break-up of Ice on the Frances River.jpg" },
  { name: "Fort Reliance (Yukon)", file: "Fort Reliance, Yukon.jpg" },
  { name: "Fort Constantine", file: "Fourty Mile NWMP.jpg" },
];
const LOCATION_FROM_WATERWAY: Array<{ name: string; waterway: string }> = [
  { name: "Fort Confidence", waterway: "Great Bear Lake" },
  { name: "Victory Point", waterway: "Victoria Strait" },
  { name: "South Branch House", waterway: "South Saskatchewan River" },
  { name: "Mackenzie Rock", waterway: "Dean Channel" },
];
const WATERWAY_FILES: Array<{ name: string; file: string; caption: string }> = [
  { name: "McLeod Lake", file: "Fort McLeod; Stuart Lake.jpg", caption: "Fort McLeod on McLeod Lake, a historical view" },
];
const WATERWAY_FROM_WATERWAY: Array<{ name: string; waterway: string; caption: string }> = [
  { name: "Lac des Mille Lacs", waterway: "Seine River", caption: "The Seine River, which drains Lac des Mille Lacs" },
  { name: "Savanne River", waterway: "Seine River", caption: "The Seine River below Lac des Mille Lacs, which the Savanne feeds" },
];

async function main() {
  for (const x of [...LOCATION_FILES, ...WATERWAY_FILES]) if (!manifest.has(x.file)) throw new Error(`file not in manifest: ${x.file}`);
  const ww = await db.waterway.findMany({ select: { id: true, name: true, imageUrl: true, galleryImages: true } }); const wmap = new Map(ww.map((w) => [w.name, w]));
  const srcImg = (n: string) => { const w = wmap.get(n); if (!w?.imageUrl) throw new Error(`no image on waterway ${n}`); return w; };
  const locs = await db.location.findMany({ where: { imageUrl: null }, select: { id: true, name: true } });
  const lUp = [
    ...LOCATION_FILES.map((l) => ({ ...l, url: url(l.file) })),
    ...LOCATION_FROM_WATERWAY.map((l) => ({ name: l.name, file: `(${l.waterway})`, url: srcImg(l.waterway).imageUrl! })),
  ].map((l) => { const r = locs.find((x) => x.name === l.name); return r ? { ...l, id: r.id } : null; }).filter((x): x is NonNullable<typeof x> => !!x);
  const wUp = [
    ...WATERWAY_FILES.map((w) => { const e = manifest.get(w.file)!; return { name: w.name, url: url(w.file), gallery: { url: url(w.file), caption: w.caption, credit: credit(e) }, from: w.file }; }),
    ...WATERWAY_FROM_WATERWAY.map((w) => { const s = srcImg(w.waterway); const g = s.galleryImages ? (JSON.parse(s.galleryImages) as Array<{ url: string; caption: string; credit: string }>) : []; const first = g.find((x) => x.url === s.imageUrl) ?? g[0]; return { name: w.name, url: s.imageUrl!, gallery: { url: s.imageUrl!, caption: w.caption, credit: first?.credit ?? "Wikimedia Commons" }, from: `(${w.waterway})` }; }),
  ].map((w) => { const r = wmap.get(w.name); if (!r) throw new Error(`waterway not found: ${w.name}`); return r.imageUrl ? null : { ...w, id: r.id, galleryImages: r.galleryImages }; }).filter((x): x is NonNullable<typeof x> => !!x);
  const backupFile = writeBackup("2026-10-18-sweep-10-before", { locations: lUp.map((l) => ({ id: l.id, imageUrl: null })), waterways: wUp.map((w) => ({ id: w.id, imageUrl: null, galleryImages: w.galleryImages })) });
  report("sweep pass 10: header images", { locations: lUp.map((l) => `${l.name} ← ${l.file}`), waterways: wUp.map((w) => `${w.name} ← ${w.from}`), stillWithoutImage: locs.filter((l) => !lUp.some((u) => u.id === l.id)).map((l) => l.name), backupFile });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const l of lUp) await tx.location.update({ where: { id: l.id }, data: { imageUrl: l.url } });
    for (const w of wUp) { const gallery = [...(w.galleryImages ? JSON.parse(w.galleryImages) : []), w.gallery]; await tx.waterway.update({ where: { id: w.id }, data: { imageUrl: w.url, galleryImages: JSON.stringify(gallery) } }); }
  }, { timeout: 60000 });
  report("verify", { locationsWithoutImage: await db.location.count({ where: { imageUrl: null } }), waterwaysWithoutImage: await db.waterway.count({ where: { imageUrl: null } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
