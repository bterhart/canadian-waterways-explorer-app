/**
 * open-data.ts — the records as open data (roadmap item 17, 2026-10-22).
 *
 * Every dataset here is read from Turso on request, shaped into flat rows, and served as CSV,
 * JSON or (where rows carry coordinates) GeoJSON by routes/open-data.ts. One licence covers the
 * text and metadata the project wrote; images and maps keep the credit and licence stated on each
 * record; curriculum outcomes, teaching material and anything about users, classes or teachers are
 * not exported. Results are cached in memory for ten minutes.
 */
import { db } from "../db";
import { kmlLines } from "./generated-printables";

export const OPEN_DATA = {
  title: "Canadian Interactive Waterways Initiative: open data",
  publisher: "Canadian Interactive Waterways Initiative",
  licence: { name: "Creative Commons Attribution 4.0 International (CC BY 4.0)", url: "https://creativecommons.org/licenses/by/4.0/" },
  attribution: "Canadian Interactive Waterways Initiative, open data, CC BY 4.0",
  scope: [
    "The licence covers the text and metadata written for this project: descriptions, biographies, notes, place and person records, events, connections, citations and reading guides, and the river geometry drawn for the map.",
    "Transcriptions of historical documents are public-domain texts checked against the published edition cited on each document; the edition is named in the citations dataset.",
    "Image and map URLs point at Wikimedia Commons or this project's copies of Commons files; each keeps the author and licence stated in its credit field. They are referenced, not relicensed.",
    "Not exported: provincial curriculum outcomes (the provinces' copyright), the teaching material (lessons, quizzes, trips, printables, comparisons), and anything about users, classes, teachers, journals or progress.",
  ],
  cacheSeconds: 600,
} as const;

type Row = Record<string, string | number | boolean | null>;
export type Format = "csv" | "json" | "geojson";
/** Most points a water's line keeps in the GeoJSON form. */
export const GEOMETRY_POINTS = 4000;

export interface Dataset {
  key: string;
  title: string;
  description: string;
  fields: [string, string][];
  /** Row keys that hold the point for GeoJSON, when rows are points. */
  point?: { lat: string; lng: string };
  /** Builds the LineString/MultiLineString geometries for every row at once, keyed by row id, when rows are lines. */
  lines?: () => Promise<Map<string, GeoJSON.Geometry>>;
  /** A cheap count for the index, for datasets whose load is expensive; others are counted by loading. */
  count?: () => Promise<number>;
  load: () => Promise<Row[]>;
}

// Minimal GeoJSON typing, enough for what is emitted.
export namespace GeoJSON {
  export type Position = [number, number];
  export type Geometry = { type: "Point"; coordinates: Position } | { type: "LineString"; coordinates: Position[] } | { type: "MultiLineString"; coordinates: Position[][] };
  export interface Feature { type: "Feature"; id?: string; geometry: Geometry | null; properties: Row }
  export interface FeatureCollection { type: "FeatureCollection"; features: Feature[]; licence?: typeof OPEN_DATA.licence; attribution?: string; generatedAt?: string }
}

const str = (v: unknown): string | null => (v === null || v === undefined ? null : String(v));

async function nameMaps() {
  const [ww, loc, ex, fig] = await Promise.all([
    db.waterway.findMany({ select: { id: true, name: true } }), db.location.findMany({ select: { id: true, name: true } }),
    db.explorer.findMany({ select: { id: true, name: true } }), db.notableFigure.findMany({ select: { id: true, name: true } }),
  ]);
  const m = (rows: { id: string; name: string }[]) => new Map(rows.map((r) => [r.id, r.name]));
  return { ww: m(ww), loc: m(loc), ex: m(ex), fig: m(fig) };
}
const nameOf = (map: Map<string, string>, id: string | null | undefined) => (id ? map.get(id) ?? null : null);

