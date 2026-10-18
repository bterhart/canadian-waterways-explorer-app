// Template-field sweep, pass 14 (2026-10-18): Indigenous names from provincial, federal and nation
// records, and two more explorer links from the Dictionary of Canadian Biography.
//   bun run prisma/turso-migrations/2026-10-18-sweep-14-indigenous-names-records.ts [--apply]
//
// After pass 3, 66 waterways and 100 locations had no Indigenous name. Every one was looked up in:
//   - the Canadian Geographical Names Database (geogratis.gc.ca/services/geoname), which carries the
//     official names decided by the provinces and territories with a language code;
//   - BC Geographical Names (apps.gov.bc.ca/pub/bcgnws), with its origin notes;
//   - the Commission de toponymie du Québec (toponymie.gouv.qc.ca), whose records carry a
//     "variante traditionnelle autochtone" where one is recorded;
//   - Wikidata's native-label statements (P1705), used only as leads to be confirmed elsewhere;
// and, where those gave nothing, nation sources: Qalipu First Nation's Ktaqmkuk place-name handbook
// (Newfoundland Mi'kmaq), the Mi'gmaq-Mi'kmaq Online dictionary (Listuguj), the Heiltsuk Nation's 2025
// submission to BC Geographical Names, Sealaska's community-name list, syilx sources for Okanagan Lake,
// and Rainy River First Nations' own usage. Thirteen names were found; each entry below names its
// record. Names whose official English form is itself an Indigenous word (Tagish Lake, Winnipegosis,
// Clayoquot, Nootka, Stikine, Bella Coola) are not duplicated into the field. The rest of the 166 have
// no recorded Indigenous name in any of these sources and are left null rather than invented.
// Sets only where the field is null; backup of changed rows before --apply.
//
// Explorer links (DCB): Peter Skene Ogden sailed from Fort Vancouver in April 1831 "to establish a new
// post near the mouth of the Nass River", first Fort Nass then Fort Simpson; Pierre Du Gua de Monts and
// Samuel de Champlain, exploring the Baie Française in the ship's long boat in June 1604, "reached
// Chignictou (Chignecto) and then turned westward to coast the New Brunswick shore" to the Saint John.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

type Name = { name: string; indigenousName: string; language: string; source: string };
const WATERWAYS: Name[] = [
  { name: "Eastmain River", indigenousName: "Iismeniiu-siipii", language: "Cree (Eeyou)", source: "Commission de toponymie du Québec, Rivière Eastmain, variante traditionnelle autochtone (fiche 20122); the 1983 community survey recorded Eastmainu Siipii" },
  { name: "Prince of Wales Strait", indigenousName: "Ikirahak", language: "Inuinnaqtun", source: "Canadian Geographical Names Database: official name, Northwest Territories, decision 2006-04-01" },
  { name: "Naskaupi River", indigenousName: "Meshikamau-shipu", language: "Innu-aimun", source: "Canadian Geographical Names Database: official name, Newfoundland and Labrador, decision 2015-01-27 ('river to Meshikamau'; the Meshikamau-shipu travel route is a National Historic Event)" },
  { name: "Okanagan Lake", indigenousName: "kɬúsx̌nítkʷ", language: "Nsyilxcən (Okanagan)", source: "syilx Okanagan Nation usage (IndigiNews, 2021-23; Okanagan Rail Trail pronunciation guide); Wikidata native label; BC Geographical Names records the official name's language as nsyilxcn" },
  { name: "Humber River (Newfoundland)", indigenousName: "Maqtukwek", language: "Mi'kmaq", source: "Qalipu First Nation, Ktaqmkuk Mi'kmaq place-name handbook (Smith-Francis orthography; Hewson), 'a large flowing river'" },
  { name: "Beothuk Lake", indigenousName: "Mekwe'jite'wey", language: "Mi'kmaq", source: "Qalipu First Nation, Ktaqmkuk handbook, under the lake's former name Red Indian Lake: 'land of the Mekwe'jit', the Mi'kmaq name for the Beothuk (Pacifique p. 135; Hewson p. 16)" },
  { name: "Miramichi River", indigenousName: "Listuguji'j", language: "Mi'kmaq", source: "Mi'gmaq-Mi'kmaq Online dictionary (Listuguj): Listuguji'j, noun inanimate, 'Miramichi River'" },
  { name: "Restigouche River", indigenousName: "Listuguj", language: "Mi'kmaq", source: "Canadian Geographical Names Database marks the Quebec name Rivière Ristigouche as Mi'kmaq in origin; Commission de toponymie du Québec (fiche 53438) and the Canadian Encyclopedia: the river's name derives from Listuguj, the Mi'kmaq name of the community at its mouth, meaning not established" },
  { name: "Rainy River", indigenousName: "Manidoo Ziibi", language: "Anishinaabemowin (Ojibwe)", source: "Rainy River First Nations usage ('Spirit River'; Manitou Rapids, Kay-Nah-Chi-Wah-Nung); Story Nations project, University of Toronto, 'Stories from Manidoo Ziibi'" },
];
const LOCATIONS: Name[] = [
  { name: "Fort McLoughlin", indigenousName: "Q̓ḷc", language: "Haíłzaqvḷa (Heiltsuk)", source: "BC Geographical Names, McLoughlin Bay, the fort's site: 'Q̓ḷc is a Haíłzaqvḷa name and means slippery' (Ronald Olson and Emma Starr, Heiltsuk Nation, 2025)" },
  { name: "Fort Stikine", indigenousName: "Ḵaachx̱an.áakʼw", language: "Tlingit (Lingít)", source: "Sealaska community list for Wrangell, the fort's site; Wikidata native label Ḵaachx̱aana.áakʼw, 'Ḵaachx̱an's little lake'" },
  { name: "Trois-Rivières", indigenousName: "Mad8baloden", language: "Abenaki (W8banakiak)", source: "Commission de toponymie du Québec, variante traditionnelle autochtone (fiche 451418): 'à la fin'" },
  { name: "Placentia (Plaisance)", indigenousName: "Plisantek", language: "Mi'kmaq", source: "Qalipu First Nation, Ktaqmkuk handbook (Pacifique orthography): the Mi'kmaq form of Placentia" },
  { name: "Lapierre House", indigenousName: "Zheh Gwatsal", language: "Gwich'in", source: "Canadian Geographical Names Database: Yukon alternate official name, decision 2018-08-23" },
];

