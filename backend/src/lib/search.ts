/**
 * search.ts — one search over everything (roadmap item 3, 2026-10-19).
 *
 * The whole searchable corpus is about 1,800 rows (waterways, places, explorers, figures,
 * documents, events, deep dives, field trips, maps, words, pronunciations, expeditions,
 * discoveries, quizzes, stories), so it is loaded from Turso into one in-memory index and
 * searched in JS: accent-insensitive (Vérendrye matches verendrye), ranked (an exact or leading
 * name match first, then a word in the name, then a match in the body), with a snippet around
 * the first match. The index is rebuilt after SEARCH_TTL_MS; content changes land through
 * migrations, never through the app, so a short staleness is acceptable.
 */
import { db } from "../db";

export type SearchType =
  | "waterway"
  | "location"
  | "explorer"
  | "notable_figure"
  | "document"
  | "timeline_event"
  | "historical_event"
  | "lesson_plan"
  | "field_trip"
  | "historical_map"
  | "indigenous_word"
  | "pronunciation"
  | "expedition"
  | "discovery"
  | "quiz"
  | "story"
  | "decade";

export const SEARCH_TYPES: SearchType[] = [
  "waterway", "location", "explorer", "notable_figure", "document", "timeline_event", "historical_event",
  "lesson_plan", "field_trip", "historical_map", "indigenous_word", "pronunciation", "expedition",
  "discovery", "quiz", "story", "decade",
];

export interface SearchEntry {
  type: SearchType;
  id: string;
  title: string;
  subtitle: string | null;
  /** Searched with the title at full weight: Indigenous names, alternate names, authors. */
  names: string[];
  /** Searched at body weight; the snippet is cut from the first field that matches. */
  body: string[];
  years: number[];
  /** What the app needs to open the record. */
  target: Record<string, string | number | null>;
}

export interface SearchHit {
  type: SearchType;
  id: string;
  title: string;
  subtitle: string | null;
  snippet: string | null;
  score: number;
  target: Record<string, string | number | null>;
}

export const fold = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’‘ʼ]/g, "'")
    .toLowerCase();

const SEARCH_TTL_MS = 10 * 60 * 1000;
let indexCache: { builtAt: number; entries: SearchEntry[]; folded: { title: string; names: string[]; body: string[] }[] } | null = null;

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const parseStrings = (value: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
};