export const DATASETS: Dataset[] = [
  {
    key: "waterways", title: "Waterways", description: "Every river, lake, bay, strait and sound in the app, with its Indigenous name where one is recorded, its region, a centre point and whether drawn geometry exists. The GeoJSON form carries the geometry.",
    fields: [["id", "stable record id"], ["name", "name as shown"], ["indigenousName", "Indigenous name where recorded"], ["indigenousLanguage", "language of that name"], ["type", "River, Lake, Bay, Strait, Sound…"], ["regionName", "province, territory or region"], ["latitude", "centre point"], ["longitude", "centre point"], ["description", ""], ["historicalSignificance", ""], ["hasGeometry", "true when the GeoJSON form has a line for it"], ["imageUrl", "see scope: referenced, not relicensed"], ["videoUrl", ""]],
    // One query for every geometry, downsampled to at most GEOMETRY_POINTS points per water (the
    // drawn lines are far denser than any map needs; the full KML stays in the app's own API).
    lines: async () => {
      const out = new Map<string, GeoJSON.Geometry>();
      for (const w of await db.waterway.findMany({ where: { kmlData: { not: null } }, select: { id: true, kmlData: true } })) {
        const lines = kmlLines(w.kmlData!, GEOMETRY_POINTS);
        if (lines.length === 0) continue;
        out.set(w.id, lines.length === 1 ? { type: "LineString", coordinates: lines[0]! } : { type: "MultiLineString", coordinates: lines });
      }
      return out;
    },
    count: () => db.waterway.count(),
    // Raw so that the KML blobs (tens of megabytes across the table) are never read just to say whether they exist.
    load: async () => (await db.$queryRawUnsafe<{ id: string; name: string; indigenousName: string | null; indigenousLanguage: string | null; type: string; regionName: string; latitude: number; longitude: number; description: string; historicalSignificance: string | null; hasGeometry: number; imageUrl: string | null; videoUrl: string | null }[]>(
      `SELECT w.id, w.name, w.indigenousName, w.indigenousLanguage, t.name AS type, w.regionName, w.latitude, w.longitude, w.description, w.historicalSignificance, (w.kmlData IS NOT NULL) AS hasGeometry, w.imageUrl, w.videoUrl FROM "Waterway" w JOIN "WaterwayType" t ON t.id = w.typeId ORDER BY w.name`,
    )).map((w) => ({ ...w, hasGeometry: Number(w.hasGeometry) === 1 })),
  },
  {
    key: "waterway-connections", title: "Waterway connections", description: "How the waters join: which flows into which, which is part of which, which joins which. The graph behind the app's Follow the Water view.",
    fields: [["fromId", "waterway id"], ["fromName", ""], ["toId", "waterway id"], ["toName", ""], ["relation", "flows_into, part_of, joins…"], ["notes", ""]],
    load: async () => (await db.$queryRawUnsafe<{ fromId: string; fromName: string; toId: string; toName: string; relation: string; notes: string | null }[]>(`SELECT c.fromId, a.name AS fromName, c.toId, b.name AS toName, c.relation, c.notes FROM "WaterwayConnection" c JOIN "Waterway" a ON a.id = c.fromId JOIN "Waterway" b ON b.id = c.toId ORDER BY a.name, b.name`)).map((r) => ({ ...r })),
  },
  {
    key: "fur-trade", title: "Fur trade on the waters", description: "For each water with a fur-trade record: the company, the peak period, the furs and the route notes.",
    fields: [["waterwayId", ""], ["waterwayName", ""], ["tradingCompany", ""], ["peakTradePeriod", ""], ["primaryFurs", ""], ["tradeRouteNotes", ""]],
    load: async () => (await db.furTradeInfo.findMany({ include: { waterway: { select: { name: true } } }, orderBy: { waterway: { name: "asc" } } }))
      .map((f) => ({ waterwayId: f.waterwayId, waterwayName: f.waterway.name, tradingCompany: f.tradingCompany, peakTradePeriod: f.peakTradePeriod, primaryFurs: f.primaryFurs, tradeRouteNotes: f.tradeRouteNotes })),
  },
  {
    key: "locations", title: "Locations", description: "Forts, posts, settlements, portages and cultural sites, each on a water, with the year established where known.",
    fields: [["id", ""], ["name", ""], ["indigenousName", ""], ["indigenousLanguage", ""], ["locationType", "Fort, Trading Post, Settlement, Portage, Cultural Site…"], ["yearEstablished", ""], ["latitude", ""], ["longitude", ""], ["waterwayId", ""], ["waterwayName", ""], ["description", ""], ["historicalNotes", ""], ["imageUrl", "referenced, not relicensed"]],
    point: { lat: "latitude", lng: "longitude" },
    load: async () => (await db.location.findMany({ orderBy: { name: "asc" }, include: { waterway: { select: { name: true } } } }))
      .map((l) => ({ id: l.id, name: l.name, indigenousName: l.indigenousName, indigenousLanguage: l.indigenousLanguage, locationType: l.locationType, yearEstablished: l.yearEstablished, latitude: l.latitude, longitude: l.longitude, waterwayId: l.waterwayId, waterwayName: l.waterway.name, description: l.description, historicalNotes: l.historicalNotes, imageUrl: l.imageUrl })),
  },
  {
    key: "explorers", title: "Explorers", description: "The explorers, traders, surveyors and officers with a record in the app.",
    fields: [["id", ""], ["name", ""], ["birthYear", ""], ["deathYear", ""], ["nationality", ""], ["biography", ""], ["notableAchievements", ""], ["imageUrl", "referenced, not relicensed"]],
    load: async () => (await db.explorer.findMany({ orderBy: { name: "asc" } })).map((e) => ({ id: e.id, name: e.name, birthYear: e.birthYear, deathYear: e.deathYear, nationality: e.nationality, biography: e.biography, notableAchievements: e.notableAchievements, imageUrl: e.imageUrl })),
  },
  {
    key: "explorer-waterways", title: "Explorers on the waters", description: "Which explorer travelled which water, in which year, with notes.",
    fields: [["explorerId", ""], ["explorerName", ""], ["waterwayId", ""], ["waterwayName", ""], ["yearExplored", ""], ["expeditionNotes", ""]],
    load: async () => (await db.explorerWaterway.findMany({ include: { explorer: { select: { name: true } }, waterway: { select: { name: true } } }, orderBy: [{ explorer: { name: "asc" } }, { yearExplored: "asc" }] }))
      .map((x) => ({ explorerId: x.explorerId, explorerName: x.explorer.name, waterwayId: x.waterwayId, waterwayName: x.waterway.name, yearExplored: x.yearExplored, expeditionNotes: x.expeditionNotes })),
  },
  {
    key: "expeditions", title: "Expeditions", description: "Named expeditions with their years, summary and source.",
    fields: [["id", ""], ["explorerId", ""], ["explorerName", ""], ["name", ""], ["startYear", ""], ["endYear", ""], ["summary", ""], ["source", "where the legs were taken from"]],
    load: async () => (await db.expedition.findMany({ include: { explorer: { select: { name: true } } }, orderBy: { startYear: "asc" } }))
      .map((e) => ({ id: e.id, explorerId: e.explorerId, explorerName: e.explorer.name, name: e.name, startYear: e.startYear, endYear: e.endYear, summary: e.summary, source: e.source })),
  },
  {
    key: "expedition-legs", title: "Expedition legs", description: "Each expedition's route as ordered legs along the waters, with the place and year where known.",
    fields: [["expeditionId", ""], ["expeditionName", ""], ["explorerName", ""], ["orderIndex", "leg order"], ["waterwayId", ""], ["waterwayName", ""], ["locationId", ""], ["locationName", ""], ["year", ""], ["notes", ""]],
    load: async () => (await db.expeditionLeg.findMany({ include: { expedition: { select: { name: true, explorer: { select: { name: true } } } }, waterway: { select: { name: true } }, location: { select: { name: true } } }, orderBy: [{ expedition: { startYear: "asc" } }, { orderIndex: "asc" }] }))
      .map((l) => ({ expeditionId: l.expeditionId, expeditionName: l.expedition.name, explorerName: l.expedition.explorer.name, orderIndex: l.orderIndex, waterwayId: l.waterwayId, waterwayName: l.waterway.name, locationId: l.locationId, locationName: l.location?.name ?? null, year: l.year, notes: l.notes })),
  },
  {
    key: "notable-figures", title: "Notable figures", description: "Indigenous leaders, guides, interpreters, women and others in the record, with the explorers and places they are associated with.",
    fields: [["id", ""], ["name", ""], ["alternateNames", ""], ["birthYear", ""], ["deathYear", ""], ["nation", ""], ["birthPlace", ""], ["figureType", ""], ["role", ""], ["biography", ""], ["significance", ""], ["achievements", "JSON array"], ["associatedExplorers", "JSON array"], ["associatedLocations", "JSON array of names"], ["activePeriodStart", ""], ["activePeriodEnd", ""], ["imageUrl", "referenced, not relicensed"]],
    load: async () => (await db.notableFigure.findMany({ orderBy: { name: "asc" } })).map((f) => ({ id: f.id, name: f.name, alternateNames: f.alternateNames, birthYear: f.birthYear, deathYear: f.deathYear, nation: f.nation, birthPlace: f.birthPlace, figureType: f.figureType, role: f.role, biography: f.biography, significance: f.significance, achievements: f.achievements, associatedExplorers: f.associatedExplorers, associatedLocations: f.associatedLocations, activePeriodStart: f.activePeriodStart, activePeriodEnd: f.activePeriodEnd, imageUrl: f.imageUrl })),
  },
  {
    key: "timeline-events", title: "Timeline events", description: "Dated events on the app's timeline, each linked to its explorer, water or place where there is one.",
    fields: [["id", ""], ["year", ""], ["month", ""], ["day", ""], ["endYear", ""], ["isApproximate", ""], ["title", ""], ["description", ""], ["theme", ""], ["importance", ""], ["explorerId", ""], ["explorerName", ""], ["waterwayId", ""], ["waterwayName", ""], ["locationId", ""], ["locationName", ""]],
    load: async () => { const n = await nameMaps(); return (await db.timelineEvent.findMany({ orderBy: [{ year: "asc" }, { month: "asc" }, { day: "asc" }] })).map((t) => ({ id: t.id, year: t.year, month: t.month, day: t.day, endYear: t.endYear, isApproximate: t.isApproximate, title: t.title, description: t.description, theme: t.theme, importance: t.importance, explorerId: t.explorerId, explorerName: nameOf(n.ex, t.explorerId), waterwayId: t.waterwayId, waterwayName: nameOf(n.ww, t.waterwayId), locationId: t.locationId, locationName: nameOf(n.loc, t.locationId) })); },
  },
  {
    key: "historical-events", title: "What happened here", description: "Placed events for the nearby-history view, each with coordinates, a category and its links.",
    fields: [["id", ""], ["title", ""], ["description", ""], ["year", ""], ["month", ""], ["day", ""], ["isApproximate", ""], ["category", ""], ["significance", ""], ["latitude", ""], ["longitude", ""], ["locationName", "as written on the event"], ["explorerId", ""], ["waterwayId", ""], ["locationId", ""]],
    point: { lat: "latitude", lng: "longitude" },
    load: async () => (await db.historicalEvent.findMany({ orderBy: { year: "asc" } })).map((h) => ({ id: h.id, title: h.title, description: h.description, year: h.year, month: h.month, day: h.day, isApproximate: h.isApproximate, category: h.category, significance: h.significance, latitude: h.latitude, longitude: h.longitude, locationName: h.locationName, explorerId: h.explorerId, waterwayId: h.waterwayId, locationId: h.locationId })),
  },
  {
    key: "documents", title: "Primary source documents", description: "Published documents: who wrote them and when, the checked transcription where the app carries one, the historical context, and the spot on the water where the words were written or spoken. The edition each transcription was checked against is in the citations dataset under targetType document.",
    fields: [["id", ""], ["title", ""], ["documentType", ""], ["author", ""], ["originalDate", ""], ["originalYear", ""], ["gradeLevel", "reading band"], ["transcription", "checked text, or empty for a pointer document"], ["historicalContext", ""], ["explorerId", ""], ["waterwayId", ""], ["locationId", ""], ["spotName", ""], ["spotLatitude", ""], ["spotLongitude", ""], ["imageUrl", "referenced, not relicensed"]],
    point: { lat: "spotLatitude", lng: "spotLongitude" },
    load: async () => (await db.primarySourceDocument.findMany({ where: { isPublished: true }, orderBy: [{ originalYear: "asc" }, { title: "asc" }] })).map((d) => ({ id: d.id, title: d.title, documentType: d.documentType, author: d.author, originalDate: d.originalDate, originalYear: d.originalYear, gradeLevel: d.gradeLevel, transcription: d.transcription, historicalContext: d.historicalContext, explorerId: d.explorerId, waterwayId: d.waterwayId, locationId: d.locationId, spotName: d.spotName, spotLatitude: d.spotLatitude, spotLongitude: d.spotLongitude, imageUrl: d.imageUrl })),
  },
  {
    key: "citations", title: "Citations", description: "Every source cited on a record: the Dictionary of Canadian Biography, editions, archives, place-name authorities and the rest, with stable URLs where they exist.",
    fields: [["id", ""], ["targetType", "waterway, location, explorer, notable_figure, document, discovery…"], ["targetId", ""], ["sortOrder", ""], ["kind", "dcb, encyclopedia, edition, archive, place_name_record, parks_canada, book, article, web"], ["author", ""], ["title", ""], ["container", ""], ["publisher", ""], ["year", ""], ["pages", ""], ["url", ""], ["accessed", ""], ["note", ""]],
    load: async () => (await db.citation.findMany({ orderBy: [{ targetType: "asc" }, { targetId: "asc" }, { sortOrder: "asc" }] })).map((c) => ({ id: c.id, targetType: c.targetType, targetId: c.targetId, sortOrder: c.sortOrder, kind: c.kind, author: c.author, title: c.title, container: c.container, publisher: c.publisher, year: c.year, pages: c.pages, url: c.url, accessed: c.accessed, note: c.note })),
  },
  {
    key: "reading-guides", title: "Reading guides", description: "Further reading attached to waters, places, explorers and figures, with a reading band.",
    fields: [["id", ""], ["targetType", ""], ["targetId", ""], ["sortOrder", ""], ["title", ""], ["authorSource", ""], ["publisher", ""], ["year", ""], ["url", ""], ["description", ""], ["gradeLevel", ""]],
    load: async () => (await db.readingGuide.findMany({ orderBy: [{ targetType: "asc" }, { targetId: "asc" }, { sortOrder: "asc" }] })).map((g) => ({ id: g.id, targetType: g.targetType, targetId: g.targetId, sortOrder: g.sortOrder, title: g.title, authorSource: g.authorSource, publisher: g.publisher, year: g.year, url: g.url, description: g.description, gradeLevel: g.gradeLevel })),
  },
  {
    key: "pronunciations", title: "Pronunciation guide", description: "Indigenous place names, nations and fur-trade terms with a phonetic spelling, the language and the meaning where recorded.",
    fields: [["id", ""], ["term", ""], ["termType", "indigenous_place, indigenous_nation, indigenous_term, french, explorer"], ["language", ""], ["phonetic", ""], ["meaning", ""], ["notes", ""], ["waterwayId", ""], ["locationId", ""], ["explorerId", ""]],
    load: async () => (await db.pronunciationGuide.findMany({ orderBy: [{ termType: "asc" }, { term: "asc" }] })).map((p) => ({ id: p.id, term: p.term, termType: p.termType, language: p.language, phonetic: p.phonetic, meaning: p.meaning, notes: p.notes, waterwayId: p.waterwayId, locationId: p.locationId, explorerId: p.explorerId })),
  },
  {
    key: "knowledge-given", title: "Knowledge given", description: "Indigenous contributions as records: who gave what knowledge to whom, where, and what came of it.",
    fields: [["id", ""], ["title", ""], ["kind", ""], ["year", ""], ["yearLabel", ""], ["personName", ""], ["nation", ""], ["figureId", ""], ["explorerId", ""], ["explorerName", ""], ["waterwayId", ""], ["locationId", ""], ["latitude", "empty today; the records are placed through their water or location"], ["longitude", ""], ["given", ""], ["outcome", ""]],
    load: async () => (await db.knowledgeGiven.findMany({ orderBy: [{ year: "asc" }, { sortOrder: "asc" }] })).map((k) => ({ id: k.id, title: k.title, kind: k.kind, year: k.year, yearLabel: k.yearLabel, personName: k.personName, nation: k.nation, figureId: k.figureId, explorerId: k.explorerId, explorerName: k.explorerName, waterwayId: k.waterwayId, locationId: k.locationId, latitude: k.latitude, longitude: k.longitude, given: k.given, outcome: k.outcome })),
  },
  {
    key: "discoveries", title: "Archaeological discoveries", description: "Sites and finds, from L'Anse aux Meadows to the Franklin wrecks, with the year of discovery and the sources.",
    fields: [["id", ""], ["name", ""], ["discoveryYear", ""], ["description", ""], ["significance", ""], ["relatedExpedition", ""], ["relatedExplorerName", ""], ["expeditionYear", ""], ["latitude", ""], ["longitude", ""], ["locationDescription", ""], ["waterwayId", ""], ["sources", ""]],
    point: { lat: "latitude", lng: "longitude" },
    load: async () => (await db.archaeologicalDiscovery.findMany({ orderBy: { discoveryYear: "asc" } })).map((d) => ({ id: d.id, name: d.name, discoveryYear: d.discoveryYear, description: d.description, significance: d.significance, relatedExpedition: d.relatedExpedition, relatedExplorerName: d.relatedExplorerName, expeditionYear: d.expeditionYear, latitude: d.latitude, longitude: d.longitude, locationDescription: d.locationDescription, waterwayId: d.waterwayId, sources: d.sources })),
  },
  {
    key: "historical-maps", title: "Historic maps", description: "The maps in the gallery: mapmaker, year, what each shows and got wrong, its projection, and the corner coordinates used to lay it over the modern map.",
    fields: [["id", ""], ["title", ""], ["mapmaker", ""], ["mapmakerNation", ""], ["year", ""], ["yearLabel", ""], ["description", ""], ["whatItShows", ""], ["whatItGotWrong", ""], ["projection", ""], ["region", ""], ["imageUrl", "see imageCredit and imageLicense"], ["imageCredit", ""], ["imageLicense", ""], ["sourceUrl", ""], ["boundsSwLat", ""], ["boundsSwLng", ""], ["boundsNeLat", ""], ["boundsNeLng", ""], ["relatedWaterwayIds", "JSON array"], ["relatedExplorerIds", "JSON array"]],
    load: async () => (await db.historicalMap.findMany({ orderBy: { year: "asc" } })).map((m) => ({ id: m.id, title: m.title, mapmaker: m.mapmaker, mapmakerNation: m.mapmakerNation, year: m.year, yearLabel: m.yearLabel, description: m.description, whatItShows: m.whatItShows, whatItGotWrong: m.whatItGotWrong, projection: m.projection, region: m.region, imageUrl: m.imageUrl, imageCredit: m.imageCredit, imageLicense: m.imageLicense, sourceUrl: m.sourceUrl, boundsSwLat: m.boundsSwLat, boundsSwLng: m.boundsSwLng, boundsNeLat: m.boundsNeLat, boundsNeLng: m.boundsNeLng, relatedWaterwayIds: m.relatedWaterwayIds, relatedExplorerIds: m.relatedExplorerIds })),
  },
  {
    key: "then-and-now", title: "Then and now", description: "Pairs of a period view and a modern photograph of the same spot, with credits and source URLs for both.",
    fields: [["id", ""], ["title", ""], ["locationId", ""], ["waterwayId", ""], ["latitude", ""], ["longitude", ""], ["thenUrl", ""], ["thenYear", ""], ["thenYearLabel", ""], ["thenCaption", ""], ["thenCredit", ""], ["thenSourceUrl", ""], ["nowUrl", ""], ["nowYear", ""], ["nowCaption", ""], ["nowCredit", ""], ["nowSourceUrl", ""], ["note", ""]],
    point: { lat: "latitude", lng: "longitude" },
    load: async () => (await db.thenAndNow.findMany({ orderBy: { sortOrder: "asc" } })).map((p) => ({ id: p.id, title: p.title, locationId: p.locationId, waterwayId: p.waterwayId, latitude: p.latitude, longitude: p.longitude, thenUrl: p.thenUrl, thenYear: p.thenYear, thenYearLabel: p.thenYearLabel, thenCaption: p.thenCaption, thenCredit: p.thenCredit, thenSourceUrl: p.thenSourceUrl, nowUrl: p.nowUrl, nowYear: p.nowYear, nowCaption: p.nowCaption, nowCredit: p.nowCredit, nowSourceUrl: p.nowSourceUrl, note: p.note })),
  },
  {
    key: "indigenous-nations", title: "Indigenous nations", description: "Nations named in the records, with alternate names, language family and territory notes.",
    fields: [["id", ""], ["name", ""], ["alternateNames", ""], ["languageFamily", ""], ["traditionalTerritory", ""], ["culturalNotes", ""]],
    load: async () => (await db.indigenousNation.findMany({ orderBy: { name: "asc" } })).map((n) => ({ id: n.id, name: n.name, alternateNames: n.alternateNames, languageFamily: n.languageFamily, traditionalTerritory: n.traditionalTerritory, culturalNotes: n.culturalNotes })),
  },
  {
    key: "source-pairs", title: "Checking the record", description: "The 44 passages this app once carried unchecked and what the published edition showed: the kind of difference and what changed. The earlier text itself is not exported, because it is not the author's words.",
    fields: [["id", ""], ["documentId", ""], ["documentTitle", ""], ["seedTitle", "the title the passage was first carried under"], ["kind", "not_in_source, partly_in_source, paraphrase, number_changed, date_or_author, abbreviation, confirmed, unverifiable, no_such_document"], ["whatChanged", ""], ["gradeLevel", ""]],
    load: async () => { const docs = new Map((await db.primarySourceDocument.findMany({ select: { id: true, title: true } })).map((d) => [d.id, d.title])); return (await db.sourcePair.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } })).map((p) => ({ id: p.id, documentId: p.documentId, documentTitle: docs.get(p.documentId) ?? null, seedTitle: p.seedTitle, kind: p.kind, whatChanged: p.whatChanged, gradeLevel: p.gradeLevel })); },
  },
];

