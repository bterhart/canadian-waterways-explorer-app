// Historic map projections (2026-10-20, owner's instruction: "make note of the different map
// projection. That's an important differentiator as Mercator's projection was a seminal step
// forward in cartography.")
//   bun run prisma/turso-migrations/2026-10-20-historical-map-projections.ts [--apply]
//
// Fills HistoricalMap.projection (short label) and HistoricalMap.projectionNote (how the sheet is
// constructed, read from its graticule, and how it was placed for the overlay) for all 16 sheets.
// Every statement below was read from the sheet itself during the overlay work
// (2026-10-20-overlays-thompson-mackenzie.ts, scratchpad/georef): px-per-degree figures are the
// measured tick spacings, and the "drawn at" longitudes are where the sheet places the anchor.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const NOTES: { id: string; title: string; projection: string; projectionNote: string }[] = [
  {
    id: "cmveuocpq00017dwp6k54nque", title: "The Harleian mappemonde",
    projection: "Plane chart (Dieppe school)",
    projectionNote: "A portolan-style plane chart: coastlines fitted to compass bearings and rhumb lines radiating from wind roses, drawn before any projection in the mathematical sense was in use. There is no graticule to measure, so nothing on it can be laid over the live map; it is shown as an image only.",
  },
  {
    id: "cmveuocvy00057dwp5zibvasd", title: "Carte de la Nouvelle France (1632)",
    projection: "Trapezoidal (Champlain's own meridian)",
    projectionNote: "Degrees of latitude are numbered in equal cells down both sides, 62 N near the top to 38 N near the bottom, and degrees of longitude in cells along the top (36 px each) and the bottom (66 px each), so the straight meridians converge northward: a trapezoid. Champlain counted longitude from a meridian of his own; the overlay fixes it by placing Quebec, which he had observed, where the sheet draws it, which puts that meridian about 23.7 degrees west of Greenwich. The Great Lakes, known to him only by report, then fall well west of their true places.",
  },
  {
    id: "cmveuod1400097dwp62u7irbp", title: "Le Canada, ou Nouvelle France (1656)",
    projection: "Trapezoidal (Ferro meridian)",
    projectionNote: "Latitudes 65 N to 35 N are spaced evenly down both sides (81 px per degree); longitudes east of Ferro run 33 px per degree along the top and 68 along the bottom, so the meridians converge in the ratio of the cosines: a trapezoid. The sheet draws Quebec at 305.4 degrees from its prime meridian, which places that meridian about 16 degrees west of Greenwich rather than the 22 of the later convention; the overlay is fixed on Quebec, and Hudson Bay, Belle Isle and Port Nelson then fall close to their places.",
  },
  {
    id: "cmveuod69000c7dwp76n0dkde", title: "Novae Franciae accurata delineatio (1657)",
    projection: "Plane chart (no numbered graticule)",
    projectionNote: "A Jesuit engraving framed by scenes rather than a graticule: a tick scale of latitude down the left edge is all it carries, with no numbers and no scale of longitude, so there is nothing to re-project from. It is shown as an image only.",
  },
  {
    id: "cmveuodc7000f7dwpugkbxmn4", title: "Partie de la Nouvelle France (1685)",
    projection: "Trapezoidal (Ferro meridian)",
    projectionNote: "Latitudes 65 N to 45 N spaced evenly on both sides (104 px per degree); longitudes east of Ferro at 41 px per degree along the top and 75 along the bottom, the meridians converging on a vertical central meridian of 310: a trapezoid. The sheet draws Quebec at 317.9 degrees from its prime meridian, placing that meridian about 29 degrees west of Greenwich; the overlay is fixed on Quebec, so the St. Lawrence lies where it should and Hudson Bay shows the sheet's own error, some eight degrees too far east.",
  },
  {
    id: "cmveuodhz000i7dwpm1whdmgy", title: "Partie occidentale du Canada ou de la Nouvelle France (1688)",
    projection: "Trapezoidal (Ferro meridian)",
    projectionNote: "Latitudes 52 N to 34 N spaced evenly (134 px per degree); longitudes east of Ferro at 68 px per degree along the top and 100 along the bottom: a trapezoid. Coronelli, working from Jesuit reckonings, set the Great Lakes about ten degrees too far west of Ferro. The overlay is fixed by placing Michilimackinac where the sheet draws it, which brings Lakes Superior, Michigan and Huron close to their places while the Mississippi still runs well west of its true course.",
  },
  {
    id: "cmveuodn6000l7dwpi3s9jyh8", title: "La Louisiana, parte settentrionale (1696)",
    projection: "Trapezoidal (Ferro meridian)",
    projectionNote: "The Venetian sheet of the same survey as the 1688 map: latitudes 51 N to 39.5 N spaced evenly (183 px per degree); longitudes east of Ferro at 101 px per degree along the top and 123 along the bottom: a trapezoid. Fixed on Michilimackinac, as the 1688 sheet is; the upper lakes then sit close to their places and the south end of Lake Michigan is drawn some three degrees too far west.",
  },
  {
    id: "cmveuodsc000o7dwp4cm3lbq0", title: "Carte de la Rivière Longue (1703)",
    projection: "Trapezoidal (Ferro meridian)",
    projectionNote: "Latitudes 37 N to 51 N spaced evenly on the left (99 px per degree); longitudes east of Ferro along the bottom (86 px per degree at 37 N), the meridians converging northward by the cosine rule about the sheet's central meridian: a trapezoid. Ferro taken 20 degrees west of Paris, which puts Michilimackinac where the sheet draws it; west of there the sheet's geography is Lahontan's invention.",
  },
  {
    id: "cmveuodxl000s7dwpaxkx5xe3", title: "Carte du Canada ou de la Nouvelle France (1703)",
    projection: "Trapezoidal (Ferro meridian)",
    projectionNote: "Latitudes 40 N to 75 N spaced evenly with straight parallels (68 px per degree, both sides agree); longitudes east of Ferro along the bottom at 52 px per degree, converging to about 34 at the top, about a vertical central meridian of 290: a trapezoid. Ferro taken 20 degrees west of Paris, as the decree of 1634 fixed it.",
  },
  {
    id: "cmveuoe35000v7dwpkzi20b7w", title: "Carte de la Baye de Hudson (1744)",
    projection: "Trapezoidal (Paris meridian)",
    projectionNote: "Longitudes west of Paris at 27 px per degree along the top and 43 along the bottom, so the meridians converge: a trapezoid. Latitudes 51 N to 64 N spaced evenly on the sides. Paris lies 2.337 degrees east of Greenwich, which is how the sheet is placed.",
  },
  {
    id: "cmveuoe8f000y7dwp1trjr3hn", title: "A Map of the British and French Dominions in North America (1755)",
    projection: "Trapezoidal (London meridian)",
    projectionNote: "Longitudes west of London at 67 px per degree along the top (52 N) and 96 along the bottom (30 N), in the ratio of the cosines of the two latitudes: a trapezoid. Latitudes near uniform down the sides.",
  },
  {
    id: "cmveuoedl00117dwphrqyp79s", title: "Hudson's Bay's Country (1785)",
    projection: "Plate carrée",
    projectionNote: "A rectangular grid of equal degrees: longitudes west of Greenwich at 49 px per degree straight across the top, latitudes 60 N to 40 N at 93 px per degree down the right side. Degrees of longitude are drawn the same width at 66 N as at 35 N, so the north is stretched east-west; the overlay re-samples the sheet into Mercator spacing.",
  },
  {
    id: "cmveuoej000157dwplbnzhn0d", title: "A Map Exhibiting all the New Discoveries in the Interior Parts of North America (1795)",
    projection: "Conic, apex above the sheet",
    projectionNote: "The thirteen meridians labelled along both borders are straight lines that meet at a single apex 1,490 px above the top edge, turning 0.69 degrees of angle for each degree of longitude about a central meridian of 101.9 W; the parallels cross the sides as arcs of circles about a separate centre, 2,340 px in radius at 60 N and growing 65 px per degree southward. For the overlay every pixel of the Mercator copy is traced back along its meridian ray to the arc of its parallel.",
  },
  {
    id: "cmveuoeoo00197dwpvg0ilst4", title: "A Map of America Exhibiting Mackenzie's Track (1801)",
    projection: "Plate carrée",
    projectionNote: "A rectangular grid of equal degrees, 40 N to 70 N and 45 W to 180 W, carried by the inner neatline. A degree of longitude at 70 N is drawn the same width as one at 40 N, so the Arctic coast is stretched; the overlay re-samples the sheet into Mercator spacing.",
  },
  {
    id: "cmveuoeu2001d7dwpv140el2r", title: "Map of the North-West Territory of the Province of Canada (1814)",
    projection: "Mercator",
    projectionNote: "Longitudes uniform along both borders (92.5 px per degree, cylindrical) and the spacing of the parallels growing northward as Mercator's does, fitted on four places Thompson surveyed himself. The one sheet in the gallery drawn on the projection the live map uses, so it lies over it with no re-projection beyond a crop to the neatline.",
  },
  {
    id: "cmveuoez5001h7dwpyr3b2zk7", title: "Route of the Expedition from York Factory to Cumberland House and Isle à la Crosse, 1819 and 1820 (1823)",
    projection: "Plate carrée",
    projectionNote: "Longitudes of Greenwich at 117 px per degree along both borders and latitudes at 203 px per degree: a rectangular grid of equal degrees over a small span, re-sampled into Mercator spacing for the overlay.",
  },
];

