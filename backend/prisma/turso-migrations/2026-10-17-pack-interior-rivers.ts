// Apply content pack 4, The Interior Rivers (packs/interior-rivers.ts).
//   bun run prisma/turso-migrations/2026-10-17-pack-interior-rivers.ts [--apply]
//
// Same shape as the Pacific pack: the dry run resolves every name to a live id, checks every
// image URL and every reading-guide URL (Wikipedia, Internet Archive and others by HEAD; the
// Dictionary of Canadian Biography and the Canadian Encyclopedia by fetching the page, since
// both answer 200 or redirect for slugs that do not exist), reads the exported KML files and
// prints what would be written. --apply writes everything in one transaction after a JSON
// backup of the rows it changes (backfilled events, existing waterways that receive geometry).
// Idempotent by name/title. Portraits only where PORTRAITS names a Commons file that is a
// likeness made in the person's lifetime, checked by hand against the manifest. New here:
// timelineBackfill, which links existing unlinked timeline events the same way as the
// historical ones.
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";
import * as pack from "./packs/interior-rivers";

const KML_DIR = resolve(import.meta.dir, "..", "..", "generated", "kml-exports");
const MANIFEST_DIR = process.env.COMMONS_MANIFEST_DIR ?? resolve(import.meta.dir, "backups");
const MANIFESTS = [resolve(MANIFEST_DIR, "2026-10-17-commons-pack4-manifest.json"), resolve(MANIFEST_DIR, "2026-10-17-commons-pack4b-manifest.json"), resolve(MANIFEST_DIR, "2026-10-17-commons-pack4-portraits-manifest.json")];
// Existing waterway rows that had no geometry and whose KML this pack exported.
const KML_UPDATES: Array<{ name: string; slug: string }> = [];

// Commons file chosen for each image key used in the pack (filled from the manifest).
const SELECTION: Record<string, string[]> = {
  /* __SELECTION__ */
};
// Lifetime likenesses only. Key = the pack's `portrait` term; value = the Commons file.
// Confirmed from the Commons file records: Dulongpré's oil of Joseph Frobisher (c. 1800);
// photographs of Rowand's contemporaries are lacking, so Rowand stays without; Campbell,
// Anderson, Hind and Hector in photographs taken in their lifetimes; Piapot (c. 1885), the
// 1886 photograph of the four Cree chiefs for Mistawasis and Ahtahkakoop, and Jerry Potts.
// No lifetime likeness was found for Thomas Frobisher, James Finlay, Howse, Rowand, McLeod,
// Maskepetoon or Pierre Falcon.
const PORTRAITS: Record<string, string> = {
  "Joseph Frobisher portrait": "Joseph Frobisher.jpg",
  "Robert Campbell Hudson's Bay Company explorer": "Robert Campbell 1808-1894.jpg",
  "Alexander Caulfield Anderson": "Alexander-caulfield-anderson.jpg",
  "Henry Youle Hind": "Henry Youle Hind.jpg",
  "James Hector geologist": "James Hector 1900.jpg",
  "Piapot Payipwat": "Piapot.gif",
  "Mistawasis": "Four Cree Chiefs of Rupert s Land.jpg",
  "Ahtahkakoop": "Four Cree Chiefs of Rupert s Land.jpg",
  "Jerry Potts": "JerryPotts.jpg",
};
const LESSON_EXTRA_IMAGES: pack.PackImage[] = [];

type ManifestEntry = { file: string; license: string; artist: string; description: string };
const manifest = new Map<string, ManifestEntry>();
for (const m of MANIFESTS) {
  if (!existsSync(m)) continue;
  for (const items of Object.values(JSON.parse(readFileSync(m, "utf8")) as Record<string, ManifestEntry[]>)) for (const it of items) if (it.file) manifest.set(it.file, it);
}
const filePathUrl = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;
const credit = (e: ManifestEntry) => `Wikimedia Commons / ${e.artist || "unknown author"} / ${e.license}`;
const problems: string[] = [];
const warnings: string[] = [];