async function buildIndex(): Promise<SearchEntry[]> {
  const [
    waterways, locations, explorers, figures, documents, timeline, historical, lessons, trips, maps,
    words, pronunciations, expeditions, discoveries, quizzes, stories, visits,
  ] = await Promise.all([
    db.waterway.findMany({ select: { id: true, name: true, indigenousName: true, indigenousLanguage: true, regionName: true, description: true, historicalSignificance: true, latitude: true, longitude: true, type: { select: { name: true } }, furTradeInfo: { select: { tradingCompany: true, peakTradePeriod: true, primaryFurs: true, tradeRouteNotes: true } } } }),
    db.location.findMany({ select: { id: true, name: true, indigenousName: true, indigenousLanguage: true, locationType: true, yearEstablished: true, description: true, historicalNotes: true, latitude: true, longitude: true, waterway: { select: { name: true } } } }),
    db.explorer.findMany({ select: { id: true, name: true, nationality: true, birthYear: true, deathYear: true, biography: true, notableAchievements: true } }),
    db.notableFigure.findMany({ select: { id: true, name: true, alternateNames: true, nation: true, role: true, figureType: true, biography: true, significance: true, birthYear: true, deathYear: true } }),
    db.primarySourceDocument.findMany({ where: { isPublished: true }, select: { id: true, title: true, author: true, documentType: true, originalYear: true, originalDate: true, transcription: true, originalText: true, historicalContext: true } }),
    db.timelineEvent.findMany({ select: { id: true, title: true, description: true, year: true, theme: true, waterwayId: true, locationId: true } }),
    db.historicalEvent.findMany({ select: { id: true, title: true, description: true, year: true, category: true, locationName: true, latitude: true, longitude: true, waterwayId: true, locationId: true } }),
    db.lessonPlan.findMany({ where: { isPublished: true }, select: { id: true, title: true, description: true, topic: true, gradeLevel: true, keyFigures: true } }),
    db.virtualFieldTrip.findMany({ where: { isPublished: true }, select: { id: true, title: true, description: true, theme: true, gradeLevel: true } }),
    db.historicalMap.findMany({ select: { id: true, title: true, mapmaker: true, mapmakerNation: true, year: true, yearLabel: true, region: true, description: true, whatItShows: true } }),
    db.indigenousWord.findMany({ select: { id: true, word: true, translation: true, language: true, phonetic: true, meaning: true, category: true, culturalContext: true } }),
    db.pronunciationGuide.findMany({ select: { id: true, term: true, termType: true, language: true, phonetic: true, meaning: true, notes: true } }),
    db.expedition.findMany({ select: { id: true, name: true, startYear: true, endYear: true, summary: true, explorer: { select: { name: true } } } }),
    db.archaeologicalDiscovery.findMany({ select: { id: true, name: true, discoveryYear: true, description: true, significance: true, relatedExplorerName: true, latitude: true, longitude: true, waterwayId: true } }),
    db.quiz.findMany({ where: { isPublished: true }, select: { id: true, title: true, description: true, category: true, gradeLevel: true, difficulty: true } }),
    db.indigenousStory.findMany({ where: { isPublished: true }, select: { id: true, title: true, nation: true, language: true, summary: true, theme: true, gradeLevel: true } }),
    db.explorerWaterway.findMany({ where: { yearExplored: { not: null } }, select: { waterwayId: true, yearExplored: true, explorer: { select: { name: true } } } }),
  ]);

  const visitsByWater = new Map<string, { year: number; explorer: string }[]>();
  for (const v of visits) {
    const list = visitsByWater.get(v.waterwayId) ?? [];
    list.push({ year: v.yearExplored!, explorer: v.explorer.name });
    visitsByWater.set(v.waterwayId, list);
  }

  const entries: SearchEntry[] = [];

  for (const w of waterways) {
    const v = visitsByWater.get(w.id) ?? [];
    entries.push({
      type: "waterway",
      id: w.id,
      title: w.name,
      subtitle: [w.type.name, w.regionName, w.indigenousName ? `${w.indigenousName}${w.indigenousLanguage ? ` (${w.indigenousLanguage})` : ""}` : null].filter(Boolean).join(" · "),
      names: [str(w.indigenousName)],
      body: [
        str(w.indigenousLanguage), w.regionName, w.description, str(w.historicalSignificance),
        str(w.furTradeInfo?.tradingCompany), str(w.furTradeInfo?.peakTradePeriod), str(w.furTradeInfo?.primaryFurs), str(w.furTradeInfo?.tradeRouteNotes),
        v.map((x) => `${x.explorer} ${x.year}`).join("; "),
      ],
      years: v.map((x) => x.year),
      target: { markerType: "waterway", markerId: w.id, lat: w.latitude, lng: w.longitude },
    });
  }
  for (const l of locations) {
    entries.push({
      type: "location",
      id: l.id,
      title: l.name,
      subtitle: [l.locationType, l.yearEstablished ? `founded ${l.yearEstablished}` : null, l.waterway.name].filter(Boolean).join(" · "),
      names: [str(l.indigenousName)],
      body: [str(l.indigenousLanguage), l.locationType, l.description, str(l.historicalNotes), l.waterway.name],
      years: l.yearEstablished ? [l.yearEstablished] : [],
      target: { markerType: "location", markerId: l.id, lat: l.latitude, lng: l.longitude },
    });
  }
  for (const e of explorers) {
    entries.push({
      type: "explorer",
      id: e.id,
      title: e.name,
      subtitle: [e.nationality, e.birthYear && e.deathYear ? `${e.birthYear}-${e.deathYear}` : null].filter(Boolean).join(" · ") || null,
      names: [],
      body: [str(e.nationality), e.biography, str(e.notableAchievements)],
      years: [],
      target: { explorerId: e.id },
    });
  }
  for (const f of figures) {
    entries.push({
      type: "notable_figure",
      id: f.id,
      title: f.name,
      subtitle: [f.role, f.nation].filter(Boolean).join(" · ") || null,
      names: [str(f.alternateNames)],
      body: [str(f.nation), f.role, f.figureType, f.biography, str(f.significance)],
      years: [f.birthYear, f.deathYear].filter((y): y is number => typeof y === "number"),
      target: { notableFigureId: f.id },
    });
  }
  for (const d of documents) {
    entries.push({
      type: "document",
      id: d.id,
      title: d.title,
      subtitle: [d.author, d.originalDate ?? (d.originalYear ? String(d.originalYear) : null), d.documentType].filter(Boolean).join(" · ") || null,
      names: [str(d.author)],
      body: [str(d.transcription), str(d.originalText), str(d.historicalContext), d.documentType],
      years: d.originalYear ? [d.originalYear] : [],
      target: { documentId: d.id },
    });
  }
  for (const t of timeline) {
    entries.push({
      type: "timeline_event",
      id: t.id,
      title: t.title,
      subtitle: `${t.year} · ${t.theme.replace(/_/g, " ")}`,
      names: [],
      body: [str(t.description), t.theme],
      years: [t.year],
      target: { year: t.year, waterwayId: t.waterwayId, locationId: t.locationId },
    });
  }
  for (const h of historical) {
    entries.push({
      type: "historical_event",
      id: h.id,
      title: h.title,
      subtitle: [String(h.year), h.category, h.locationName].filter(Boolean).join(" · "),
      names: [],
      body: [str(h.description), h.category, str(h.locationName)],
      years: [h.year],
      target: { year: h.year, lat: h.latitude, lng: h.longitude, waterwayId: h.waterwayId, locationId: h.locationId },
    });
  }
  for (const l of lessons) {
    const figures = parseStrings(l.keyFigures);
    const keyNames = (() => {
      try {
        const parsed = JSON.parse(l.keyFigures ?? "[]");
        return Array.isArray(parsed) ? parsed.map((k: { name?: string }) => str(k?.name)).filter(Boolean) : [];
      } catch {
        return figures;
      }
    })();
    entries.push({
      type: "lesson_plan",
      id: l.id,
      title: l.title,
      subtitle: [l.topic, l.gradeLevel].filter(Boolean).join(" · ") || null,
      names: [],
      body: [l.description, str(l.topic), keyNames.join(", ")],
      years: [],
      target: { lessonId: l.id },
    });
  }
  for (const t of trips) {
    entries.push({
      type: "field_trip",
      id: t.id,
      title: t.title,
      subtitle: [t.theme, t.gradeLevel].filter(Boolean).join(" · ") || null,
      names: [],
      body: [t.description, str(t.theme)],
      years: [],
      target: { fieldTripId: t.id },
    });
  }
  for (const m of maps) {
    entries.push({
      type: "historical_map",
      id: m.id,
      title: m.title,
      subtitle: [m.mapmaker, m.yearLabel ?? String(m.year), m.region].filter(Boolean).join(" · "),
      names: [m.mapmaker],
      body: [str(m.mapmakerNation), str(m.region), str(m.description), str(m.whatItShows)],
      years: [m.year],
      target: { historicalMapId: m.id },
    });
  }
  for (const w of words) {
    entries.push({
      type: "indigenous_word",
      id: w.id,
      title: w.word,
      subtitle: `${w.translation} · ${w.language}${w.phonetic ? ` · ${w.phonetic}` : ""}`,
      names: [w.translation],
      body: [w.language, str(w.meaning), str(w.culturalContext), str(w.category)],
      years: [],
      target: { screen: "indigenous-languages" },
    });
  }
  for (const p of pronunciations) {
    entries.push({
      type: "pronunciation",
      id: p.id,
      title: p.term,
      subtitle: [p.phonetic, p.language, p.termType.replace(/_/g, " ")].filter(Boolean).join(" · "),
      names: [],
      body: [str(p.language), str(p.meaning), str(p.notes), p.termType],
      years: [],
      target: { screen: "pronunciations" },
    });
  }
  for (const e of expeditions) {
    const years: number[] = [];
    for (let y = e.startYear; y <= (e.endYear ?? e.startYear); y++) years.push(y);
    entries.push({
      type: "expedition",
      id: e.id,
      title: e.name,
      subtitle: `${e.explorer.name} · ${e.endYear && e.endYear !== e.startYear ? `${e.startYear}-${e.endYear}` : e.startYear}`,
      names: [e.explorer.name],
      body: [e.summary],
      years,
      target: { expeditionId: e.id },
    });
  }
  for (const d of discoveries) {
    entries.push({
      type: "discovery",
      id: d.id,
      title: d.name,
      subtitle: [String(d.discoveryYear), d.relatedExplorerName].filter(Boolean).join(" · "),
      names: [str(d.relatedExplorerName)],
      body: [d.description, d.significance],
      years: [d.discoveryYear],
      target: { lat: d.latitude, lng: d.longitude, waterwayId: d.waterwayId },
    });
  }
  for (const q of quizzes) {
    entries.push({
      type: "quiz",
      id: q.id,
      title: q.title,
      subtitle: [q.category, q.gradeLevel, q.difficulty].filter(Boolean).join(" · "),
      names: [],
      body: [str(q.description), q.category],
      years: [],
      target: { quizId: q.id },
    });
  }
  for (const s of stories) {
    entries.push({
      type: "story",
      id: s.id,
      title: s.title,
      subtitle: [s.nation, s.language, s.gradeLevel].filter(Boolean).join(" · "),
      names: [],
      body: [str(s.summary), str(s.nation), str(s.language), str(s.theme)],
      years: [],
      target: { storyId: s.id },
    });
  }
  return entries;
}

