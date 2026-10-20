// A narration for the Athabasca River (owner, 2026-10-20: "The Athabasca River has no narration").
// The river had no document of any kind. This adds one checked transcription, read in a published
// edition under the rules of passes 13 and 15: Alexander Mackenzie's description of the Elk
// (Athabasca) River below the Clearwater fork, with its "bituminous fountains", from the General
// History of the Fur Trade that opens his Voyages from Montreal (London, 1801), read in the
// Project Gutenberg transcription of vol. I (eBook #35658), lines 2795-2817 of the plain text.
// Only text read in the edition goes into `transcription`; nothing is added or paraphrased.
//   bun run prisma/turso-migrations/2026-10-20-voice-athabasca.ts [--apply]
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const MACKENZIE_ID = "cmlhaslpq0005m2zhbi5xrrt6"; // Alexander Mackenzie, explorer row
const ATHABASCA_ID = "cmlhbjrpw0003m2mbmmpa8102"; // Athabasca River, waterway row
const DOC_ID = "psd_voice_athabasca_mackenzie";

const TRANSCRIPTION =
  "This river, which waters and reflects such enchanting scenery, runs, including its windings, upwards of eighty miles, when it discharges itself in the Elk River, according to the denomination of the natives, but commonly called by the white people, the Athabasca River, in latitude 56. 42. North. " +
  "At a small distance from Portage la Loche, several carrying-places interrupt the navigation of the river; about the middle of which are some mineral springs, whose margins are covered with sulphureous incrustations. At the junction or fork, the Elk River is about three quarters of a mile in breadth, and runs in a steady current, sometimes contracting, but never increasing its channel, till, after receiving several small streams, it discharges itself into the Lake of the Hills, in latitude 58. 36. North. At about twenty-four miles from the Fork, are some bituminous fountains, into which a pole of twenty feet long may be inserted without the least resistance. The bitumen is in a fluid state, and when mixed with gum, or the resinous substance collected from the spruce fir, serves to gum the canoes. In its heated state it emits a smell like that of sea-coal. The banks of the river, which are there very elevated, discover veins of the same bituminous quality. At a small distance from the Fork, houses have been erected for the convenience of trading with a party of the Knisteneaux, who visit the adjacent country for the purpose of hunting.";

const CHECKED =
  "Quotation checked against Alexander Mackenzie, Voyages from Montreal Through the Continent of North America to the Frozen and Pacific Oceans in 1789 and 1793 (London, 1801), the General History of the Fur Trade, the paragraphs on the Clearwater's fall into the Elk River and the Elk River to the Lake of the Hills, read in the Project Gutenberg transcription of vol. I (eBook #35658). The first river of the passage is the Clearwater, which Mackenzie has just described from the height above Portage la Loche.";

const HISTORICAL_CONTEXT =
  "Mackenzie came down this river for the first time in the autumn of 1787, on his way to winter with Peter Pond on the Athabasca, and it was his road to and from Fort Chipewyan for the next six years. In the General History of the Fur Trade that opens his Voyages he describes the route from Montreal to the Athabasca country as a trader knew it, and this is his account of the last stretch: the Clearwater falling into the river the Cree called the Elk and the traders the Athabasca, the fork where Fort McMurray stands now, and the oil sands twenty-four miles below it, where bitumen seeped from the high banks and the voyageurs mixed it with spruce gum to seal their canoes. The Cree and Dene had used the bitumen that way long before any trader saw it; Pond had passed the fountains in 1778, and Mackenzie's paragraph is the first printed description of them. The Knisteneaux are the Cree; the Lake of the Hills is Lake Athabasca; the \"houses\" near the fork were a North West Company post. Mackenzie's latitudes are his own.";

const VOCABULARY = [
  { word: "Elk River", definition: "Mackenzie's name for the Athabasca, from the Cree; the traders already called it the Athabasca" },
  { word: "bitumen", definition: "The thick natural tar of the oil sands, fluid enough in Mackenzie's day for a pole to sink twenty feet into it" },
  { word: "gum the canoes", definition: "To seal the seams of a birchbark canoe with spruce gum, here mixed with bitumen" },
  { word: "Knisteneaux", definition: "The Cree, in the spelling of the eighteenth-century traders" },
  { word: "Lake of the Hills", definition: "Lake Athabasca, where the river ends and Fort Chipewyan stood" },
  { word: "Portage la Loche", definition: "Methye Portage, the twenty-kilometre carry from the Churchill waters to the Clearwater and the Athabasca country" },
];

