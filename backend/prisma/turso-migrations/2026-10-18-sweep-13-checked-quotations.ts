// Template-field sweep, pass 13 (2026-10-18): checked quotations back into three documents, and the
// Savanne River's explorer.
//   bun run prisma/turso-migrations/2026-10-18-sweep-13-checked-quotations.ts [--apply]
//
// Pass 11 set transcription and originalText to null on the 44 seed documents whose quoted text nobody
// had checked. The rule since then: a quotation goes back only when it has been read against a
// published edition. Three have been, each in the full text of the edition on the Internet Archive:
//   - Mackenzie's rock inscription: Voyages from Montreal (London, 1801), the entry for 22 July 1793
//     (archive.org/details/voyagesfrommontr00mack). The seed's "Alex Mackenzie from Canada by land
//     22d July 1793" is the abbreviated form on the modern monument, not Mackenzie's own words.
//   - Cartier's cross at Gaspé: H. P. Biggar, The Voyages of Jacques Cartier (Ottawa, 1924), the
//     first voyage, 24 July 1534 (archive.org/details/voyagesofjacques0000hpbi). Biggar's bracketed
//     insertions are kept. The seed named Donnacona in the passage; Biggar's text says "the chief".
//   - Hearne at the Coppermine: A Journey from Prince of Wales's Fort in Hudson's Bay to the Northern
//     Ocean, Champlain Society edition (Toronto, 1911), July 1771 (archive.org/details/
//     journeyfromprin00hear). The seed's passage ("thirty yards wide", "several pieces of ore") is not
//     in the published Journey, which gives one hundred and eighty yards and a single piece of copper
//     of any size; the published sentences replace it.
// Each document also gets a line in historicalContext naming the edition checked.
//
// Savanne River: Jacques de Noyon's 1688 route from Lake Superior to Rainy Lake (DCB: "up the
// Kaministikwia River and across Dog Lake to Rainy Lake") runs from Dog Lake over the height of land
// to the Savanne River and down it to Lac des Mille Lacs, the standard Kaministiquia canoe route; he
// is already linked to every other waterway on that route, and the Savanne was the last waterway in
// the database with no explorer that a source would support. Idempotent; backup before --apply.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const QUOTATIONS: Array<{ id: string; title: string; transcription: string; originalText?: string; checked: string }> = [
  {
    id: "cmlitwdb60000m2hgkv817kql", title: "Alexander Mackenzie's Rock Inscription at Bella Coola, July 1793",
    transcription: "I now mixed up some Vermillion in melted grease, and inscribed, in large characters, on the South-East face of the rock on which we had slept last night, this brief memorial — \"Alexander Mackenzie, from Canada, by land, the twenty-second of July, one thousand seven hundred and ninety-three.\"",
    checked: "Quotation checked against Alexander Mackenzie, Voyages from Montreal, on the River St. Laurence, through the Continent of North America, to the Frozen and Pacific Oceans (London, 1801), entry for 22 July 1793. The short form on the monument at Mackenzie Rock, \"Alex Mackenzie from Canada by land 22d July 1793\", is a modern abbreviation.",
  },
  {
    id: "cmlmsw8te0003m22soy6y49ik", title: "Cartier's Account of First Contact at Gaspé, July 1534",
    transcription: "On [Friday] the twenty-fourth of the said month [of July], we had a cross made thirty feet high, which was put together in the presence of a number of the Indians on the point at the entrance to this harbour, under the cross-bar of which we fixed a shield with three fleurs-de-lys in relief, and above it a wooden board, engraved in large Gothic characters, where was written, LONG LIVE THE KING OF FRANCE. [...] When we had returned to our ships, the chief, dressed in an old black bear-skin, arrived in a canoe with three of his sons and his brother; but they did not come so close to the ships as they had usually done. And pointing to the cross he [the chief] made us a long harangue, making the sign of the cross with two of his fingers; and then he pointed to the land all around about, as if he wished to say that all this region belonged to him, and that we ought not to have set up this cross without his permission.",
    originalText: "Le XXIIIIe jour dudict moys, nous fismes faire vne croix, de trente piedz de hault, qui fut faicte devant plusieurs d'eulx, sur la poincte de l'entrée dudit hable, soubz le croysillon de laquelle mismes vng escusson en bosse, a troys fleurs de lys, et dessus, vng escripteau en boys, engravé en grosse lettre de forme, ou il y avoit, VIVE LE ROY DE FRANCE. [...] Nous estans retournez en noz navires, vint le cappitaine, vestu d'vne vielle peau d'ours noire, dedans vne barque, aveques trois de ses filz et son frére, lesquelz ne aprochérent si prés du bort comme avoyent de coustume, et nous fit vne grande harangue, nous monstrant ladite croix, et faisant le signe de la croix avec deux doydz; et puis nous monstroit la terre, tout a l'entour de nous, comme s'il eust voullu dire, que toute la terre estoit à luy, et que nous ne devyons pas planter ladite croix sans son congé.",
    checked: "Quotation checked against H. P. Biggar, The Voyages of Jacques Cartier (Ottawa: Public Archives of Canada, 1924), the first voyage, 24 July 1534, English translation and the French text printed opposite; the words in square brackets are Biggar's. The narrative does not name the chief in this passage; he is Donnacona, named later in the account.",
  },
  {
    id: "cmlirhtnb000mm2hcbvv1aoop", title: "Samuel Hearne's Journey to the Coppermine River, July 1771",
    transcription: "On my arrival here I was not a little surprised to find the river differ so much from the description which the Indians had given of it at the Factory; for, instead of being so large as to be navigable for shipping, as it had been represented by them, it was at that part scarcely navigable for an Indian canoe, being no more than one hundred and eighty yards wide, every where full of shoals, and no less than three falls were in sight at first view. [...] This mine, if it deserve that appellation, is no more than an entire jumble of rocks and gravel, which has been rent many ways by an earthquake. Through these ruins there runs a small river; but no part of it, at the time I was there, was more than knee-deep. [...] my companions expended near four hours in search of some of this metal, with such poor success, that among us all, only one piece of any size could be found. This, however, was remarkably good, and weighed above four pounds.",
    checked: "Quotation checked against Samuel Hearne, A Journey from Prince of Wales's Fort in Hudson's Bay to the Northern Ocean, ed. J. B. Tyrrell (Toronto: Champlain Society, 1911), the entries for July 1771 at the Coppermine River and the copper mine. An earlier version of this document quoted a passage (\"thirty yards wide\", \"several pieces of ore\") that is not in the published Journey.",
  },
];

