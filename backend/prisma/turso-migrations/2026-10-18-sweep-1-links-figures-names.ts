// Template-field sweep, pass 1 (2026-10-18): the connections the app's detail sheets key on.
//   bun run prisma/turso-migrations/2026-10-18-sweep-1-links-figures-names.ts [--apply]
//
// Measured before this pass (192 waterways): 22 waterways had no explorer, 11 explorers had no
// waterway, 14 of 65 notable figures named no waterway in associatedLocations (the field the
// "Notable Figures Connected" card matches on), and 78 waterways had no Indigenous name. This
// pass fixes what the Dictionary of Canadian Biography, the rows' own biographies and the
// waterways' Wikipedia articles support; everything else is left for later passes and listed in
// the spec. Idempotent: links are skipped if present, names are only appended, Indigenous names
// are set only where null. Backup of every changed row before --apply.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

// Waterway names appended to a figure's associatedLocations (DCB and the row's own biography).
const FIGURE_WATERWAYS: Record<string, string[]> = {
  "Thanadelthur": ["Hayes River", "Churchill River"], // brought to York Fort 24 Nov. 1714; the Churchill post of 1717 followed her peace mission (DCB)
  "Marie-Anne Gaboury": ["Red River"], // Pembina and the Red River settlement (row biography)
  "Isabel Gunn": ["Albany River", "Hayes River", "Red River"], // Albany Factory, York Factory, Pembina (row biography)
  "Keskarrah": ["Coppermine River", "Great Slave Lake"], // guide of Franklin's Coppermine expedition (row biography)
  "Louis Riel": ["Red River", "South Saskatchewan River"], // Red River 1869-70; Batoche 1885
  "Gabriel Dumont": ["Red River", "South Saskatchewan River"], // born Red River 1837; Batoche, Fish Creek
  "Cuthbert Grant": ["Red River", "Assiniboine River"], // Seven Oaks on the Red; Grantown on the Assiniboine
  "Jean-Baptiste Lagimodiere": ["Red River"],
  "Crowfoot (Isapo-Muxika)": ["Bow River"], // Blackfoot Crossing on the Bow (DCB)
  "Poundmaker (Pîhtokahanapiwiyin)": ["North Saskatchewan River"], // Fort Carlton treaty 1876, Battleford country (DCB)
  "Big Bear (Mistahimaskwa)": ["North Saskatchewan River"], // bands wintering along the North Saskatchewan; Fort Pitt, Frog Lake (DCB)
  "Chief Peguis": ["Red River"], // died at Red River 1864 (DCB)
  "Shawnadithit": ["Exploits River", "Beothuk Lake", "Notre Dame Bay"], // DCB: Bay of Exploits, Red Indian Lake, Badger Bay
};

