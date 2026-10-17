// Explorer–waterway links the narratives already imply but the data did not carry (2026-10-17).
//   bun run prisma/turso-migrations/2026-10-17-link-gaps.ts [--apply]
//
// Found by reading every waterway's text for explorer names with no link and every explorer's
// text for waterway names with no link (owner's Mattawa River example: the text names Champlain
// and Brûlé; only Champlain was linked). Each link below was checked against the Dictionary of
// Canadian Biography entry or the explorer's own narrative before it was written; false hits of
// the text match (Hudson's Bay Company for Henry Hudson, James Bay for Thomas James at Nootka,
// Fort Simpson for George Simpson, and so on) were discarded. One sentence of waterway text that
// was wrong is corrected here too, with a backup: Chesterfield Inlet was explored in 1762 by
// Moses Norton of the Hudson's Bay Company, not by Hearne in 1770.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const LINKS: Array<{ explorer: string; waterway: string; year: number; notes: string }> = [
  { explorer: "Etienne Brule", waterway: "Mattawa River", year: 1610, notes: "Went up the Ottawa and the Mattawa to Lake Nipissing and the Wendat country in 1610, the first European to travel the route, and again with Champlain in 1615." },
  { explorer: "Etienne Brule", waterway: "French River", year: 1610, notes: "Descended the French River to Georgian Bay with the Wendat in 1610 and with Champlain in 1615." },
  { explorer: "Etienne Brule", waterway: "Lake Nipissing", year: 1610, notes: "Crossed Nipissing country on the way to the Wendat in 1610; the Nipissing were his hosts." },
  { explorer: "Thomas James", waterway: "James Bay", year: 1631, notes: "Wintered on Charlton Island in the bay in 1631-32 with the Henrietta Maria; the bay is named for him." },
  { explorer: "Thomas James", waterway: "Hudson Bay", year: 1631, notes: "Crossed the bay to its west shore in the summer of 1631 and met Luke Foxe there before turning south." },
  { explorer: "Luke Foxe", waterway: "Hudson Bay", year: 1631, notes: "Surveyed the west coast of the bay from Roes Welcome to Cape Henrietta Maria in 1631 and judged there was no passage." },
  { explorer: "Thomas Button", waterway: "Hudson Bay", year: 1612, notes: "First to cross the bay to its western shore, 1612, searching for Hudson and the passage." },
  { explorer: "Thomas Button", waterway: "Nelson River", year: 1612, notes: "Wintered at the mouth of the river in 1612-13 and named it for his sailing master, Robert Nelson, who died there." },
  { explorer: "Samuel de Champlain", waterway: "Saint John River", year: 1604, notes: "Entered and named the river with de Monts on 24 June 1604, Saint John the Baptist's day." },
  { explorer: "Jean Nicolet", waterway: "St. Lawrence River", year: 1618, notes: "Came to Quebec in 1618 and lived among the Algonquin of Allumette Island and the Nipissing for years before his 1634 journey west." },
  { explorer: "Medard des Groseilliers", waterway: "Lake Superior", year: 1659, notes: "Wintered on the south shore of Lake Superior with Radisson in 1659-60 and heard from the Cree of the rich fur country toward Hudson Bay." },
  { explorer: "Medard des Groseilliers", waterway: "Hudson Bay", year: 1668, notes: "Reached the bay in the Nonsuch in 1668 and wintered at the mouth of the Rupert River: the voyage that led to the Hudson's Bay Company's charter in 1670." },
  { explorer: "Daniel Greysolon Dulhut", waterway: "Lake Nipigon", year: 1684, notes: "Built a post on Lake Nipigon in 1684 to intercept the furs going north to the English on Hudson Bay." },
  { explorer: "Jacques de Noyon", waterway: "Lake Superior", year: 1688, notes: "Left Lake Superior by the Kaministiquia in 1688 and reached Rainy Lake, the first European on the route to the west." },
  { explorer: "Jean-Baptiste Gaultier de La Vérendrye", waterway: "Lake Superior", year: 1731, notes: "Went ahead of his father from Grand Portage on Lake Superior in 1731 to build Fort St. Pierre on Rainy Lake." },
  { explorer: "Jean-Baptiste Gaultier de La Vérendrye", waterway: "Lake of the Woods", year: 1732, notes: "Built Fort St. Charles on Lake of the Woods in 1732 and was killed with twenty others on an island in the lake in June 1736." },
  { explorer: "Henry Kelsey", waterway: "Hudson Bay", year: 1684, notes: "Served at York Factory on the bay from 1684; set out from it in 1690 for the plains and returned to it in 1692." },
  { explorer: "Anthony Henday", waterway: "Hudson Bay", year: 1754, notes: "Left York Factory on the bay in June 1754 with Cree companions for the Blackfoot country and returned in June 1755." },
  { explorer: "Samuel Hearne", waterway: "Hudson Bay", year: 1769, notes: "Set out from Prince of Wales Fort on the bay on all three journeys, 1769-1772; later governor of the fort." },
  { explorer: "Moses Norton", waterway: "Chesterfield Inlet", year: 1762, notes: "Explored the inlet to its head in a Hudson's Bay Company sloop in 1762 and found it closed; no passage lay there." },
  { explorer: "Matthew Cocking", waterway: "Hudson Bay", year: 1772, notes: "Left York Factory in 1772 to winter with the Blackfoot and report on the inland trade; later master at York Factory and Severn." },
  { explorer: "Philip Turnor", waterway: "Hudson Bay", year: 1778, notes: "The Hudson's Bay Company's first inland surveyor, from York Factory in 1778." },
  { explorer: "Philip Turnor", waterway: "Lake Athabasca", year: 1791, notes: "Surveyed Lake Athabasca in 1791-92 with Peter Fidler and fixed its longitude, correcting Peter Pond's map." },
  { explorer: "William Tomison", waterway: "Saskatchewan River", year: 1776, notes: "Ran the Hudson's Bay Company's inland trade on the Saskatchewan from Cumberland House, Hudson House, Manchester House and Buckingham House, 1776-1800." },
  { explorer: "Duncan McGillivray", waterway: "Saskatchewan River", year: 1794, notes: "Clerk at Fort George on the North Saskatchewan in 1794-95; his journal records the trade war with the Hudson's Bay Company there." },
  { explorer: "Roderick Mackenzie", waterway: "Lake Athabasca", year: 1788, notes: "Built Fort Chipewyan on the lake in 1788 for the North West Company and kept it while his cousin Alexander went to the Arctic and the Pacific." },
  { explorer: "Alexander Henry the Younger", waterway: "Red River", year: 1800, notes: "Kept the North West Company's post at Pembina on the Red River from 1800 to 1808; his journal is the fullest record of the valley in those years." },
  { explorer: "George Simpson", waterway: "Hudson Bay", year: 1821, notes: "Governed the Hudson's Bay Company's territories from York Factory on the bay after the merger of 1821." },
  { explorer: "Alexander Ross", waterway: "Red River", year: 1825, notes: "Settled at Red River in 1825, became sheriff of Assiniboia, and wrote The Red River Settlement (1856)." },
  { explorer: "John Palliser", waterway: "Saskatchewan River", year: 1857, notes: "Explored the Saskatchewan country and its tributaries in 1857-59 for the British government and mapped the fertile belt." },
  { explorer: "Joseph Burr Tyrrell", waterway: "Hudson Bay", year: 1893, notes: "Ended his Barren Lands traverses of 1893 and 1894 on the west coast of the bay and walked south to Churchill and York Factory." },
  { explorer: "Sir John Franklin", waterway: "Back River", year: 1848, notes: "The survivors of his expedition, under Crozier, set out for the river in April 1848 after abandoning the ships; their remains were found along the coast toward it." },
  { explorer: "Charles William Barkley", waterway: "Clayoquot Sound", year: 1787, notes: "Traded with Wickaninnish's people in the sound in July 1787 and named it Wickaninnish's Sound." },
  { explorer: "Dionisio Alcalá Galiano", waterway: "Burrard Inlet", year: 1792, notes: "Met Vancouver off Point Grey on 22 June 1792 and surveyed the inlet and the Strait of Georgia in company with him." },
  { explorer: "Cayetano Valdés", waterway: "Burrard Inlet", year: 1792, notes: "Commanded the Mexicana when the Spanish and British met off Point Grey in June 1792 and shared their surveys." },
  { explorer: "Captain George Vancouver", waterway: "Friendly Cove (Yuquot)", year: 1792, notes: "Met Bodega y Quadra at Yuquot in August-September 1792 to settle the Nootka Convention; they could not agree and referred it home." },
];

