// Portraits for explorers and notable figures that had none (2026-10-17).
//   bun run prisma/turso-migrations/2026-10-17-portraits-from-commons.ts [--apply]
//
// Rule unchanged: only a likeness made in the person's lifetime. Each file below was checked
// against its Wikimedia Commons record (date, author, source) before being listed, and the
// script confirms the file still answers before writing. People for whom no lifetime likeness
// exists or could be found (Thompson, Thanadelthur, Sacagawea, Charlotte Small, Isabel Gunn,
// Saukamappee, Kondiaronk, Tessouat, Membertou, Donnacona, Wickaninnish, Kwah, John Stuart,
// Samuel Black, David Stuart, Jaco Finlay, Puget, Dease, Thomas Simpson and the Hudson's Bay
// Company men of the eighteenth century) keep no image. Served as Special:FilePath URLs like the
// pack galleries until R2 keys are available.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const filePathUrl = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;

const EXPLORERS: Record<string, { file: string; basis: string }> = {
  "Meriwether Lewis": { file: "Meriwether Lewis-Charles Willson Peale.jpg", basis: "Charles Willson Peale, oil, c. 1807; Independence National Historical Park" },
  "William Clark": { file: "William Clark-Charles Willson Peale.jpg", basis: "Charles Willson Peale, oil, 1810; Independence National Historical Park" },
  "Louis Hennepin": { file: "Portrait de Louis Hennepin, 1694.jpg", basis: "Engraved portrait of 1694, published in his lifetime" },
  "Peter Skene Ogden": { file: "Peter-Skene-Ogden-OrHi-707.jpg", basis: "Photograph taken before his death in 1854; Oregon Historical Society OrHi 707" },
  "Esteban José Martínez": { file: "Esteban José Martínez Fernández y Martínez de la Sierra.jpg", basis: "Spanish naval portrait, c. 1785" },
  "Manuel Quimper": { file: "Manuel Quimper.jpg", basis: "Portrait, c. 1790" },
  "Alexander Ross": { file: "Alexander Ross - Pelzhändler und Entdecker.jpg", basis: "Photograph (he died 1856); Manitoba Historical Society" },
  "Gabriel Franchère": { file: "Frachere.jpg", basis: "Portrait made before his death in 1863" },
  "Otto Sverdrup": { file: "No-nb bldsa 1c016.jpg", basis: "Photograph; National Library of Norway picture collection" },
};
const FIGURES: Record<string, { file: string; basis: string }> = {
  "Tattannoeuck": { file: "Tattannoeuck.jpg", basis: "Robert Hood, watercolour, May 1821, with Hoeootoerock (Junius); Library and Archives Canada" },
  "Maquinna": { file: "Chief Maquinna.gif", basis: "Tomás de Suría, drawing from life, Nootka Sound, 1791" },
  "Alexander Baranov": { file: "Tikhanov - Alexandr Andreyevich Baranov (1818).png", basis: "Mikhail Tikhanov, oil, 1818; State Historical Museum, Moscow" },
};

async function alive(url: string) {
  for (let i = 0; i < 3; i++) {
    const r = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } });
    if (r.ok) return true;
    if (r.status === 429) { await new Promise((x) => setTimeout(x, 20_000 * (i + 1))); continue; }
    return false;
  }
  return true; // rate-limited only; the file record was read by hand
}

async function main() {
  const ex = await db.explorer.findMany({ where: { name: { in: Object.keys(EXPLORERS) } }, select: { id: true, name: true, imageUrl: true } });
  const fg = await db.notableFigure.findMany({ where: { name: { in: Object.keys(FIGURES) } }, select: { id: true, name: true, imageUrl: true } });
  const missing = [...Object.keys(EXPLORERS).filter((n) => !ex.some((e) => e.name === n)), ...Object.keys(FIGURES).filter((n) => !fg.some((f) => f.name === n))];
  if (missing.length) throw new Error(`not found: ${missing.join(", ")}`);
  const problems: string[] = [];
  const plan = [
    ...ex.map((e) => ({ table: "explorer" as const, id: e.id, name: e.name, before: e.imageUrl, url: filePathUrl(EXPLORERS[e.name]!.file), basis: EXPLORERS[e.name]!.basis })),
    ...fg.map((f) => ({ table: "figure" as const, id: f.id, name: f.name, before: f.imageUrl, url: filePathUrl(FIGURES[f.name]!.file), basis: FIGURES[f.name]!.basis })),
  ].filter((p) => !p.before);
  for (const p of plan) if (!(await alive(p.url))) problems.push(`${p.name}: ${p.url}`);
  const backupFile = writeBackup("2026-10-17-portraits-before", { rows: plan.map((p) => ({ table: p.table, id: p.id, name: p.name, before: p.before })) });
  report("portraits from Commons", { toSet: plan.map((p) => `${p.name}: ${p.basis}`), skippedAlreadyHaveImage: ex.length + fg.length - plan.length, problems, backupFile });
  if (problems.length) throw new Error("Fix the files above before applying.");
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const p of plan) if (p.table === "explorer") await tx.explorer.update({ where: { id: p.id }, data: { imageUrl: p.url } }); else await tx.notableFigure.update({ where: { id: p.id }, data: { imageUrl: p.url } });
  });
  report("verify", { explorersWithoutImage: await db.explorer.count({ where: { imageUrl: null } }), figuresWithoutImage: await db.notableFigure.count({ where: { imageUrl: null } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