// Explorer-waterway links with the year and a note; every one read in the DCB or the row's own biography today.
const LINKS: Array<{ explorer: string; waterway: string; year: number; notes: string }> = [
  { explorer: "Richard Norton", waterway: "Churchill River", year: 1717, notes: "With the advance party that left York in June 1717 to found the Hudson's Bay Company's post on the Churchill River; he later governed the post." },
  { explorer: "William Stuart", waterway: "Hayes River", year: 1715, notes: "Apprenticed at York Fort from 1691; left York on 27 June 1715 with Thanadelthur and the Home Indians on James Knight's peace mission to the Chipewyan." },
  { explorer: "Joseph Colen", waterway: "Hayes River", year: 1786, notes: "Sent to York Factory in 1785 to oversee its rebuilding after La Pérouse's raid; resident chief there from 1786." },
  { explorer: "Simon McTavish", waterway: "Pigeon River", year: 1776, notes: "At the Grand Portage rendezvous in 1776, where the arrangements were made that led to the North West Company he came to dominate." },
  { explorer: "Simon McTavish", waterway: "Lake Superior", year: 1776, notes: "Grand Portage on the lake's north shore was the North West Company's depot through his years at its head." },
  { explorer: "William McGillivray", waterway: "Kaministiquia River", year: 1803, notes: "Moved the North West Company's depot from Grand Portage to the Kaministiquia in 1803; Fort William there bore his name. Selkirk arrested him at the fort on 13 August 1816." },
  { explorer: "William McGillivray", waterway: "Lake Superior", year: 1803, notes: "The company's canoes ran from Montreal to its Lake Superior depot under his direction." },
  { explorer: "John McDonald of Garth", waterway: "North Saskatchewan River", year: 1795, notes: "In charge of building Fort Augustus, later Fort Edmonton, in 1795 and Rocky Mountain House in 1799." },
  { explorer: "John McDonald of Garth", waterway: "Columbia River", year: 1813, notes: "Sailed from London in February 1813 to take Fort Astoria for the North West Company, reaching the Columbia in the Raccoon." },
  { explorer: "Alexander Caulfield Anderson", waterway: "Fraser River", year: 1842, notes: "Based at Fort Alexandria on the Fraser from 1842 to 1848; his three expeditions of 1846-47 sought a brigade route from Kamloops to Fort Langley avoiding the Fraser canyons." },
  { explorer: "Alexander Caulfield Anderson", waterway: "Thompson River", year: 1846, notes: "Left Kamloops on the Thompson on 15 May 1846 to find a route to Fort Langley." },
  { explorer: "James Finlay", waterway: "Saskatchewan River", year: 1768, notes: "Took a canoe brigade up the Saskatchewan in 1768 and wintered at Nipawin, the first Montreal trader west of Lake Winnipeg after the Conquest." },
  { explorer: "Leif Erikson", waterway: "Strait of Belle Isle", year: 1000, notes: "The Norse site at L'Anse aux Meadows, dated to about the year 1000, stands at the strait's Newfoundland entrance; whether it is Leif's Vinland camp is not known." },
  { explorer: "Pierre Gaultier de Varennes, Sieur de La Vérendrye", waterway: "Assiniboine River", year: 1738, notes: "Built Fort La Reine on the Assiniboine in 1738 and turned the furs of the Assiniboine country toward the St. Lawrence." },
  { explorer: "Daniel Williams Harmon", waterway: "Assiniboine River", year: 1800, notes: "Posted first to Fort Alexandria on the upper Assiniboine, where he stayed five years." },
  { explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Lake Erie", year: 1679, notes: "Sailed the Griffon, the first ship on the upper lakes, across Lake Erie in August 1679 on the way to Michilimackinac." },
  { explorer: "Louis Jolliet", waterway: "Lake Erie", year: 1669, notes: "Returning from Lake Superior in 1669, came down by way of Lake Erie, the first recorded European passage of the lake." },
  { explorer: "Samuel de Champlain", waterway: "Minas Basin", year: 1604, notes: "Explored the head of the Bay of Fundy with de Monts in 1604 looking for the copper mines the Mi'kmaq spoke of; the French called the basin the Bassin des Mines." },
  { explorer: "David Thompson", waterway: "Reindeer Lake", year: 1796, notes: "In June 1796 set out with Ross over Cranberry Portage for Reindeer Lake, seeking the more direct route to Lake Athabasca." },
  { explorer: "David Buchan", waterway: "Notre Dame Bay", year: 1811, notes: "His expedition to the Beothuk in the winter of 1810-11 went from the Bay of Exploits up the frozen river." },
  { explorer: "Frederick Schwatka", waterway: "Tagish Lake", year: 1883, notes: "Passed through the lake on his raft journey down the Yukon from the headwater lakes in 1883." },
  { explorer: "Frederick Schwatka", waterway: "White River", year: 1883, notes: "Passed the silt-laden mouth of the White on his raft journey down the Yukon in 1883." },
];

// Indigenous names read in the waterways' Wikipedia articles today (infobox native_name or lead).
const INDIGENOUS_NAMES: Array<{ waterway: string; name: string; language: string }> = [
  { waterway: "Attawapiskat River", name: "Êh-tawâpiskât sîpiy", language: "Swampy Cree (Omushkegowuk)" },
  { waterway: "Fox River (Wisconsin)", name: "Meskwahkīw-Sīpiah", language: "Menominee" },
  { waterway: "Kootenay River", name: "aqkinmiluk", language: "Ktunaxa" },
  { waterway: "Liard River", name: "Nêtʼił Tué'", language: "Kaska" },
  { waterway: "Snake River", name: "Kimooenim", language: "Nez Perce" },
  { waterway: "Stewart River", name: "Nä`chòo ndek", language: "Hän" },
  { waterway: "White River", name: "Tadzan ndek", language: "Hän" },
  { waterway: "Terror Bay", name: "Amitruq", language: "Inuktitut" },
  { waterway: "Bay of Fundy", name: "Bakudabakek", language: "Mi'kmaq / Passamaquoddy" },
];

// A sentence in the William Stuart row had the order of events backwards: Kelsey's journey (1690-92) came before Stuart's (1715-16).
const BIO_FIXES: Array<{ explorer: string; from: string; to: string }> = [
  { explorer: "William Stuart", from: "His journey, though not well documented, preceded Henry Kelsey's more famous travels and provided", to: "His journey, though not well documented, came a generation after Henry Kelsey's travels of 1690-92 and provided" },
];

async function main() {
  const [waterways, explorers, figures, links] = await Promise.all([
    db.waterway.findMany({ select: { id: true, name: true, indigenousName: true, indigenousLanguage: true } }),
    db.explorer.findMany({ select: { id: true, name: true, biography: true } }),
    db.notableFigure.findMany({ select: { id: true, name: true, associatedLocations: true } }),
    db.explorerWaterway.findMany({ select: { explorerId: true, waterwayId: true } }),
  ]);
  const ww = new Map(waterways.map((w) => [w.name, w])); const ex = new Map(explorers.map((e) => [e.name, e]));
  const need = <T,>(m: Map<string, T>, k: string, what: string) => { const v = m.get(k); if (!v) throw new Error(`${what} not found: ${k}`); return v; };
  const have = new Set(links.map((l) => `${l.explorerId}|${l.waterwayId}`));

  const figureUpdates = Object.entries(FIGURE_WATERWAYS).map(([name, adds]) => {
    const f = figures.find((x) => x.name === name); if (!f) throw new Error(`figure not found: ${name}`);
    for (const a of adds) need(ww, a, "waterway");
    let cur: string[] = []; try { cur = JSON.parse(f.associatedLocations ?? "[]"); } catch { cur = []; }
    const next = [...cur, ...adds.filter((a) => !cur.includes(a))];
    return { id: f.id, name, before: f.associatedLocations, after: JSON.stringify(next), added: adds.filter((a) => !cur.includes(a)) };
  }).filter((u) => u.added.length);

  const linkRows = LINKS.map((l) => ({ explorerId: need(ex, l.explorer, "explorer").id, waterwayId: need(ww, l.waterway, "waterway").id, yearExplored: l.year, expeditionNotes: l.notes, label: `${l.explorer} → ${l.waterway} (${l.year})` })).filter((r) => !have.has(`${r.explorerId}|${r.waterwayId}`));

  const nameUpdates = INDIGENOUS_NAMES.map((n) => { const w = need(ww, n.waterway, "waterway"); return { id: w.id, name: w.name, before: { indigenousName: w.indigenousName, indigenousLanguage: w.indigenousLanguage }, indigenousName: n.name, indigenousLanguage: w.indigenousLanguage ?? n.language, skip: !!w.indigenousName }; }).filter((u) => !u.skip);

  const bioUpdates = BIO_FIXES.map((b) => { const e = need(ex, b.explorer, "explorer"); if (!e.biography?.includes(b.from)) return null; return { id: e.id, name: e.name, before: e.biography, after: e.biography.replace(b.from, b.to) }; }).filter((x): x is NonNullable<typeof x> => !!x);

  const backupFile = writeBackup("2026-10-18-sweep-1-before", { figures: figureUpdates.map((u) => ({ id: u.id, associatedLocations: u.before })), waterways: nameUpdates.map((u) => ({ id: u.id, ...u.before })), explorers: bioUpdates.map((u) => ({ id: u.id, biography: u.before })) });
  report("sweep pass 1", {
    figuresUpdated: figureUpdates.map((u) => `${u.name}: +${u.added.join(", ")}`), linksAdded: linkRows.map((r) => r.label), linksAlreadyPresent: LINKS.length - linkRows.length,
    indigenousNamesSet: nameUpdates.map((u) => `${u.name}: ${u.indigenousName} (${u.indigenousLanguage})`), biographiesFixed: bioUpdates.map((u) => u.name),
    unverifiableRowFlagged: "Richard Stuart (explorer): no such person in the Dictionary of Canadian Biography; the row says he accompanied William Stuart. Left untouched for the owner's decision.",
    backupFile,
  });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const u of figureUpdates) await tx.notableFigure.update({ where: { id: u.id }, data: { associatedLocations: u.after } });
    for (const r of linkRows) await tx.explorerWaterway.create({ data: { explorerId: r.explorerId, waterwayId: r.waterwayId, yearExplored: r.yearExplored, expeditionNotes: r.expeditionNotes } });
    for (const u of nameUpdates) await tx.waterway.update({ where: { id: u.id }, data: { indigenousName: u.indigenousName, indigenousLanguage: u.indigenousLanguage } });
    for (const u of bioUpdates) await tx.explorer.update({ where: { id: u.id }, data: { biography: u.after } });
  });
  const figs = await db.notableFigure.findMany({ select: { associatedLocations: true } }); const names = new Set(waterways.map((w) => w.name));
  report("verify", {
    links: await db.explorerWaterway.count(), waterwaysWithoutExplorer: (await db.waterway.findMany({ select: { _count: { select: { explorers: true } } } })).filter((w) => w._count.explorers === 0).length,
    explorersWithoutWaterway: (await db.explorer.findMany({ select: { _count: { select: { waterways: true } } } })).filter((e) => e._count.waterways === 0).length,
    figuresWithoutWaterway: figs.filter((f) => { try { return !(JSON.parse(f.associatedLocations ?? "[]") as string[]).some((x) => names.has(x)); } catch { return true; } }).length,
    waterwaysWithoutIndigenousName: await db.waterway.count({ where: { indigenousName: null } }),
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