const TEXT_FIXES: Array<{ waterway: string; field: "historicalSignificance" | "description"; from: string; to: string }> = [
  { waterway: "Chesterfield Inlet", field: "historicalSignificance", from: "Explored by Samuel Hearne in 1770 while searching for copper deposits.", to: "Explored to its head in 1762 by Moses Norton of the Hudson's Bay Company, who found it closed; Hearne's overland journeys of 1769-1772 passed well to the west of it." },
];

async function main() {
  const [explorers, waterways, existing] = await Promise.all([
    db.explorer.findMany({ select: { id: true, name: true } }),
    db.waterway.findMany({ select: { id: true, name: true, historicalSignificance: true, description: true } }),
    db.explorerWaterway.findMany({ select: { explorerId: true, waterwayId: true } }),
  ]);
  const ex = new Map(explorers.map((e) => [e.name, e.id])); const ww = new Map(waterways.map((w) => [w.name, w.id]));
  const need = (m: Map<string, string>, k: string, what: string) => { const v = m.get(k); if (!v) throw new Error(`${what} not found: ${k}`); return v; };
  const rows = LINKS.map((l) => ({ explorerId: need(ex, l.explorer, "explorer"), waterwayId: need(ww, l.waterway, "waterway"), yearExplored: l.year, expeditionNotes: l.notes, label: `${l.explorer} → ${l.waterway} (${l.year})` }));
  const fresh = rows.filter((r) => !existing.some((x) => x.explorerId === r.explorerId && x.waterwayId === r.waterwayId));
  const fixes = TEXT_FIXES.map((f) => { const w = waterways.find((x) => x.name === f.waterway); if (!w) throw new Error(`waterway not found: ${f.waterway}`); const cur = w[f.field] ?? ""; if (!cur.includes(f.from)) throw new Error(`text not found in ${f.waterway}.${f.field}: ${f.from}`); return { id: w.id, name: w.name, field: f.field, before: cur, after: cur.replace(f.from, f.to) }; });
  const backupFile = writeBackup("2026-10-17-link-gaps-before", { textFixes: fixes.map((f) => ({ id: f.id, field: f.field, before: f.before })) });
  report("explorer–waterway link gaps", { toInsert: fresh.map((r) => r.label), alreadyLinked: rows.length - fresh.length, textFixes: fixes.map((f) => `${f.name}.${f.field}`), backupFile });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const r of fresh) { const { label, ...data } = r; await tx.explorerWaterway.create({ data }); }
    for (const f of fixes) await tx.waterway.update({ where: { id: f.id }, data: { [f.field]: f.after } });
  });
  report("verify", { explorerWaterway: await db.explorerWaterway.count(), mattawa: await db.waterway.findFirst({ where: { name: "Mattawa River" }, select: { explorers: { select: { yearExplored: true, explorer: { select: { name: true } } } } } }).then((w) => w?.explorers.map((e) => `${e.explorer.name} ${e.yearExplored}`)) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
