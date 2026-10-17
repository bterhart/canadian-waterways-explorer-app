// Apply content pack 1, New France to the Gulf (packs/new-france-to-the-gulf.ts).
//   bun run prisma/turso-migrations/2026-10-17-pack-new-france-to-the-gulf.ts [--apply]
//
// Dry run resolves every name to a live id, checks every image URL answers 200, reads the
// exported KML files and prints what would be written. --apply writes everything in one
// transaction after a JSON backup of the rows it touches (the existing events it backfills).
// Idempotent: a waterway, explorer, location, figure, event, pronunciation, quiz, lesson or
// field trip whose name/title already exists is skipped and reported, never duplicated.
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";
import * as pack from "./packs/new-france-to-the-gulf";

const KML_DIR = resolve(import.meta.dir, "..", "..", "generated", "kml-exports");
const MANIFEST_DIR = process.env.COMMONS_MANIFEST_DIR ?? resolve(import.meta.dir, "backups");
const MANIFESTS = [resolve(MANIFEST_DIR, "2026-10-17-commons-pack1-manifest.json"), resolve(MANIFEST_DIR, "2026-10-17-commons-pack1b-manifest.json")];

// Commons file chosen for each image key used in the pack. Credits come from the manifest
// (author and licence as recorded by Commons at search time).
const SELECTION: Record<string, string[]> = {
  "Mississippi River": ["Sun Rise Over the Mississippi River in Northern Iowa.jpg", "Meandering Mississippi (5182095595).jpg", "Mississippi River seen from I-40.jpg", "Detail of Norman's chart of the lower Mississippi River (1858).jpg"],
  "Illinois River": ["Illinois River -Peoria 2016-09-23 010.jpg", "Illinois River P6081337.jpg"],
  "Wisconsin River": ["Wisconsin River bridge at Spring Green.jpg", "WisconsinRiverWisconsinRapidsWIS54WIS13.jpg"],
  "Fox River Wisconsin": ["Fox River, Green Bay, Wisconsin (9181856662).jpg", "WisconsinHighway32BridgeFoxRiver.jpg", "Green Bay July 2024 053 (Fox River).jpg"],
  "Richelieu River": ["Richelieu River at Saint-Marc-sur-Richelieu.JPG", "Richelieu (Québec)-Vue vers l'aval de la Baie de Chambly (rivière Richelieu) à partir de la rive Est-2022-10-20.jpg"],
  "Lake Champlain": ["Lake Champlain at sunrise.JPG", "Lake Champlain South Bay 28April2020.png", "Lake Champlain Bridge.jpg"],
  "Hudson River": ["Panorama of Hudson River from walkway looking north.jpg", "Hudson River at Norrie State Park.jpg"],
  "Lake Nipissing": ["Motorboat in Lake Nipissing (5924830884).jpg", "Seagulls flying in Lake Nipissing (5924275117).jpg"],
  "Mattawa River": ["Mattawa River - panoramio.jpg", "Mattawa 1.jpg"],
  "Detroit River": ["Detroit December 2019 06 (Detroit River).jpg", "Detroit River, Elizabeth Park, Trenton, Michigan.jpg"],
  "Niagara River": ["Niagara Falls 001.JPG", "Niagrariverbefore.jpg"],
  "Fort Frontenac": ["2018-10-05 Fort Frontenac 005.jpg", "Fort frontenac.jpg"],
  "Fort Niagara": ["A view of Old Fort Niagara from Canada across the Niagara River.jpg", "French castle at Fort Niagara 2.JPG"],
  "Starved Rock": ["Fog and Mist at \"The Rock\", Starved Rock State Park.jpg", "Fall Colors at Starved Rock State Park.jpg"],
  "Colonial Michilimackinac": ["Colonial Michilimackinac Park - panoramio.jpg", "Fort Michilimackinac 2022.jpg", "Fort Michilimackinac Michigan.jpg", "Colonial Fort Michilimackinac in Winter.jpg"],
  "Fort Orange Albany": ["Map of Rensselaers Wyck Anno 1630 with Fort Orange.jpg", "Fort Orange Historical Marker.jpg"],
  "New Amsterdam": ["New Amsterdam lately New York retaken by the Netherlanders on 24 Aug 1673.jpg", "City of New Orange (New Amsterdam) 1673 sketched.png"],
  "Fort Pontchartrain Detroit": ["Plan du fort Detroit - Gaspard-Joseph Chaussegros de Lery - 1749.jpg", "Colonel Campbell and Lt M'Doughal leaving Fort of Detroit, 1763.jpg"],
  "Trois-Rivières": ["Trois-Rivières (Quebec), Canada 2007 01.jpg", "Trois-Rivières (Quebec), Canada 2007 03.jpg"],
  "Lachine Quebec": ["Vieux-Lachine (Lachine) (8552553138).jpg", "Canal de Lachine 11.jpg"],
  "Fort Saint-Frédéric Crown Point": ["Fort St Frederic wall bridge Crown Point NY 2025-04-15 09-22-24 1.jpg", "Fort St Frederic ruins Crown Point NY 2025-04-15 09-25-50 1.jpg"],
  "Fort Ticonderoga": ["Fort Ticonderoga, Ticonderoga, NY.jpg", "Fort Ticonderoga Cannons.jpg"],
  "Fort Chambly": ["Fort Chambly 2.jpg", "Fort Chambly 01.jpg"],
  "Fort de Chartres": ["Fort de Chartres, view of the gatehouse at the fort.jpg", "Fort de Chartres, fort wall and one of the bastions.jpg"],
  "New Orleans Jackson Square": ["Jackson Square, New Orleans, USA1.jpg", "Ballou's Pictorial 1858 - Jackson Square New Orleans - crop illustration only.jpg"],
  "Kaskaskia Illinois": ["Kaskaskia Church.jpg", "Kaskaskia Bell 3321.jpg"],
  "Green Bay Wisconsin": ["Green Bay July 2024 053 (Fox River).jpg", "Green Bay July 2024 045 (skyline and Fox River).jpg"],
  "Prairie du Chien": ["Prairie du Chien, Wisconsin.jpg", "Prairie du Chien skyline.jpg"],
  "Allumette Island": ["Champ1632 82.jpg"],
  "Marquette Jolliet 1673": ["Marquette and jolliet map 1681.jpg", "Land and volk-ontdekking in't Noorder gedeelte van America - door P. Marquette en Joliet gedaan in't jaar 1673 - btv1b8596041k.jpg"],
  "La Salle Mississippi 1682": ["George Catlin, La Salle's Party Entering the Mississippi in Canoes. February 6, 1682, 1847-1848, NGA 50640.jpg", "Le 9 avril 1682 - Rene-Robert de La Salle erige une croix.jpg"],
};
// Extra lesson gallery images beyond the pack's three (hero = Mississippi).
const LESSON_EXTRA_IMAGES: pack.PackImage[] = [
  { file: "Marquette Jolliet 1673", caption: "Thévenot's 1681 map of the Mississippi, drawn from Jolliet and Marquette's 1673 voyage" },
  { file: "La Salle Mississippi 1682", caption: "George Catlin's painting of La Salle's party entering the Mississippi, 1682" },
];