async function main() {
  const rows = await db.historicalMap.findMany({ select: { id: true, title: true, projection: true, projectionNote: true }, orderBy: { year: "asc" } });
  const missing = NOTES.filter((n) => !rows.some((r) => r.id === n.id));
  const unnoted = rows.filter((r) => !NOTES.some((n) => n.id === r.id));
  const titleMismatch = NOTES.filter((n) => rows.find((r) => r.id === n.id)?.title !== n.title);
  if (missing.length || unnoted.length || titleMismatch.length) {
    report("ABORT: NOTES and Turso disagree", { missing, unnoted: unnoted.map((r) => r.title), titleMismatch: titleMismatch.map((n) => n.title) });
    process.exitCode = 1;
    return;
  }
  const backupFile = writeBackup("2026-10-20-historical-map-projections-before", { maps: rows });
  report("projection notes", { count: NOTES.length, backupFile, plan: NOTES.map((n) => ({ title: n.title, projection: n.projection })) });
  if (!APPLY) return;
  for (const n of NOTES) {
    await db.historicalMap.update({ where: { id: n.id }, data: { projection: n.projection, projectionNote: n.projectionNote } });
  }
  const verify = await db.historicalMap.findMany({ select: { title: true, projection: true, projectionNote: true }, orderBy: { year: "asc" } });
  report("verify", { verify: verify.map((v) => ({ title: v.title, projection: v.projection, noteChars: v.projectionNote?.length ?? 0 })) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