export const datasetByKey = (key: string) => DATASETS.find((d) => d.key === key) ?? null;
export const formatsFor = (d: Dataset): Format[] => (d.point || d.lines ? ["csv", "json", "geojson"] : ["csv", "json"]);

// ---- formatting
const csvCell = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  const s = typeof v === "string" ? v : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export function toCsv(d: Dataset, rows: Row[]): string {
  const cols = d.fields.map(([name]) => name);
  return [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\r\n") + "\r\n";
}
export function toJson(d: Dataset, rows: Row[]): string {
  return JSON.stringify({ dataset: d.key, title: d.title, description: d.description, licence: OPEN_DATA.licence, attribution: OPEN_DATA.attribution, generatedAt: new Date().toISOString(), count: rows.length, fields: Object.fromEntries(d.fields), rows });
}
export async function toGeoJson(d: Dataset, rows: Row[]): Promise<string> {
  const features: GeoJSON.Feature[] = [];
  const lines = d.lines ? await d.lines() : null;
  for (const row of rows) {
    let geometry: GeoJSON.Geometry | null = null;
    if (d.point) {
      const lat = Number(row[d.point.lat]), lng = Number(row[d.point.lng]);
      if (Number.isFinite(lat) && Number.isFinite(lng) && row[d.point.lat] !== null && row[d.point.lng] !== null) geometry = { type: "Point", coordinates: [lng, lat] };
    } else if (lines) {
      geometry = lines.get(String(row.id)) ?? null;
    }
    if (!geometry) continue;
    features.push({ type: "Feature", id: str(row.id) ?? undefined, geometry, properties: row });
  }
  const fc: GeoJSON.FeatureCollection = { type: "FeatureCollection", features, licence: OPEN_DATA.licence, attribution: OPEN_DATA.attribution, generatedAt: new Date().toISOString() };
  return JSON.stringify(fc);
}

// ---- cache
const cache = new Map<string, { builtAt: number; body: string }>();
export async function render(d: Dataset, format: Format): Promise<string> {
  const key = `${d.key}.${format}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.builtAt < OPEN_DATA.cacheSeconds * 1000) return hit.body;
  const rows = await d.load();
  const body = format === "csv" ? toCsv(d, rows) : format === "json" ? toJson(d, rows) : await toGeoJson(d, rows);
  cache.set(key, { builtAt: Date.now(), body });
  return body;
}

let indexCache: { builtAt: number; counts: number[] } | null = null;
export async function index(baseUrl: string) {
  if (!indexCache || Date.now() - indexCache.builtAt > OPEN_DATA.cacheSeconds * 1000) indexCache = { builtAt: Date.now(), counts: await Promise.all(DATASETS.map(async (d) => (d.count ? d.count() : (await d.load()).length))) };
  const counts = indexCache.counts;
  return {
    title: OPEN_DATA.title, publisher: OPEN_DATA.publisher, licence: OPEN_DATA.licence, attribution: OPEN_DATA.attribution, scope: OPEN_DATA.scope,
    documentation: `${baseUrl}/open-data`, generatedAt: new Date().toISOString(), cacheSeconds: OPEN_DATA.cacheSeconds,
    datasets: DATASETS.map((d, i) => ({ key: d.key, title: d.title, description: d.description, count: counts[i], fields: Object.fromEntries(d.fields), formats: Object.fromEntries(formatsFor(d).map((f) => [f, `${baseUrl}/api/open-data/${d.key}.${f}`])) })),
  };
}

export const MIME: Record<Format, string> = { csv: "text/csv; charset=utf-8", json: "application/json; charset=utf-8", geojson: "application/geo+json; charset=utf-8" };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** The human page at /open-data: licence, scope, how to cite, and every dataset with its fields and links. */
export async function landingHtml(baseUrl: string): Promise<string> {
  const idx = await index(baseUrl);
  const rows = idx.datasets.map((d) => `<section id="${d.key}"><h3>${esc(d.title)} <small>${d.count} rows</small></h3><p>${esc(d.description)}</p><p class="links">${Object.entries(d.formats).map(([f, u]) => `<a href="${u}">${f.toUpperCase()}</a>`).join(" · ")}</p><details><summary>Fields</summary><table>${Object.entries(d.fields).map(([n, desc]) => `<tr><td><code>${esc(n)}</code></td><td>${esc(desc)}</td></tr>`).join("")}</table></details></section>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(OPEN_DATA.title)}</title>
<style>body{font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:860px;margin:0 auto;padding:24px 20px 60px;color:#1F2937;line-height:1.55}h1{color:#1A3A24}h2{color:#2D5A3D;margin-top:2em}h3{margin:1.6em 0 .3em;color:#1A3A24}h3 small{font-weight:400;color:#6B7280;font-size:.8em}section{border-top:1px solid #E5E7EB;padding-top:4px}table{border-collapse:collapse;width:100%;font-size:14px}td{border-bottom:1px solid #F3F4F6;padding:4px 8px;vertical-align:top}code{background:#F3F4F6;padding:1px 5px;border-radius:4px}.links a{font-weight:700;color:#2D5A3D;margin-right:4px}pre{background:#F3F4F6;padding:12px;border-radius:8px;overflow:auto;font-size:13px}ul{padding-left:1.3em}summary{cursor:pointer;color:#3B82A3;font-weight:600}</style></head><body>
<h1>${esc(OPEN_DATA.title)}</h1>
<p>The records behind the Canadian Interactive Waterways Initiative app, read-only, in CSV, JSON and GeoJSON, as they stand in the live database at the moment of the request (cached ${OPEN_DATA.cacheSeconds / 60} minutes). Machine index: <a href="${baseUrl}/api/open-data"><code>${baseUrl}/api/open-data</code></a>.</p>
<h2>Licence</h2>
<p><a href="${OPEN_DATA.licence.url}">${esc(OPEN_DATA.licence.name)}</a>. Attribution: <em>${esc(OPEN_DATA.attribution)}</em>.</p>
<ul>${OPEN_DATA.scope.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
<h2>How to cite</h2>
<pre>${esc(OPEN_DATA.publisher)}. "${esc(OPEN_DATA.title)}", dataset &lt;key&gt;, retrieved &lt;date&gt; from ${baseUrl}/api/open-data/&lt;key&gt;.&lt;format&gt;. Licensed CC BY 4.0.</pre>
<p>Every row carries a stable <code>id</code>; a record in the app is reachable from it, and the citations dataset gives the sources behind each record by <code>targetType</code> and <code>targetId</code>.</p>
<h2>Datasets</h2>
${rows}
<p style="margin-top:3em;color:#6B7280;font-size:13px">Generated ${esc(idx.generatedAt)}. Questions and corrections through the app's About screen.</p>
</body></html>`;
}