const QUESTIONS = [
  "What did the voyageurs use the bitumen for, and who had used it that way before them?",
  "Mackenzie gives the river two names. Whose name is each, and which one survived?",
  "What does this paragraph tell you about how a trader looked at a river: what did Mackenzie notice, and what did he leave out?",
  "The same bitumen is mined today on an industrial scale. What has changed about the river since Mackenzie described it, and what has not?",
];

async function main() {
  const [explorer, waterway, existing] = await Promise.all([
    db.explorer.findUnique({ where: { id: MACKENZIE_ID }, select: { id: true, name: true } }),
    db.waterway.findUnique({ where: { id: ATHABASCA_ID }, select: { id: true, name: true, latitude: true, longitude: true } }),
    db.primarySourceDocument.findUnique({ where: { id: DOC_ID } }),
  ]);
  const problems: string[] = [];
  if (!explorer || explorer.name !== "Alexander Mackenzie") problems.push(`explorer row ${MACKENZIE_ID} is not Alexander Mackenzie`);
  if (!waterway || waterway.name !== "Athabasca River") problems.push(`waterway row ${ATHABASCA_ID} is not the Athabasca River`);
  const docsOnRiver = await db.primarySourceDocument.count({ where: { waterwayId: ATHABASCA_ID } });
  const backupFile = writeBackup("2026-10-20-voice-athabasca-before", { existing, docsOnRiver });
  if (problems.length) { report("ABORT", { problems }); process.exitCode = 1; return; }

  const data = {
    title: "Mackenzie's Description of the Athabasca River and its Bituminous Fountains, 1787-1793",
    documentType: "report",
    author: "Alexander Mackenzie",
    originalDate: "The route as Mackenzie knew it, 1787-1793; published 1801",
    originalYear: 1787,
    originalText: null,
    transcription: TRANSCRIPTION,
    imageUrl: null,
    annotations: null,
    historicalContext: `${HISTORICAL_CONTEXT}\n\n${CHECKED}`,
    vocabulary: JSON.stringify(VOCABULARY),
    discussionQuestions: JSON.stringify(QUESTIONS),
    explorerId: MACKENZIE_ID,
    waterwayId: ATHABASCA_ID,
    locationId: null,
    gradeLevel: "7-9",
    isPublished: true,
    isCore: false,
    visibility: "private",
    createdById: null,
    // The bituminous fountains, about twenty-four miles below the Clearwater fork (site approximate)
    spotLatitude: 57.0,
    spotLongitude: -111.5,
    spotName: "The bituminous fountains of the Athabasca, below the Clearwater fork (site approximate)",
  };
  const citation = {
    targetType: "document",
    targetId: DOC_ID,
    sortOrder: 0,
    kind: "edition",
    author: "Alexander Mackenzie",
    title: "Voyages from Montreal Through the Continent of North America to the Frozen and Pacific Oceans in 1789 and 1793, vol. I: the General History of the Fur Trade",
    publisher: "London, 1801; Project Gutenberg eBook #35658",
    year: "1801",
    url: "https://www.gutenberg.org/ebooks/35658",
    accessed: "2026-10-20",
    note: "Edition against which the transcription was checked",
  };
  report("voice for the Athabasca River", { exists: !!existing, docsOnRiverBefore: docsOnRiver, title: data.title, spot: data.spotName, transcriptionLength: TRANSCRIPTION.length, backupFile });
  if (!APPLY) return;

  await db.primarySourceDocument.upsert({ where: { id: DOC_ID }, create: { id: DOC_ID, ...data }, update: data });
  const haveCitation = await db.citation.findFirst({ where: { targetType: "document", targetId: DOC_ID, kind: "edition" } });
  if (haveCitation) await db.citation.update({ where: { id: haveCitation.id }, data: citation });
  else await db.citation.create({ data: citation });

  const voices = await db.primarySourceDocument.findMany({ where: { waterwayId: ATHABASCA_ID, isPublished: true, transcription: { not: null }, spotLatitude: { not: null } }, select: { id: true, title: true } });
  const checkedCount = await db.primarySourceDocument.count({ where: { isPublished: true, transcription: { not: null }, spotLatitude: { not: null } } });
  report("verify", { voicesOnAthabasca: voices, checkedTranscriptionsWithSpot: checkedCount, citations: await db.citation.count({ where: { targetType: "document", targetId: DOC_ID } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
