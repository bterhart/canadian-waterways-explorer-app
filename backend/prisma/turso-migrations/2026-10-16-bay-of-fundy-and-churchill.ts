// Decision 7 (2026-10-16): put Port-Royal and the Churchill-mouth forts on the right water.
//   bun run prisma/turso-migrations/2026-10-16-bay-of-fundy-and-churchill.ts [--apply]
//
// Bay of Fundy — a new Waterway (type Bay). Geometry: OpenStreetMap relation exported with
// scripts/export-waterway-kml.ts --name="Bay of Fundy" --lat=45.1 --lng=-65.6 --type=lake
// (the lake branch queries natural=bay; 1 relation, 15,148 points, bbox
// [-66.95,44.21,-64.94,45.49], anchor inside). Imagery: four Wikimedia Commons files with
// their licences recorded, served as Special:FilePath URLs (R2 credentials are not available
// in this session; the image-health job accepts this form). Champlain gets an
// ExplorerWaterway row (1604). Three reading-guide entries. Port-Royal moves here from the
// St. Lawrence row.
//
// Churchill River — the row named "Churchill River (Saskatchewan)" already carries the whole
// river: its KML runs from -108.38 to -94.18 longitude and up to 58.79 latitude, i.e. to the
// mouth at Churchill, Manitoba (measured 2026-10-16). A second "Manitoba" row would duplicate
// that geometry, so the row is renamed "Churchill River" and the merged Fort Churchill moves
// onto it from Hudson Bay, beside Prince of Wales Fort which was already there. The region
// string "Saskatchewan / Manitoba" is unchanged. The home-map overview must be rebuilt
// afterwards (bun run build:waterway-overview -- --types=River --out=generated/river-overview.json)
// because it carries the name.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const KML_FILE = resolve(import.meta.dir, "..", "..", "generated", "kml-exports", "bay-of-fundy.kml");
const FUNDY_ID = "bay-of-fundy-waterway";
const filePath = (name: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=1280`;

const FUNDY = {
  id: FUNDY_ID,
  name: "Bay of Fundy",
  indigenousName: null as string | null, // not asserted here; the Mi'kmaq name should be added from a published source
  indigenousLanguage: null as string | null,
  description:
    "The great funnel-shaped bay between New Brunswick and Nova Scotia, famous for the highest tides in the world. Its shores held the first French settlements in Acadia: Île Sainte-Croix in 1604 and Port-Royal on the Annapolis Basin in 1605.",
  historicalSignificance:
    "Samuel de Champlain and Pierre Dugua de Mons explored and charted the bay in 1604 and 1605, and Port-Royal became the first lasting French settlement north of Florida. The bay was the heart of Acadia for a century and a half, contested by France and England until the deportation of the Acadians that began in 1755.",
  latitude: 45.1,
  longitude: -65.6,
  regionName: "New Brunswick / Nova Scotia",
  imageUrl: filePath("Bay of Fundy at Low Tide.jpg"),
  galleryImages: JSON.stringify([
    { url: filePath("Bay of Fundy at Low Tide.jpg"), caption: "Sea fog over the Fundy shore at low tide near Alma, New Brunswick", credit: "Wikimedia Commons / Eric Van Lochem / CC BY-SA 4.0" },
    { url: filePath("Bay of Fundy (1644081626).jpg"), caption: "The Bay of Fundy coast", credit: "Wikimedia Commons / Ian Mackenzie / CC BY 2.0" },
    { url: filePath("Isle Haute, Bay of Fundy.jpg"), caption: "Isle Haute seen from Harbourville, Nova Scotia, at low tide", credit: "Wikimedia Commons / Madereugeneandrew / CC BY-SA 3.0" },
    { url: filePath("Bay of Fundy, Canada (ASTER).jpg"), caption: "The bay from space; the tidal range here reaches 16.8 metres", credit: "NASA/METI/AIST/Japan Space Systems and U.S./Japan ASTER Science Team / Public domain" },
  ]),
};

const FUNDY_GUIDE = [
  { title: "Bay of Fundy", authorSource: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bay_of_Fundy", description: "Geography, tides and the Acadian history of the bay.", gradeLevel: "7-9" },
  { title: "Port-Royal National Historic Site", authorSource: "Parks Canada", url: "https://www.pc.gc.ca/en/lhn-nhs/ns/portroyal", description: "The reconstructed 1605 Habitation and the story of Champlain, Dugua de Mons and the Order of Good Cheer.", gradeLevel: "7-9" },
  { title: "The Works of Samuel de Champlain (6 vols)", authorSource: "Biggar H.P. ed.", publisher: "Champlain Society", year: "1922–1936", description: "Champlain's own account and charts of the 1604–1607 Acadian voyages along the Bay of Fundy.", gradeLevel: "10-12" },
];

async function main() {
  const bayType = await db.waterwayType.findFirst({ where: { name: "Bay" } });
  const champlain = await db.explorer.findFirst({ where: { name: "Samuel de Champlain" } });
  const portRoyal = await db.location.findFirst({ where: { name: { startsWith: "Port-Royal" } }, include: { waterway: { select: { name: true } } } });
  const churchill = await db.waterway.findFirst({ where: { name: "Churchill River (Saskatchewan)" } });
  const hudsonBay = await db.waterway.findFirst({ where: { name: "Hudson Bay" } });
  const fortChurchill = await db.location.findFirst({ where: { name: "Fort Churchill" }, include: { waterway: { select: { name: true } } } });
  const existingFundy = await db.waterway.findFirst({ where: { name: "Bay of Fundy" } });
  if (!bayType || !champlain || !portRoyal || !churchill || !hudsonBay || !fortChurchill) throw new Error("A required row is missing");
  const kml = readFileSync(KML_FILE, "utf8");
  const nameRefs = (await db.notableFigure.findMany({ select: { name: true, associatedLocations: true } })).filter((f) => (f.associatedLocations ?? "").includes("Churchill River (Saskatchewan)"));

  const backupFile = writeBackup("2026-10-16-bay-of-fundy-and-churchill-before", {
    portRoyal, fortChurchill, churchill: { ...churchill, kmlData: `${churchill.kmlData?.length ?? 0} bytes (unchanged)` }, newBayOfFundyKml: kml,
  });
  report("bay of fundy + churchill", {
    bayOfFundy: { exists: !!existingFundy, kmlBytes: kml.length, images: JSON.parse(FUNDY.galleryImages).length, explorer: `${champlain.name} 1604`, guides: FUNDY_GUIDE.length },
    portRoyal: { id: portRoyal.id, from: portRoyal.waterway.name, to: FUNDY.name },
    churchill: { id: churchill.id, rename: `${churchill.name} → Churchill River`, figureTextRefs: nameRefs.map((f) => f.name) },
    fortChurchill: { id: fortChurchill.id, from: fortChurchill.waterway.name, to: "Churchill River" },
    backupFile,
  });
  if (existingFundy) throw new Error("Bay of Fundy already exists");
  if (!APPLY) return;

  await db.$transaction(async (tx) => {
    await tx.waterway.create({ data: { ...FUNDY, typeId: bayType.id, kmlData: kml } });
    await tx.explorerWaterway.create({ data: { explorerId: champlain.id, waterwayId: FUNDY_ID, yearExplored: 1604, expeditionNotes: "Surveyed the bay with Pierre Dugua de Mons in 1604 and wintered at Port-Royal from 1605; his charts of the Fundy coast were the first detailed European maps of it." } });
    await tx.readingGuide.createMany({ data: FUNDY_GUIDE.map((g, i) => ({ id: `rg_waterway_${FUNDY_ID}_${i}`, targetType: "waterway", targetId: FUNDY_ID, sortOrder: i, title: g.title, authorSource: g.authorSource, publisher: g.publisher ?? null, year: g.year ?? null, url: g.url ?? null, description: g.description, gradeLevel: g.gradeLevel })) });
    await tx.location.update({ where: { id: portRoyal.id }, data: { waterwayId: FUNDY_ID } });
    await tx.waterway.update({ where: { id: churchill.id }, data: { name: "Churchill River" } });
    await tx.location.update({ where: { id: fortChurchill.id }, data: { waterwayId: churchill.id } });
  });

  report("verify", {
    fundy: await db.waterway.findFirst({ where: { id: FUNDY_ID }, select: { name: true, type: { select: { name: true } }, _count: { select: { locations: true, explorers: true } } } }),
    fundyGuides: await db.readingGuide.count({ where: { targetId: FUNDY_ID } }),
    churchill: await db.waterway.findFirst({ where: { id: churchill.id }, select: { name: true, regionName: true, locations: { select: { name: true } } } }),
    hudsonBayLocations: (await db.location.findMany({ where: { waterwayId: hudsonBay.id }, select: { name: true } })).map((l) => l.name),
    portRoyal: await db.location.findFirst({ where: { id: portRoyal.id }, select: { waterway: { select: { name: true } } } }),
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