type ManifestEntry = { file: string; license: string; artist: string; description: string };
const manifest = new Map<string, ManifestEntry>();
const manifestByTerm = new Map<string, ManifestEntry[]>();
for (const m of MANIFESTS) {
  if (!existsSync(m)) continue;
  for (const [term, items] of Object.entries(JSON.parse(readFileSync(m, "utf8")) as Record<string, ManifestEntry[]>)) {
    const ok = items.filter((i) => i.file);
    for (const it of ok) manifest.set(it.file, it);
    manifestByTerm.set(term, [...(manifestByTerm.get(term) ?? []), ...ok]);
  }
}
const filePathUrl = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;
const credit = (e: ManifestEntry) => `Wikimedia Commons / ${e.artist || "unknown author"} / ${e.license}`;
const problems: string[] = [];

function pickFiles(term: string, n: number): ManifestEntry[] {
  const chosen = (SELECTION[term] ?? []).map((f) => { const e = manifest.get(f); if (!e) problems.push(`selected file not in manifest: ${f}`); return e; }).filter((e): e is ManifestEntry => !!e);
  const out = chosen.slice(0, n);
  if (out.length === 0) problems.push(`no image for term "${term}"`);
  return out;
}
function gallery(images: pack.PackImage[], perTerm = 2) {
  return images.flatMap((img) => pickFiles(img.file, perTerm).map((e, i) => ({ url: filePathUrl(e.file), caption: i === 0 ? img.caption : (e.description || img.caption).slice(0, 140), credit: credit(e) })));
}
async function checkUrl(url: string) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content pack check)" } });
      if (res.ok) return;
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 20_000 * (attempt + 1))); continue; } // Commons rate limit, not a missing file
      problems.push(`${res.status} ${url}`);
      return;
    } catch (e) { problems.push(`${String(e).slice(0, 60)} ${url}`); return; }
  }
  problems.push(`still rate-limited after 4 tries ${url}`);
}