const LINKS: Array<{ explorer: string; waterway: string; yearExplored: number; expeditionNotes: string }> = [
  { explorer: "Jacques de Noyon", waterway: "Savanne River", yearExplored: 1688, expeditionNotes: "Came over the height of land from Dog Lake and down the Savanne to Lac des Mille Lacs in 1688, the Kaministiquia route to Rainy Lake on which he was the first Frenchman." },
];

async function main() {
  const docs = await db.primarySourceDocument.findMany({ where: { id: { in: QUOTATIONS.map((q) => q.id) } }, select: { id: true, title: true, transcription: true, originalText: true, historicalContext: true } });
  const docUp = QUOTATIONS.map((q) => {
    const d = docs.find((x) => x.id === q.id); if (!d) throw new Error(`document not found: ${q.id}`);
    if (d.title !== q.title) throw new Error(`title mismatch for ${q.id}: ${d.title}`);
    const ctx = d.historicalContext ?? "";
    const historicalContext = ctx.includes("Quotation checked against") ? ctx : `${ctx.trimEnd()}\n\n${q.checked}`;
    return { id: q.id, title: q.title, before: d, data: { transcription: q.transcription, originalText: q.originalText ?? null, historicalContext } };
  }).filter((u) => u.before.transcription !== u.data.transcription || u.before.originalText !== u.data.originalText || u.before.historicalContext !== u.data.historicalContext);
  const [ex, ww] = await Promise.all([db.explorer.findMany({ select: { id: true, name: true } }), db.waterway.findMany({ select: { id: true, name: true } })]);
  const linkRows = [];
  for (const l of LINKS) {
    const e = ex.find((x) => x.name === l.explorer); const w = ww.find((x) => x.name === l.waterway);
    if (!e || !w) throw new Error(`not found: ${l.explorer} / ${l.waterway}`);
    const exists = await db.explorerWaterway.findFirst({ where: { explorerId: e.id, waterwayId: w.id } });
    if (!exists) linkRows.push({ explorerId: e.id, waterwayId: w.id, yearExplored: l.yearExplored, expeditionNotes: l.expeditionNotes, label: `${l.explorer} → ${l.waterway} ${l.yearExplored}` });
  }
  const backupFile = writeBackup("2026-10-18-sweep-13-before", { documents: docUp.map((u) => u.before), links: "inserts only" });
  report("sweep pass 13: checked quotations, Savanne link", { documents: docUp.map((u) => u.title), links: linkRows.map((r) => r.label), backupFile });
  if (!APPLY) return;
  await db.$transaction(async (tx) => {
    for (const u of docUp) await tx.primarySourceDocument.update({ where: { id: u.id }, data: u.data });
    for (const { label: _l, ...r } of linkRows) await tx.explorerWaterway.create({ data: r });
  }, { timeout: 60000 });
  report("verify", {
    documentsWithTranscription: await db.primarySourceDocument.count({ where: { transcription: { not: null } } }),
    waterwaysWithoutExplorer: (await db.waterway.findMany({ where: { explorers: { none: {} } }, select: { name: true } })).map((w) => w.name),
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