async function getIndex() {
  if (indexCache && Date.now() - indexCache.builtAt < SEARCH_TTL_MS) return indexCache;
  const entries = await buildIndex();
  indexCache = {
    builtAt: Date.now(),
    entries,
    folded: entries.map((e) => ({ title: fold(e.title), names: e.names.map(fold).filter(Boolean), body: e.body.map(fold) })),
  };
  return indexCache;
}

/** Drop the cached index (used after content migrations, and by tests). */
export function invalidateSearchIndex() {
  indexCache = null;
}

const snippetAround = (text: string, foldedText: string, needle: string, radius = 70): string => {
  const at = foldedText.indexOf(needle);
  if (at < 0) return text.slice(0, radius * 2).trim() + (text.length > radius * 2 ? "…" : "");
  // Folding removes only combining marks, so offsets line up with the original text except for
  // decomposed characters; clamp to the text length and cut at the nearest spaces.
  const start = Math.max(0, at - radius);
  const end = Math.min(text.length, at + needle.length + radius);
  let s = text.slice(start, end);
  if (start > 0) s = "…" + s.replace(/^\S*\s/, "");
  if (end < text.length) s = s.replace(/\s\S*$/, "") + "…";
  return s.replace(/\s+/g, " ").trim();
};

const wordBoundaryIndex = (haystack: string, needle: string): number => {
  const re = new RegExp(`(^|[^\\p{L}\\p{N}])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "u");
  const m = re.exec(haystack);
  return m ? m.index + (m[1]?.length ?? 0) : -1;
};

export async function search(rawQuery: string, types: SearchType[] | null, limit = 60): Promise<{ hits: SearchHit[]; total: number; counts: Record<string, number> }> {
  const query = fold(rawQuery.trim()).replace(/\s+/g, " ");
  if (query.length < 2) return { hits: [], total: 0, counts: {} };
  const terms = query.split(" ").filter((t) => t.length > 0);
  const yearQuery = /^\d{3,4}$/.test(query) ? Number(query) : null;
  const { entries, folded } = await getIndex();

  const hits: SearchHit[] = [];
  entries.forEach((entry, i) => {
    if (types && !types.includes(entry.type)) return;
    const f = folded[i]!;
    let score = 0;
    let snippet: string | null = null;

    // Title and names: exact, leading, word boundary, anywhere
    const nameFields = [f.title, ...f.names];
    for (const name of nameFields) {
      if (name === query) score = Math.max(score, 100);
      else if (name.startsWith(query)) score = Math.max(score, 80);
      else if (wordBoundaryIndex(name, query) >= 0) score = Math.max(score, 60);
      else if (name.includes(query)) score = Math.max(score, 45);
    }
    // Every term present somewhere in the names (e.g. "simon fraser" against "Fraser, Simon")
    if (score === 0 && terms.length > 1 && terms.every((t) => nameFields.some((n) => n.includes(t)))) score = 40;

    // Body: the whole phrase, else every term
    if (score < 60) {
      const bodyIndex = f.body.findIndex((b) => b.includes(query));
      if (bodyIndex >= 0) {
        score = Math.max(score, 30);
        snippet = snippetAround(entry.body[bodyIndex]!, f.body[bodyIndex]!, query);
      } else if (terms.length > 1 && terms.every((t) => f.body.some((b) => b.includes(t)) || nameFields.some((n) => n.includes(t)))) {
        score = Math.max(score, 20);
        const firstField = f.body.findIndex((b) => b.includes(terms[0]!));
        if (firstField >= 0) snippet = snippetAround(entry.body[firstField]!, f.body[firstField]!, terms[0]!);
      }
    }
    // A year: records dated to it
    if (yearQuery !== null && entry.years.includes(yearQuery)) score = Math.max(score, 70);

    if (score > 0) {
      hits.push({ type: entry.type, id: entry.id, title: entry.title, subtitle: entry.subtitle, snippet, score, target: entry.target });
    }
  });

  // A year or a decade query also offers the decade view
  if (yearQuery !== null && (!types || types.includes("decade"))) {
    const decade = Math.floor(yearQuery / 10) * 10;
    hits.push({ type: "decade", id: String(decade), title: `The ${decade}s`, subtitle: "Who was on the water, what was founded, what was written", snippet: null, score: 65, target: { decade } });
  }

  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  const counts: Record<string, number> = {};
  for (const h of hits) counts[h.type] = (counts[h.type] ?? 0) + 1;
  return { hits: hits.slice(0, limit), total: hits.length, counts };
}