function pickFiles(term: string, n: number): ManifestEntry[] {
  const chosen = (SELECTION[term] ?? []).map((f) => { const e = manifest.get(f); if (!e) problems.push(`selected file not in manifest: ${f}`); return e; }).filter((e): e is ManifestEntry => !!e);
  const out = chosen.slice(0, n);
  if (out.length === 0) problems.push(`no image for term "${term}"`);
  return out;
}
function gallery(images: pack.PackImage[], perTerm = 2) {
  return images.flatMap((img) => pickFiles(img.file, perTerm).map((e, i) => ({ url: filePathUrl(e.file), caption: i === 0 ? img.caption : (e.description || img.caption).slice(0, 140), credit: credit(e) })));
}
function portrait(term: string | undefined): string | null {
  if (!term) return null;
  const file = PORTRAITS[term];
  if (!file) { warnings.push(`no lifetime likeness confirmed for "${term}"; left without portrait`); return null; }
  if (!manifest.get(file)) problems.push(`portrait file not in manifest: ${file}`);
  return filePathUrl(file);
}
const HEAD_OK_HOSTS = /^(https:\/\/(commons\.wikimedia\.org|en\.wikipedia\.org|www\.biographi\.ca|www\.thecanadianencyclopedia\.ca|archive\.org|lewisandclarkjournals\.unl\.edu|avalon\.law\.yale\.edu))\//;
const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
async function checkUrl(url: string) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      if (url.startsWith("https://www.biographi.ca/")) { // answers 200 for any slug; the title says whether the biography exists
        const html = await (await fetch(url, { headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content pack check)" } })).text();
        if (/<title>Biography not found/.test(html)) problems.push(`DCB biography not found ${url}`);
        return;
      }
      if (url.startsWith("https://www.thecanadianencyclopedia.ca/")) { // 403 to plain clients; 404 only for a missing article
        const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": BROWSER_UA, Accept: "text/html" } });
        if (res.status === 404) problems.push(`Canadian Encyclopedia article not found ${url}`);
        else if (!res.ok) problems.push(`${res.status} ${url}`);
        return;
      }
      const res = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content pack check)" } });
      if (res.ok) return;
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 20_000 * (attempt + 1))); continue; }
      if (res.status === 405 || res.status === 403) { const g = await fetch(url, { headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content pack check)" } }); if (g.ok) return; problems.push(`${g.status} ${url}`); return; }
      problems.push(`${res.status} ${url}`);
      return;
    } catch (e) { problems.push(`${String(e).slice(0, 60)} ${url}`); return; }
  }
  warnings.push(`still rate-limited after 4 tries, not a missing file (the manifest came from this file's own page): ${url}`);
}

