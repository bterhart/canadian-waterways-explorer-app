// Template-field sweep, pass 3 (2026-10-18): Indigenous names for waterways and locations, from the
// Wikipedia and Canadian Encyclopedia articles already cited on the rows as reading guides.
//   bun run prisma/turso-migrations/2026-10-18-sweep-3-indigenous-names.ts [--apply]
//
// The articles of all 69 waterways and 103 locations without a name were read for a name in an
// Indigenous language; six were found. The rest either have no recorded Indigenous name in those
// sources or an English or French name that translates one (Winnipegosis, Dubawnt's "Dubawnt",
// Kaministiquia), which is recorded in the pronunciation and description fields instead of being
// invented here. Sets only where the field is null. Backup of the changed rows before --apply.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const WATERWAYS: Array<{ name: string; indigenousName: string; language: string; note: string }> = [
  { name: "Richelieu River", indigenousName: "Masoliantekw", language: "Abenaki", note: "'water where there is plenty of food'; the French first called it the Rivière des Iroquois" },
  { name: "Nottaway River", indigenousName: "Natuweu Nipi", language: "Cree (Eeyou)", note: "the Iroquois name was Nottaweou; the French of 1699-1703 mapped it as the Rivière des Iroquois" },
  { name: "Dubawnt River", indigenousName: "Tobotua", language: "Dene Sųłıné (Chipewyan)", note: "'water shore', for the open water between the shore and the ice in late spring; the English name is taken from it" },
];
const LOCATIONS: Array<{ name: string; indigenousName: string; language: string; note: string }> = [
  { name: "Fort Carillon", indigenousName: "Tekontaró:ken", language: "Kanien'kéha (Mohawk)", note: "'it is at the junction of two waterways', the name behind Ticonderoga" },
  { name: "Bas-de-la-Rivière (Fort Alexander)", indigenousName: "Zaagiing", language: "Anishinaabemowin (Ojibwe)", note: "'mouth of the river', the name of the Sagkeeng First Nation at the Winnipeg River's outlet" },
  { name: "Fort Gibraltar", indigenousName: "Nistawâyâw", language: "Cree (nēhiyawēwin)", note: "the Cree name of The Forks, where the fort stood" },
];

async function main() {
  const ww = await db.waterway.findMany({ where: { name: { in: WATERWAYS.map((w) => w.name) } }, select: { id: true, name: true, indigenousName: true, indigenousLanguage: true } });
  const locs = await db.location.findMany({ where: { name: { in: LOCATIONS.map((l) => l.name) } }, select: { id: true, name: true, indigenousName: true, indigenousLanguage: true } });
  const wUp = WATERWAYS.map((w) => { const r = ww.find((x) => x.name === w.name); if (!r) throw new Error(`waterway not found: ${w.name}`); return { ...w, id: r.id, before: { indigenousName: r.indigenousName, indigenousLanguage: r.indigenousLanguage }, language: r.indigenousLanguage ?? w.language, skip: !!r.indigenousName }; }).filter((u) => !u.skip);
  const lUp = LOCATIONS.map((l) => { const r = locs.find((x) => x.name === l.name); if (!r) throw new Error(`location not found: ${l.name}`); return { ...l, id: r.id, before: { indigenousName: r.indigenousName, indigenousLanguage: r.indigenousLanguage }, language: r.indigenousLanguage ?? l.language, skip: !!r.indigenousName }; }).filter((u) => !u.skip);
  const backupFile = writeBackup("2026-10-18-sweep-3-before", { waterways: wUp.map((u) => ({ id: u.id, ...u.before })), locations: lUp.map((u) => ({ id: u.id, ...u.before })) });
  report("sweep pass 3: Indigenous names", { waterways: wUp.map((u) => `${u.name}: ${u.indigenousName} (${u.language}) — ${u.note}`), locations: lUp.map((u) => `${u.name}: ${u.indigenousName} (${u.language}) — ${u.note}`), backupFile });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const u of wUp) await tx.waterway.update({ where: { id: u.id }, data: { indigenousName: u.indigenousName, indigenousLanguage: u.language } });
    for (const u of lUp) await tx.location.update({ where: { id: u.id }, data: { indigenousName: u.indigenousName, indigenousLanguage: u.language } });
  });
  report("verify", { waterwaysWithoutIndigenousName: await db.waterway.count({ where: { indigenousName: null } }), locationsWithoutIndigenousName: await db.location.count({ where: { indigenousName: null } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
