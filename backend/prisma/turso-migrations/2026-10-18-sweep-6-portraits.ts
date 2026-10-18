// Template-field sweep, pass 6 (2026-10-18): portraits for explorers and figures without an image,
// and one explorer link held over from pass 4.
//   bun run prisma/turso-migrations/2026-10-18-sweep-6-portraits.ts [--apply]
//
// 88 explorers and 30 figures had no image. For each, the Wikipedia article cited on the row was
// read for its portrait and the Commons file record for its date and author; a Commons search by
// name was also run. Only likenesses made in the person's lifetime are used (the owner's rule), so
// most of the 118 stay without an image: no such likeness exists for the seventeenth- and
// eighteenth-century traders, for most Indigenous figures, or for people known only from records.
// Posthumous engravings (Thomas Simpson 1845, Verrazzano 1768), imagined portraits (Comcomly,
// Membertou by Alan Syliboy, Lescarbot by Jefferys) and undated images were passed over. Sets only
// where imageUrl is null; backup of the changed rows before --apply.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const MANIFEST = resolve(process.env.COMMONS_MANIFEST_DIR ?? resolve(import.meta.dir, "backups"), "2026-10-18-commons-sweep6-portraits-manifest.json");
type Entry = { file: string; license: string; artist: string; description: string };
const manifest = new Map<string, Entry>(Object.values(JSON.parse(readFileSync(MANIFEST, "utf8")) as Record<string, Entry[]>).flat().map((e) => [e.file, e]));
const url = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;

const EXPLORERS: Array<{ name: string; file: string; why: string }> = [
  { name: "Henri de Tonti", file: "Henri de Tonti.jpg", why: "portrait attributed to Nicolaes Maes (d. 1693), History Museum of Mobile; Tonti lived to 1704" },
  { name: "Sir John Ross", file: "British School - Sir John Ross (1777–1856) - BHC2983 - Royal Museums Greenwich.jpg", why: "oil portrait, British school, c. 1833, Royal Museums Greenwich" },
  { name: "William Penny", file: "William Penny by Stephen Pearce.jpg", why: "Stephen Pearce, 1853; Penny died 1892" },
  { name: "Albert Peter Low", file: "A.P. Low Hamilton River Picnic 1894.jpg", why: "photograph of Low and his party on the Hamilton River, 1894" },
  { name: "James William Tyrrell", file: "James Williams Tyrrell - 1900.jpg", why: "photograph of 1900 at Fort Reliance" },
  { name: "Robert Kennicott", file: "Robert Kennicott (Smithsonian Archive SIA 000095 B27C 111) - crop.jpg", why: "Smithsonian Institution Archives photograph; Kennicott died 1866" },
];
const FIGURES: Array<{ name: string; file: string; why: string }> = [
  { name: "Keskarrah", file: "Keskarrah and daughter.jpg", why: "Robert Hood's watercolour of Keskarrah and his daughter Green Stockings, 1821" },
];
// Held over from pass 4: the one documented visit found for a waterway still without an explorer.
const LINKS: Array<{ explorer: string; waterway: string; year: number; notes: string }> = [
  { explorer: "Nicolas Denys", waterway: "Restigouche River", year: 1672, notes: "Described the Ristigouche, as he spelled it, in his Description of the coasts of Acadia (1672); the river lay within the Gulf coast he held from 1653." },
];

async function main() {
  for (const f of [...EXPLORERS, ...FIGURES]) if (!manifest.has(f.file)) throw new Error(`file not in manifest: ${f.file}`);
  const ex = await db.explorer.findMany({ where: { name: { in: [...EXPLORERS.map((e) => e.name), ...LINKS.map((l) => l.explorer)] } }, select: { id: true, name: true, imageUrl: true } });
  const figs = await db.notableFigure.findMany({ where: { name: { in: FIGURES.map((f) => f.name) } }, select: { id: true, name: true, imageUrl: true } });
  const need = <T extends { name: string }>(rows: T[], n: string, what: string) => { const r = rows.find((x) => x.name === n); if (!r) throw new Error(`${what} not found: ${n}`); return r; };
  const exUp = EXPLORERS.map((e) => ({ ...e, row: need(ex, e.name, "explorer") })).filter((e) => !e.row.imageUrl);
  const figUp = FIGURES.map((f) => ({ ...f, row: need(figs, f.name, "figure") })).filter((f) => !f.row.imageUrl);
  const ww = await db.waterway.findMany({ where: { name: { in: LINKS.map((l) => l.waterway) } }, select: { id: true, name: true } });
  const existing = await db.explorerWaterway.findMany({ select: { explorerId: true, waterwayId: true } });
  const linkRows = LINKS.map((l) => ({ explorerId: need(ex, l.explorer, "explorer").id, waterwayId: need(ww, l.waterway, "waterway").id, yearExplored: l.year, expeditionNotes: l.notes, label: `${l.explorer} → ${l.waterway} (${l.year})` })).filter((r) => !existing.some((x) => x.explorerId === r.explorerId && x.waterwayId === r.waterwayId));
  const backupFile = writeBackup("2026-10-18-sweep-6-before", { explorers: exUp.map((e) => ({ id: e.row.id, imageUrl: e.row.imageUrl })), figures: figUp.map((f) => ({ id: f.row.id, imageUrl: f.row.imageUrl })) });
  report("sweep pass 6: portraits", { explorers: exUp.map((e) => `${e.name}: ${e.file} — ${e.why}`), figures: figUp.map((f) => `${f.name}: ${f.file} — ${f.why}`), linksAdded: linkRows.map((r) => r.label), backupFile });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const e of exUp) await tx.explorer.update({ where: { id: e.row.id }, data: { imageUrl: url(e.file) } });
    for (const f of figUp) await tx.notableFigure.update({ where: { id: f.row.id }, data: { imageUrl: url(f.file) } });
    for (const r of linkRows) await tx.explorerWaterway.create({ data: { explorerId: r.explorerId, waterwayId: r.waterwayId, yearExplored: r.yearExplored, expeditionNotes: r.expeditionNotes } });
  });
  report("verify", { explorersWithoutImage: await db.explorer.count({ where: { imageUrl: null } }), figuresWithoutImage: await db.notableFigure.count({ where: { imageUrl: null } }), waterwaysWithoutExplorer: (await db.waterway.findMany({ select: { _count: { select: { explorers: true } } } })).filter((w) => w._count.explorers === 0).length });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