async function main() {
  const types = await db.waterwayType.findMany();
  const typeId = (name: string) => { const t = types.find((x) => x.name === name); if (!t) throw new Error(`type ${name}`); return t.id; };
  const liveWaterways = await db.waterway.findMany({ select: { id: true, name: true, kmlData: true } });
  const liveExplorers = await db.explorer.findMany({ select: { id: true, name: true } });
  const liveLocations = await db.location.findMany({ select: { id: true, name: true, waterwayId: true } });
  const liveFigures = await db.notableFigure.findMany({ select: { id: true, name: true } });
  const liveTimeline = await db.timelineEvent.findMany({ select: { id: true, title: true, explorerId: true, waterwayId: true, locationId: true } });
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
  const noKml: string[] = [];
  const kmlFor = (name: string, s: string | null) => { if (!s) return null; const p = resolve(KML_DIR, `${s}.kml`); if (!existsSync(p)) { noKml.push(`${name} (${s}.kml)`); return null; } return readFileSync(p, "utf8"); };

  const waterwayRows = newWw.map((w) => { const g = gallery(w.images, 3); return { id: wwIds.get(w.name)!, name: w.name, indigenousName: w.indigenousName, indigenousLanguage: w.indigenousLanguage, description: w.description, historicalSignificance: w.historicalSignificance, latitude: w.latitude, longitude: w.longitude, regionName: w.regionName, typeId: typeId(w.typeName), kmlData: kmlFor(w.name, w.kmlSlug), imageUrl: g[0]?.url ?? null, galleryImages: JSON.stringify(g) }; });
  const kmlUpdates = KML_UPDATES.flatMap((u) => { const live = liveWaterways.find((w) => w.name === u.name); if (!live) throw new Error(`KML update target not found: ${u.name}`); if (live.kmlData) { warnings.push(`${u.name} already has geometry; not replaced`); return []; } const k = kmlFor(u.name, u.slug); return k ? [{ id: live.id, name: u.name, kmlData: k }] : []; });
  const furRows = newWw.filter((w) => w.furTrade).map((w) => ({ waterwayId: wwIds.get(w.name)!, ...w.furTrade! }));
  const explorerRows = newEx.map((e) => ({ id: exIds.get(e.name)!, name: e.name, birthYear: e.birthYear, deathYear: e.deathYear, nationality: e.nationality, biography: e.biography, notableAchievements: e.notableAchievements, imageUrl: portrait(e.portrait) }));
  const existingLinks = await db.explorerWaterway.findMany({ select: { explorerId: true, waterwayId: true } });
  const linkRows = pack.links.map((l) => ({ explorerId: need(exIds, l.explorer, "explorer"), waterwayId: need(wwIds, l.waterway, "waterway"), yearExplored: l.year, expeditionNotes: l.notes })).filter((l) => !existingLinks.some((x) => x.explorerId === l.explorerId && x.waterwayId === l.waterwayId));
  const locationRows = newLoc.map((l) => { const g = gallery(l.images, 2); return { id: locIds.get(l.name)!, name: l.name, indigenousName: l.indigenousName, indigenousLanguage: l.indigenousLanguage, description: l.description, latitude: l.latitude, longitude: l.longitude, locationType: l.locationType, yearEstablished: l.yearEstablished, historicalNotes: l.historicalNotes, imageUrl: g[0]?.url ?? null, galleryImages: JSON.stringify(g), waterwayId: need(wwIds, l.waterway, "waterway") }; });
  const relocations = pack.relocations.map((r) => { const live = liveLocations.find((l) => l.name === r.location); if (!live) throw new Error(`relocation target not found: ${r.location}`); return { id: live.id, name: r.location, before: live.waterwayId, waterwayId: need(wwIds, r.waterway, "waterway"), to: r.waterway }; }).filter((r) => r.before !== r.waterwayId);
  const figureRows = newFig.map((f) => ({ id: f.id, name: f.name, alternateNames: f.alternateNames, birthYear: f.birthYear, deathYear: f.deathYear, nation: f.nation, birthPlace: f.birthPlace, figureType: f.figureType, role: f.role, biography: f.biography, significance: f.significance, associatedExplorers: JSON.stringify(f.associatedExplorers.map((a) => ({ ...a, explorerId: exIds.get(a.name) ?? null }))), achievements: JSON.stringify(f.achievements), associatedLocations: JSON.stringify(f.associatedLocations), activePeriodStart: f.activePeriodStart, activePeriodEnd: f.activePeriodEnd, imageUrl: portrait(f.portrait), isFeatured: f.isFeatured }));
  for (const f of pack.figures) { for (const loc of f.associatedLocations) if (!wwIds.has(loc) && !locIds.has(loc)) problems.push(`figure ${f.name}: associatedLocation "${loc}" matches no waterway or location name`); for (const a of f.associatedExplorers) if (!exIds.has(a.name)) problems.push(`figure ${f.name}: associatedExplorer "${a.name}" is not an explorer`); }
  const timelineRows = newTev.map((t) => ({ id: tevIds.get(t.title)!, title: t.title, description: t.description, year: t.year, month: t.month ?? null, day: t.day ?? null, endYear: t.endYear ?? null, isApproximate: t.isApproximate ?? false, theme: t.theme, importance: t.importance, explorerId: t.explorer ? need(exIds, t.explorer, "explorer") : null, waterwayId: t.waterway ? need(wwIds, t.waterway, "waterway") : null, locationId: t.location ? need(locIds, t.location, "location") : null }));
  const histRows = pack.historicalEvents.filter((h) => !liveHist.some((x) => x.title === h.title)).map((h) => ({ id: `hev_${slug(h.title)}`, title: h.title, description: h.description, latitude: h.latitude, longitude: h.longitude, locationName: h.locationName, year: h.year, month: h.month ?? null, day: h.day ?? null, isApproximate: h.isApproximate ?? false, category: h.category, significance: h.significance, explorerId: h.explorer ? need(exIds, h.explorer, "explorer") : null, waterwayId: h.waterway ? need(wwIds, h.waterway, "waterway") : null, locationId: h.location ? need(locIds, h.location, "location") : null, imageUrl: null as string | null }));
  const backfill = pack.historicalBackfill.map((b) => { const live = liveHist.find((x) => x.title === b.title); if (!live) throw new Error(`backfill target not found: ${b.title}`); return { id: live.id, title: b.title, before: { explorerId: live.explorerId, waterwayId: live.waterwayId, locationId: live.locationId }, data: { explorerId: b.explorer ? need(exIds, b.explorer, "explorer") : live.explorerId, waterwayId: b.waterway ? need(wwIds, b.waterway, "waterway") : live.waterwayId, locationId: b.location ? need(locIds, b.location, "location") : live.locationId } }; });
  const tevBackfill = pack.timelineBackfill.map((b) => { const live = liveTimeline.find((x) => x.title === b.title); if (!live) throw new Error(`timeline backfill target not found: ${b.title}`); return { id: live.id, title: b.title, before: { explorerId: live.explorerId, waterwayId: live.waterwayId, locationId: live.locationId }, data: { explorerId: b.explorer ? need(exIds, b.explorer, "explorer") : live.explorerId, waterwayId: b.waterway ? need(wwIds, b.waterway, "waterway") : live.waterwayId, locationId: b.location ? need(locIds, b.location, "location") : live.locationId } }; });
  const pronRows = pack.pronunciations.filter((p) => !livePron.some((x) => x.term === p.term)).map((p) => ({ term: p.term, termType: p.termType, language: p.language, phonetic: p.phonetic, meaning: p.meaning, notes: p.notes, explorerId: p.explorer ? need(exIds, p.explorer, "explorer") : null, waterwayId: p.waterway ? need(wwIds, p.waterway, "waterway") : null, locationId: p.location ? need(locIds, p.location, "location") : null }));

  const sourceId = (s: { type: string; name: string }) => s.type === "explorer" ? need(exIds, s.name, "explorer") : s.type === "waterway" ? need(wwIds, s.name, "waterway") : s.type === "location" ? need(locIds, s.name, "location") : need(figIds, s.name, "figure");
  const QUIZ_ID = "quiz_interior_rivers", LESSON_ID = "lesson_river_highways", TRIP_ID = "trip_sainte_marie";
  const quizRow = liveQuiz ? null : { id: QUIZ_ID, title: pack.quiz.title, description: pack.quiz.description, category: pack.quiz.category, gradeLevel: pack.quiz.gradeLevel, difficulty: pack.quiz.difficulty, isPublished: true,
    questions: pack.quiz.questions.map((q, i) => ({ id: `${QUIZ_ID}_q${i + 1}`, questionText: q.questionText, questionType: "multiple_choice", options: JSON.stringify(q.options.map((text, j) => ({ id: String.fromCharCode(97 + j), text }))), correctAnswer: String.fromCharCode(97 + q.correct), explanation: q.explanation, sourceType: q.source.type, sourceId: sourceId(q.source), orderIndex: i, points: 1 })) };

  const L = pack.lesson;
  const heroPick = pickFiles(L.heroImage.file, 1)[0];
  const lessonRow = liveLesson ? null : { id: LESSON_ID, title: L.title, description: L.description, gradeLevel: L.gradeLevel, topic: L.topic, estimatedMinutes: L.estimatedMinutes, readingTimeMinutes: L.readingTimeMinutes, isPublished: true,
    heroImageUrl: heroPick ? filePathUrl(heroPick.file) : null,
    images: JSON.stringify(gallery([...L.images, ...LESSON_EXTRA_IMAGES], 1)),
    narrativeContent: L.narrativeContent, mainContent: L.mainContent, introduction: null,
    keyFigures: JSON.stringify(L.keyFigures.map((k) => ({ name: k.name, role: k.role, years: k.years, description: k.description, ...("explorer" in k && k.explorer ? { explorerId: need(exIds, k.explorer, "explorer") } : {}), ...("figure" in k && k.figure ? { notableFigureId: need(figIds, k.figure, "figure") } : {}) }))),
    timeline: JSON.stringify(L.timeline.map((t) => ({ year: t.year, title: t.title, description: t.description, eventId: need(tevIds, t.event, "timeline event") }))),
    objectives: JSON.stringify(L.objectives), materials: JSON.stringify(L.materials), activities: JSON.stringify(L.activities), discussionQuestions: JSON.stringify(L.discussionQuestions), assessment: L.assessment, extensions: L.extensions, curriculumConnections: JSON.stringify(L.curriculumConnections),
    teacherObjectives: JSON.stringify(L.teacherObjectives), teacherActivities: JSON.stringify(L.teacherActivities), teacherQuestions: JSON.stringify(L.teacherQuestions), teacherNotes: L.teacherNotes,
    relatedWaterwayIds: JSON.stringify(["Georgian Bay", "Pigeon River", "Rainy River", "Winnipeg River", "North Saskatchewan River", "South Saskatchewan River", "Sturgeon-Weir River", "Clearwater River", "Slave River", "Bow River", "Parsnip River", "Bella Coola River"].map((n) => need(wwIds, n, "waterway"))),
    relatedLocationIds: JSON.stringify(["Sainte-Marie among the Hurons", "Grand Portage", "Fort St. Pierre", "Cumberland House", "Frog Portage", "Methye Portage", "Fort Edmonton", "Fort Carlton", "Chesterfield House", "Fort Smith", "Fort St. James", "Blackfoot Crossing"].map((n) => need(locIds, n, "location"))),
    relatedExplorerIds: JSON.stringify(["Anthony Henday", "Joseph Frobisher", "Peter Pond", "Peter Fidler", "Alexander Mackenzie", "David Thompson", "John Rowand", "Pierre Gaultier de Varennes, Sieur de La Vérendrye", "Simon Fraser", "James Hector"].map((n) => need(exIds, n, "explorer"))),
    relatedQuizIds: JSON.stringify([QUIZ_ID]) };

  const T = pack.fieldTrip;
  const coverPick = pickFiles(T.coverImage.file, 1)[0];
  const stopUse = new Map<string, number>();
  const tripRow = liveTrip ? null : { id: TRIP_ID, title: T.title, description: T.description, gradeLevel: T.gradeLevel, estimatedMinutes: T.estimatedMinutes, theme: T.theme, coverImageUrl: coverPick ? filePathUrl(coverPick.file) : null, isPublished: true,
    stops: T.stops.map((s, i) => { const files = pickFiles(s.image.file, 4); const k = stopUse.get(s.image.file) ?? 0; stopUse.set(s.image.file, k + 1); const img = files[k % Math.max(1, files.length)]; return { id: `${TRIP_ID}_stop_${i}`, orderIndex: i, title: s.title, description: s.description, locationId: need(locIds, T.location, "location"), waterwayId: need(wwIds, T.waterway, "waterway"), latitude: s.lat, longitude: s.lng, imageUrl: img ? filePathUrl(img.file) : null, funFact: s.funFact, thinkQuestion: s.thinkQuestion }; }) };

  const guideRows: Array<{ id: string; targetType: string; targetId: string; sortOrder: number; title: string; authorSource: string; publisher: string | null; year: string | null; url: string | null; description: string; gradeLevel: string }> = [];
  const addGuides = (targetType: string, targetId: string, guides: pack.PackGuide[]) => guides.forEach((g, i) => guideRows.push({ id: `rg_${targetType}_${targetId}_${i}`, targetType, targetId, sortOrder: i, title: g.title, authorSource: g.authorSource, publisher: g.publisher ?? null, year: g.year ?? null, url: g.url ?? null, description: g.description, gradeLevel: g.gradeLevel }));
  for (const w of newWw) addGuides("waterway", wwIds.get(w.name)!, w.guide);
  for (const e of newEx) addGuides("explorer", exIds.get(e.name)!, e.guide);
  for (const l of newLoc) addGuides("location", locIds.get(l.name)!, l.guide);
  for (const f of newFig) addGuides("notable_figure", f.id, f.guide);

  // ---- URL check: every image once, plus every guide URL on a host that answers HEAD
  const urls = new Set<string>();
  for (const r of waterwayRows) { if (r.imageUrl) urls.add(r.imageUrl); for (const g of JSON.parse(r.galleryImages)) urls.add(g.url); }
  for (const r of locationRows) { if (r.imageUrl) urls.add(r.imageUrl); for (const g of JSON.parse(r.galleryImages)) urls.add(g.url); }
  for (const r of [...explorerRows, ...figureRows]) if (r.imageUrl) urls.add(r.imageUrl);
  if (lessonRow) { if (lessonRow.heroImageUrl) urls.add(lessonRow.heroImageUrl); for (const g of JSON.parse(lessonRow.images)) urls.add(g.url); }
  if (tripRow) { if (tripRow.coverImageUrl) urls.add(tripRow.coverImageUrl); for (const s of tripRow.stops) if (s.imageUrl) urls.add(s.imageUrl); }
  const guideUrls = new Set(guideRows.map((g) => g.url).filter((u): u is string => !!u && HEAD_OK_HOSTS.test(u)));
  for (const u of urls) await checkUrl(u);
  for (const u of guideUrls) await checkUrl(u);

  const backupFile = writeBackup("2026-10-17-pack-interior-before", {
    historicalEventsBackfilled: backfill.map((b) => ({ id: b.id, title: b.title, before: b.before })),
    timelineEventsBackfilled: tevBackfill.map((b) => ({ id: b.id, title: b.title, before: b.before })),
    locationsRelocated: relocations.map((r) => ({ id: r.id, name: r.name, before: { waterwayId: r.before } })),
    waterwaysGivenGeometry: kmlUpdates.map((k) => ({ id: k.id, name: k.name, before: { kmlData: null } })),
  });
  report("pack: The Interior Rivers", {
    waterways: waterwayRows.map((w) => `${w.name} (kml ${w.kmlData ? `${(w.kmlData.length / 1024).toFixed(0)} KB` : "none"}, ${JSON.parse(w.galleryImages).length} images)`),
    skippedWaterways: pack.waterways.filter((w) => !newWw.includes(w)).map((w) => w.name),
    geometryForExistingRows: kmlUpdates.map((k) => `${k.name} (${(k.kmlData.length / 1024).toFixed(0)} KB)`), noKml,
    furTrade: furRows.length, explorers: explorerRows.map((e) => `${e.name}${e.imageUrl ? " [portrait]" : ""}`), explorerWaterwayLinks: linkRows.length,
    locations: locationRows.map((l) => `${l.name} → ${pack.locations.find((p) => p.name === l.name)!.waterway} (${JSON.parse(l.galleryImages).length} images)`),
    relocations: relocations.map((r) => `${r.name} → ${r.to}`),
    figures: figureRows.map((f) => `${f.name}${f.imageUrl ? " [portrait]" : ""}`), timelineEvents: timelineRows.map((t) => `${t.year} ${t.title}`), historicalEvents: histRows.map((h) => `${h.year} ${h.title}`), backfilledEvents: backfill.map((b) => b.title), backfilledTimelineEvents: tevBackfill.map((b) => b.title),
    pronunciations: pronRows.map((p) => p.term), quiz: quizRow ? `${quizRow.title} (${quizRow.questions.length} q)` : "exists, skipped", lesson: lessonRow ? lessonRow.title : "exists, skipped", fieldTrip: tripRow ? `${tripRow.title} (${tripRow.stops.length} stops)` : "exists, skipped",
    readingGuideRows: guideRows.length, imageUrlsChecked: urls.size, guideUrlsChecked: guideUrls.size, warnings, problems, backupFile,
  });
  if (problems.length) throw new Error("Resolve the problems above before applying.");
  if (!APPLY) return;

  await db.$transaction(async (tx) => {
    for (const w of waterwayRows) await tx.waterway.create({ data: w });
    for (const k of kmlUpdates) await tx.waterway.update({ where: { id: k.id }, data: { kmlData: k.kmlData } });
    for (const f of furRows) await tx.furTradeInfo.create({ data: f });
    for (const e of explorerRows) await tx.explorer.create({ data: e });
    for (const l of linkRows) await tx.explorerWaterway.create({ data: l });
    for (const l of locationRows) await tx.location.create({ data: l });
    for (const r of relocations) await tx.location.update({ where: { id: r.id }, data: { waterwayId: r.waterwayId } });
    for (const f of figureRows) await tx.notableFigure.create({ data: f });
    for (const t of timelineRows) await tx.timelineEvent.create({ data: t });
    for (const h of histRows) await tx.historicalEvent.create({ data: h });
    for (const b of backfill) await tx.historicalEvent.update({ where: { id: b.id }, data: b.data });
    for (const b of tevBackfill) await tx.timelineEvent.update({ where: { id: b.id }, data: b.data });
    for (const p of pronRows) await tx.pronunciationGuide.create({ data: p });
    if (quizRow) { const { questions, ...q } = quizRow; await tx.quiz.create({ data: q }); for (const qq of questions) await tx.quizQuestion.create({ data: { ...qq, quizId: q.id } }); }
    if (lessonRow) await tx.lessonPlan.create({ data: lessonRow });
    if (tripRow) { const { stops, ...t } = tripRow; await tx.virtualFieldTrip.create({ data: t }); for (const s of stops) await tx.fieldTripStop.create({ data: { ...s, tripId: t.id } }); }
    if (guideRows.length) await tx.readingGuide.createMany({ data: guideRows });
  }, { timeout: 180_000 });

  report("verify", {
    waterways: await db.waterway.count(), explorers: await db.explorer.count(), explorerWaterway: await db.explorerWaterway.count(), locations: await db.location.count(), figures: await db.notableFigure.count(),
    timeline: await db.timelineEvent.count(), historical: await db.historicalEvent.count(), pronunciations: await db.pronunciationGuide.count(), quizzes: await db.quiz.count(), lessons: await db.lessonPlan.count(), trips: await db.virtualFieldTrip.count(), guides: await db.readingGuide.count(),
    northSask: await db.waterway.findFirst({ where: { name: "North Saskatchewan River" }, select: { id: true, _count: { select: { explorers: true, locations: true } } } }),
    slave: await db.waterway.findFirst({ where: { name: "Slave River" }, select: { id: true, _count: { select: { explorers: true, locations: true } } } }),
    saskatchewanParent: await db.waterway.findFirst({ where: { name: "Saskatchewan River" }, select: { _count: { select: { locations: true } } } }),
    fortEdmonton: await db.location.findFirst({ where: { name: "Fort Edmonton" }, select: { waterway: { select: { name: true } } } }),
    fortStJames: await db.location.findFirst({ where: { name: "Fort St. James" }, select: { waterway: { select: { name: true } } } }),
    unlinkedTimeline: await db.timelineEvent.count({ where: { explorerId: null, waterwayId: null, locationId: null } }),
    unlinkedHistorical: await db.historicalEvent.count({ where: { explorerId: null, waterwayId: null, locationId: null } }),
  });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