async function main() {
  // ---- live lookups
  const types = await db.waterwayType.findMany();
  const typeId = (name: string) => { const t = types.find((x) => x.name === name); if (!t) throw new Error(`type ${name}`); return t.id; };
  const liveWaterways = await db.waterway.findMany({ select: { id: true, name: true } });
  const liveExplorers = await db.explorer.findMany({ select: { id: true, name: true } });
  const liveLocations = await db.location.findMany({ select: { id: true, name: true } });
  const liveFigures = await db.notableFigure.findMany({ select: { id: true, name: true } });
  const liveTimeline = await db.timelineEvent.findMany({ select: { id: true, title: true } });
  const liveHist = await db.historicalEvent.findMany({ select: { id: true, title: true, explorerId: true, waterwayId: true, locationId: true } });
  const livePron = await db.pronunciationGuide.findMany({ select: { term: true } });
  const liveQuiz = await db.quiz.findFirst({ where: { title: pack.quiz.title } });
  const liveLesson = await db.lessonPlan.findFirst({ where: { title: pack.lesson.title } });
  const liveTrip = await db.virtualFieldTrip.findFirst({ where: { title: pack.fieldTrip.title } });

  const wwIds = new Map(liveWaterways.map((w) => [w.name, w.id]));
  const exIds = new Map(liveExplorers.map((e) => [e.name, e.id]));
  const locIds = new Map(liveLocations.map((l) => [l.name, l.id]));
  const figIds = new Map(liveFigures.map((f) => [f.name.replace(/\s*\(.*\)$/, ""), f.id]));
  const tevIds = new Map(liveTimeline.map((t) => [t.title, t.id]));
  const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const newWw = pack.waterways.filter((w) => !wwIds.has(w.name));
  for (const w of newWw) wwIds.set(w.name, `ww_${slug(w.name)}`);
  const newEx = pack.explorers.filter((e) => !exIds.has(e.name));
  for (const e of newEx) exIds.set(e.name, `ex_${slug(e.name)}`);
  const newLoc = pack.locations.filter((l) => !locIds.has(l.name));
  for (const l of newLoc) locIds.set(l.name, `loc_${slug(l.name)}`);
  const newFig = pack.figures.filter((f) => !figIds.has(f.name));
  for (const f of newFig) figIds.set(f.name, f.id);
  const newTev = pack.timelineEvents.filter((t) => !tevIds.has(t.title));
  for (const t of newTev) tevIds.set(t.title, `tev_${slug(t.title)}`);

  const need = <T,>(map: Map<string, T>, key: string, what: string): T => { const v = map.get(key); if (v === undefined) throw new Error(`${what} not found: ${key}`); return v; };
  const kmlFor = (s: string | null) => { if (!s) return null; const p = resolve(KML_DIR, `${s}.kml`); if (!existsSync(p)) { problems.push(`missing KML ${p}`); return null; } return readFileSync(p, "utf8"); };

  // ---- rows
  const waterwayRows = newWw.map((w) => { const g = gallery(w.images, 3); return { id: wwIds.get(w.name)!, name: w.name, indigenousName: w.indigenousName, indigenousLanguage: w.indigenousLanguage, description: w.description, historicalSignificance: w.historicalSignificance, latitude: w.latitude, longitude: w.longitude, regionName: w.regionName, typeId: typeId(w.typeName), kmlData: kmlFor(w.kmlSlug), imageUrl: g[0]?.url ?? null, galleryImages: JSON.stringify(g) }; });
  const furRows = newWw.filter((w) => w.furTrade).map((w) => ({ waterwayId: wwIds.get(w.name)!, ...w.furTrade! }));
  const explorerRows = newEx.map((e) => ({ id: exIds.get(e.name)!, name: e.name, birthYear: e.birthYear, deathYear: e.deathYear, nationality: e.nationality, biography: e.biography, notableAchievements: e.notableAchievements, imageUrl: null }));
  const existingLinks = await db.explorerWaterway.findMany({ select: { explorerId: true, waterwayId: true } });
  const linkRows = pack.links.map((l) => ({ explorerId: need(exIds, l.explorer, "explorer"), waterwayId: need(wwIds, l.waterway, "waterway"), yearExplored: l.year, expeditionNotes: l.notes })).filter((l) => !existingLinks.some((x) => x.explorerId === l.explorerId && x.waterwayId === l.waterwayId));
  const locationRows = newLoc.map((l) => { const g = gallery(l.images, 2); return { id: locIds.get(l.name)!, name: l.name, indigenousName: l.indigenousName, indigenousLanguage: l.indigenousLanguage, description: l.description, latitude: l.latitude, longitude: l.longitude, locationType: l.locationType, yearEstablished: l.yearEstablished, historicalNotes: l.historicalNotes, imageUrl: g[0]?.url ?? null, galleryImages: JSON.stringify(g), waterwayId: need(wwIds, l.waterway, "waterway") }; });
  const figureRows = newFig.map((f) => ({ id: f.id, name: f.name, alternateNames: f.alternateNames, birthYear: f.birthYear, deathYear: f.deathYear, nation: f.nation, birthPlace: f.birthPlace, figureType: f.figureType, role: f.role, biography: f.biography, significance: f.significance, associatedExplorers: JSON.stringify(f.associatedExplorers.map((a) => ({ ...a, explorerId: exIds.get(a.name) ?? null }))), achievements: JSON.stringify(f.achievements), associatedLocations: JSON.stringify(f.associatedLocations), activePeriodStart: f.activePeriodStart, activePeriodEnd: f.activePeriodEnd, imageUrl: null, isFeatured: f.isFeatured }));
  for (const f of pack.figures) for (const loc of f.associatedLocations) if (!wwIds.has(loc) && !locIds.has(loc)) problems.push(`figure ${f.name}: associatedLocation "${loc}" matches no waterway or location name`);
  const timelineRows = newTev.map((t) => ({ id: tevIds.get(t.title)!, title: t.title, description: t.description, year: t.year, month: t.month ?? null, day: t.day ?? null, endYear: t.endYear ?? null, isApproximate: t.isApproximate ?? false, theme: t.theme, importance: t.importance, explorerId: t.explorer ? need(exIds, t.explorer, "explorer") : null, waterwayId: t.waterway ? need(wwIds, t.waterway, "waterway") : null, locationId: t.location ? need(locIds, t.location, "location") : null }));
  const histRows = pack.historicalEvents.filter((h) => !liveHist.some((x) => x.title === h.title)).map((h) => ({ id: `hev_${slug(h.title)}`, title: h.title, description: h.description, latitude: h.latitude, longitude: h.longitude, locationName: h.locationName, year: h.year, month: h.month ?? null, day: h.day ?? null, isApproximate: h.isApproximate ?? false, category: h.category, significance: h.significance, explorerId: h.explorer ? need(exIds, h.explorer, "explorer") : null, waterwayId: h.waterway ? need(wwIds, h.waterway, "waterway") : null, locationId: h.location ? need(locIds, h.location, "location") : null, imageUrl: null as string | null }));
  const backfill = pack.historicalBackfill.map((b) => { const live = liveHist.find((x) => x.title === b.title); if (!live) throw new Error(`backfill target not found: ${b.title}`); return { id: live.id, title: b.title, before: { explorerId: live.explorerId, waterwayId: live.waterwayId, locationId: live.locationId }, data: { explorerId: b.explorer ? need(exIds, b.explorer, "explorer") : live.explorerId, waterwayId: b.waterway ? need(wwIds, b.waterway, "waterway") : live.waterwayId, locationId: b.location ? need(locIds, b.location, "location") : live.locationId } }; });
  const pronRows = pack.pronunciations.filter((p) => !livePron.some((x) => x.term === p.term)).map((p) => ({ term: p.term, termType: p.termType, language: p.language, phonetic: p.phonetic, meaning: p.meaning, notes: p.notes, explorerId: p.explorer ? need(exIds, p.explorer, "explorer") : null, waterwayId: p.waterway ? need(wwIds, p.waterway, "waterway") : null, locationId: p.location ? need(locIds, p.location, "location") : null }));

  const sourceId = (s: { type: string; name: string }) => s.type === "explorer" ? need(exIds, s.name, "explorer") : s.type === "waterway" ? need(wwIds, s.name, "waterway") : s.type === "location" ? need(locIds, s.name, "location") : need(figIds, s.name, "figure");
  const quizRow = liveQuiz ? null : { id: "quiz_new_france_to_the_gulf", title: pack.quiz.title, description: pack.quiz.description, category: pack.quiz.category, gradeLevel: pack.quiz.gradeLevel, difficulty: pack.quiz.difficulty, isPublished: true,
    questions: pack.quiz.questions.map((q, i) => ({ id: `quiz_new_france_to_the_gulf_q${i + 1}`, questionText: q.questionText, questionType: "multiple_choice", options: JSON.stringify(q.options.map((text, j) => ({ id: String.fromCharCode(97 + j), text }))), correctAnswer: String.fromCharCode(97 + q.correct), explanation: q.explanation, sourceType: q.source.type, sourceId: sourceId(q.source), orderIndex: i, points: 1 })) };

  const L = pack.lesson;
  const heroPick = pickFiles(L.heroImage.file, 1)[0];
  const lessonRow = liveLesson ? null : { id: "lesson_new_france_to_the_gulf", title: L.title, description: L.description, gradeLevel: L.gradeLevel, topic: L.topic, estimatedMinutes: L.estimatedMinutes, readingTimeMinutes: L.readingTimeMinutes, isPublished: true,
    heroImageUrl: heroPick ? filePathUrl(heroPick.file) : null,
    images: JSON.stringify(gallery([...L.images, ...LESSON_EXTRA_IMAGES], 1)),
    narrativeContent: L.narrativeContent, mainContent: L.mainContent, introduction: null,
    keyFigures: JSON.stringify(L.keyFigures.map((k) => ({ name: k.name, role: k.role, years: k.years, description: k.description, ...("explorer" in k && k.explorer ? { explorerId: need(exIds, k.explorer, "explorer") } : {}), ...("figure" in k && k.figure ? { notableFigureId: need(figIds, k.figure, "figure") } : {}) }))),
    timeline: JSON.stringify(L.timeline.map((t) => ({ year: t.year, title: t.title, description: t.description, eventId: need(tevIds, t.event, "timeline event") }))),
    objectives: JSON.stringify(L.objectives), materials: JSON.stringify(L.materials), activities: JSON.stringify(L.activities), discussionQuestions: JSON.stringify(L.discussionQuestions), assessment: L.assessment, extensions: L.extensions, curriculumConnections: JSON.stringify(L.curriculumConnections),
    teacherObjectives: JSON.stringify(L.teacherObjectives), teacherActivities: JSON.stringify(L.teacherActivities), teacherQuestions: JSON.stringify(L.teacherQuestions), teacherNotes: L.teacherNotes,
    relatedWaterwayIds: JSON.stringify(["Mississippi River", "Illinois River", "Wisconsin River", "Niagara River", "Lake Nipissing", "Mattawa River"].map((n) => need(wwIds, n, "waterway"))),
    relatedLocationIds: JSON.stringify(["Michilimackinac", "Fort Saint-Louis (Starved Rock)", "Fort Frontenac", "Kaskaskia", "New Orleans"].map((n) => need(locIds, n, "location"))),
    relatedExplorerIds: JSON.stringify(["Louis Jolliet", "Jacques Marquette", "Rene-Robert Cavelier, Sieur de La Salle", "Henri de Tonti", "Louis Hennepin", "Daniel Greysolon Dulhut"].map((n) => need(exIds, n, "explorer"))),
    relatedQuizIds: JSON.stringify(["quiz_new_france_to_the_gulf"]) };

  const T = pack.fieldTrip;
  const coverPick = pickFiles(T.coverImage.file, 1)[0];
  const stopImages = pickFiles(T.stops[0]!.image.file, 4);
  const tripRow = liveTrip ? null : { id: "trip_michilimackinac", title: T.title, description: T.description, gradeLevel: T.gradeLevel, estimatedMinutes: T.estimatedMinutes, theme: T.theme, coverImageUrl: coverPick ? filePathUrl(coverPick.file) : null, isPublished: true,
    stops: T.stops.map((s, i) => { const img = stopImages[i % Math.max(1, stopImages.length)]; return { id: `trip_michilimackinac_stop_${i}`, orderIndex: i, title: s.title, description: s.description, locationId: need(locIds, T.location, "location"), waterwayId: need(wwIds, T.waterway, "waterway"), latitude: s.lat, longitude: s.lng, imageUrl: img ? filePathUrl(img.file) : null, funFact: s.funFact, thinkQuestion: s.thinkQuestion }; }) };
  // VirtualFieldTrip has no introduction/conclusion columns in Turso; the pack keeps that text for a future column.

  const guideRows: Array<{ id: string; targetType: string; targetId: string; sortOrder: number; title: string; authorSource: string; publisher: string | null; year: string | null; url: string | null; description: string; gradeLevel: string }> = [];
  const addGuides = (targetType: string, targetId: string, guides: pack.PackGuide[]) => guides.forEach((g, i) => guideRows.push({ id: `rg_${targetType}_${targetId}_${i}`, targetType, targetId, sortOrder: i, title: g.title, authorSource: g.authorSource, publisher: g.publisher ?? null, year: g.year ?? null, url: g.url ?? null, description: g.description, gradeLevel: g.gradeLevel }));
  for (const w of newWw) addGuides("waterway", wwIds.get(w.name)!, w.guide);
  for (const e of newEx) addGuides("explorer", exIds.get(e.name)!, e.guide);
  for (const l of newLoc) addGuides("location", locIds.get(l.name)!, l.guide);
  for (const f of newFig) addGuides("notable_figure", f.id, f.guide);

  // ---- image URL check, every distinct URL once
  const urls = new Set<string>();
  for (const r of waterwayRows) { if (r.imageUrl) urls.add(r.imageUrl); for (const g of JSON.parse(r.galleryImages)) urls.add(g.url); }
  for (const r of locationRows) { if (r.imageUrl) urls.add(r.imageUrl); for (const g of JSON.parse(r.galleryImages)) urls.add(g.url); }
  if (lessonRow) { if (lessonRow.heroImageUrl) urls.add(lessonRow.heroImageUrl); for (const g of JSON.parse(lessonRow.images)) urls.add(g.url); }
  if (tripRow) { if (tripRow.coverImageUrl) urls.add(tripRow.coverImageUrl); for (const s of tripRow.stops) if (s.imageUrl) urls.add(s.imageUrl); }
  for (const u of urls) await checkUrl(u);

  const backupFile = writeBackup("2026-10-17-pack-new-france-before", { historicalEventsBackfilled: backfill.map((b) => ({ id: b.id, title: b.title, before: b.before })) });
  report("pack: New France to the Gulf", {
    waterways: waterwayRows.map((w) => `${w.name} (kml ${w.kmlData ? `${(w.kmlData.length / 1024).toFixed(0)} KB` : "none"}, ${JSON.parse(w.galleryImages).length} images)`),
    skippedWaterways: pack.waterways.filter((w) => !newWw.includes(w)).map((w) => w.name),
    furTrade: furRows.length, explorers: explorerRows.map((e) => e.name), explorerWaterwayLinks: linkRows.length,
    locations: locationRows.map((l) => `${l.name} → ${pack.locations.find((p) => p.name === l.name)!.waterway} (${JSON.parse(l.galleryImages).length} images)`),
    figures: figureRows.map((f) => f.name), timelineEvents: timelineRows.map((t) => `${t.year} ${t.title}`), historicalEvents: histRows.map((h) => `${h.year} ${h.title}`), backfilledEvents: backfill.map((b) => b.title),
    pronunciations: pronRows.map((p) => p.term), quiz: quizRow ? `${quizRow.title} (${quizRow.questions.length} q)` : "exists, skipped", lesson: lessonRow ? lessonRow.title : "exists, skipped", fieldTrip: tripRow ? `${tripRow.title} (${tripRow.stops.length} stops)` : "exists, skipped",
    readingGuideRows: guideRows.length, imageUrlsChecked: urls.size, problems, backupFile,
  });
  if (problems.length) throw new Error("Resolve the problems above before applying.");
  if (!APPLY) return;

  await db.$transaction(async (tx) => {
    for (const w of waterwayRows) await tx.waterway.create({ data: w });
    for (const f of furRows) await tx.furTradeInfo.create({ data: f });
    for (const e of explorerRows) await tx.explorer.create({ data: e });
    for (const l of linkRows) await tx.explorerWaterway.create({ data: l });
    for (const l of locationRows) await tx.location.create({ data: l });
    for (const f of figureRows) await tx.notableFigure.create({ data: f });
    for (const t of timelineRows) await tx.timelineEvent.create({ data: t });
    for (const h of histRows) await tx.historicalEvent.create({ data: h });
    for (const b of backfill) await tx.historicalEvent.update({ where: { id: b.id }, data: b.data });
    for (const p of pronRows) await tx.pronunciationGuide.create({ data: p });
    if (quizRow) { const { questions, ...q } = quizRow; await tx.quiz.create({ data: q }); for (const qq of questions) await tx.quizQuestion.create({ data: { ...qq, quizId: q.id } }); }
    if (lessonRow) await tx.lessonPlan.create({ data: lessonRow });
    if (tripRow) { const { stops, ...t } = tripRow; await tx.virtualFieldTrip.create({ data: t }); for (const s of stops) await tx.fieldTripStop.create({ data: { ...s, tripId: t.id } }); }
    if (guideRows.length) await tx.readingGuide.createMany({ data: guideRows });
  }, { timeout: 180_000 });

  report("verify", {
    waterways: await db.waterway.count(), explorers: await db.explorer.count(), explorerWaterway: await db.explorerWaterway.count(), locations: await db.location.count(), figures: await db.notableFigure.count(),
    timeline: await db.timelineEvent.count(), historical: await db.historicalEvent.count(), pronunciations: await db.pronunciationGuide.count(), quizzes: await db.quiz.count(), lessons: await db.lessonPlan.count(), trips: await db.virtualFieldTrip.count(), guides: await db.readingGuide.count(),
    mississippi: await db.waterway.findFirst({ where: { name: "Mississippi River" }, select: { id: true, _count: { select: { explorers: true, locations: true } } } }),
    jolliet: await db.explorer.findFirst({ where: { name: "Louis Jolliet" }, select: { _count: { select: { waterways: true } } } }),
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