const LINKS: Array<{ explorer: string; waterway: string; yearExplored: number; expeditionNotes: string }> = [
  { explorer: "Peter Skene Ogden", waterway: "Nass River", yearExplored: 1831, expeditionNotes: "Sailed north from Fort Vancouver in April 1831 to build Fort Nass near the river's mouth, soon renamed Fort Simpson, to take the eulachon-season trade from the American ships and the Russians at Sitka." },
  { explorer: "Pierre Du Gua de Monts", waterway: "Chignecto Bay", yearExplored: 1604, expeditionNotes: "Exploring the Baie Française with Champlain in the long boat in June 1604, looking for a settlement site and Prévert's reported mine, reached Chignecto at the head of the bay before turning west along the New Brunswick shore to the Saint John." },
  { explorer: "Samuel de Champlain", waterway: "Chignecto Bay", yearExplored: 1604, expeditionNotes: "With de Monts in the long boat in June 1604, reached Chignecto at the head of the Baie Française, then coasted west to the Saint John, which they entered on 24 June." },
];

async function main() {
  const ww = await db.waterway.findMany({ where: { name: { in: WATERWAYS.map((w) => w.name) } }, select: { id: true, name: true, indigenousName: true, indigenousLanguage: true } });
  const locs = await db.location.findMany({ where: { name: { in: LOCATIONS.map((l) => l.name) } }, select: { id: true, name: true, indigenousName: true, indigenousLanguage: true } });
  const prep = <T extends { id: string; name: string; indigenousName: string | null; indigenousLanguage: string | null }>(list: Name[], rows: T[], kind: string) => list.map((n) => {
    const r = rows.find((x) => x.name === n.name); if (!r) throw new Error(`${kind} not found: ${n.name}`);
    return { ...n, id: r.id, before: { indigenousName: r.indigenousName, indigenousLanguage: r.indigenousLanguage }, skip: !!r.indigenousName };
  }).filter((u) => !u.skip);
  const wUp = prep(WATERWAYS, ww, "waterway"); const lUp = prep(LOCATIONS, locs, "location");
  const [ex, allWw] = await Promise.all([db.explorer.findMany({ select: { id: true, name: true } }), db.waterway.findMany({ select: { id: true, name: true } })]);
  const linkRows: Array<{ explorerId: string; waterwayId: string; yearExplored: number; expeditionNotes: string; label: string }> = [];
  for (const l of LINKS) {
    const e = ex.find((x) => x.name === l.explorer); const w = allWw.find((x) => x.name === l.waterway);
    if (!e || !w) throw new Error(`not found: ${l.explorer} / ${l.waterway}`);
    const exists = await db.explorerWaterway.findFirst({ where: { explorerId: e.id, waterwayId: w.id } });
    if (!exists) linkRows.push({ explorerId: e.id, waterwayId: w.id, yearExplored: l.yearExplored, expeditionNotes: l.expeditionNotes, label: `${l.explorer} → ${l.waterway} ${l.yearExplored}` });
  }
  const backupFile = writeBackup("2026-10-18-sweep-14-before", { waterways: wUp.map((u) => ({ id: u.id, ...u.before })), locations: lUp.map((u) => ({ id: u.id, ...u.before })), links: "inserts only" });
  report("sweep pass 14: Indigenous names from records, explorer links", {
    waterways: wUp.map((u) => `${u.name}: ${u.indigenousName} (${u.language}) — ${u.source}`),
    locations: lUp.map((u) => `${u.name}: ${u.indigenousName} (${u.language}) — ${u.source}`),
    links: linkRows.map((r) => r.label), backupFile,
  });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const u of wUp) await tx.waterway.update({ where: { id: u.id }, data: { indigenousName: u.indigenousName, indigenousLanguage: u.language } });
    for (const u of lUp) await tx.location.update({ where: { id: u.id }, data: { indigenousName: u.indigenousName, indigenousLanguage: u.language } });
    for (const { label: _l, ...r } of linkRows) await tx.explorerWaterway.create({ data: r });
  }, { timeout: 60000 });
  report("verify", {
    waterwaysWithoutIndigenousName: await db.waterway.count({ where: { indigenousName: null } }),
    locationsWithoutIndigenousName: await db.location.count({ where: { indigenousName: null } }),
    waterwaysWithoutExplorer: (await db.waterway.findMany({ where: { explorers: { none: {} } }, select: { name: true } })).map((w) => w.name),
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
