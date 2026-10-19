/**
 * connections.ts — the connection views (roadmap item 1, 2026-10-19): "follow this river",
 * "who was here in this decade" and "everything about this person". Everything here is
 * read from existing Turso tables; no new tables were added for item 1.
 *
 * WaterwayConnection semantics (relation column):
 *   A flows_into B  — water from A reaches B; B is downstream of A
 *   A outlet_of B   — A carries B's water away; A is downstream of B
 *   A part_of B     — A is an arm or reach of B (Georgian Bay part_of Lake Huron)
 *   A joins B       — undirected (a strait joins two bodies)
 */
import { db } from "../db";

export interface SystemWaterway {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  typeName: string;
  /** How many explorers the database links to this water, and the earliest linked year. */
  explorerCount: number;
  firstYear: number | null;
}

export interface SystemStep extends SystemWaterway {
  /** The connection row's note ("At Montreal.") where one is stored. */
  notes: string | null;
  /** 1 for a direct link to the viewed water, 2 for a link to a depth-1 water, and so on. */
  depth: number;
  /** The water this one feeds (upstream list) or is fed by (downstream list). */
  viaId: string;
}

export interface WaterwaySystem {
  waterway: SystemWaterway;
  /** The chain this water's water follows, nearest first, to the last connected body. */
  downstream: SystemStep[];
  /** Tributaries, depth-first: each water that flows into this one, then what flows into it. */
  upstream: SystemStep[];
  /** The body this water is an arm or reach of. */
  partOf: SystemStep[];
  /** Arms and reaches of this water. */
  parts: SystemStep[];
  /** Waters joined to this one by a strait or channel (undirected). */
  joins: SystemStep[];
  /** Every id above plus the viewed water, for drawing the system on the map. */
  waterwayIds: string[];
}

const MAX_DEPTH = 10;

export async function getWaterwaySystem(id: string): Promise<WaterwaySystem | null> {
  const start = await db.waterway.findUnique({
    where: { id },
    select: { id: true, name: true, latitude: true, longitude: true, type: { select: { name: true } } },
  });
  if (!start) return null;

  const edges = await db.waterwayConnection.findMany({
    select: { fromId: true, toId: true, relation: true, notes: true },
  });
  // downstream[x] = the water x drains to; upstream[x] = waters that drain to x
  const downstreamOf = new Map<string, { id: string; notes: string | null }>();
  const upstreamOf = new Map<string, { id: string; notes: string | null }[]>();
  const partOfMap = new Map<string, { id: string; notes: string | null }[]>();
  const partsMap = new Map<string, { id: string; notes: string | null }[]>();
  const joinsMap = new Map<string, { id: string; notes: string | null }[]>();
  const push = (m: Map<string, { id: string; notes: string | null }[]>, k: string, v: { id: string; notes: string | null }) => {
    const list = m.get(k) ?? [];
    if (!list.some((x) => x.id === v.id)) list.push(v);
    m.set(k, list);
  };
  for (const e of edges) {
    switch (e.relation) {
      case "flows_into":
        if (!downstreamOf.has(e.fromId)) downstreamOf.set(e.fromId, { id: e.toId, notes: e.notes });
        push(upstreamOf, e.toId, { id: e.fromId, notes: e.notes });
        break;
      case "outlet_of":
        if (!downstreamOf.has(e.toId)) downstreamOf.set(e.toId, { id: e.fromId, notes: e.notes });
        push(upstreamOf, e.fromId, { id: e.toId, notes: e.notes });
        break;
      case "part_of":
        push(partOfMap, e.fromId, { id: e.toId, notes: e.notes });
        push(partsMap, e.toId, { id: e.fromId, notes: e.notes });
        break;
      case "joins":
        push(joinsMap, e.fromId, { id: e.toId, notes: e.notes });
        push(joinsMap, e.toId, { id: e.fromId, notes: e.notes });
        break;
    }
  }

  // Downstream chain: one next water per step (the data has no water with two outlets)
  const downstream: { id: string; notes: string | null; depth: number; viaId: string }[] = [];
  const seen = new Set<string>([start.id]);
  let cursor = start.id;
  for (let depth = 1; depth <= MAX_DEPTH; depth++) {
    const next = downstreamOf.get(cursor);
    if (!next || seen.has(next.id)) break;
    seen.add(next.id);
    downstream.push({ id: next.id, notes: next.notes, depth, viaId: cursor });
    cursor = next.id;
  }

  // Upstream tree, depth-first so a tributary's own tributaries follow it
  const upstream: { id: string; notes: string | null; depth: number; viaId: string }[] = [];
  const upSeen = new Set<string>([start.id]);
  const walkUp = (fromId: string, depth: number) => {
    if (depth > MAX_DEPTH) return;
    for (const t of upstreamOf.get(fromId) ?? []) {
      if (upSeen.has(t.id)) continue;
      upSeen.add(t.id);
      upstream.push({ id: t.id, notes: t.notes, depth, viaId: fromId });
      walkUp(t.id, depth + 1);
    }
  };
  walkUp(start.id, 1);

  const direct = (m: Map<string, { id: string; notes: string | null }[]>) =>
    (m.get(start.id) ?? []).map((x) => ({ ...x, depth: 1, viaId: start.id }));
  const partOf = direct(partOfMap);
  const parts = direct(partsMap);
  const joins = direct(joinsMap);

  const ids = [...new Set([start.id, ...downstream, ...upstream, ...partOf, ...parts, ...joins].map((x) => (typeof x === "string" ? x : x.id)))];
  const [rows, visits] = await Promise.all([
    db.waterway.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, latitude: true, longitude: true, type: { select: { name: true } } },
    }),
    db.explorerWaterway.groupBy({
      by: ["waterwayId"],
      where: { waterwayId: { in: ids } },
      _count: { _all: true },
      _min: { yearExplored: true },
    }),
  ]);
  const visitsById = new Map(visits.map((v) => [v.waterwayId, { count: v._count._all, first: v._min.yearExplored ?? null }]));
  const byId = new Map(
    rows.map((r) => [
      r.id,
      {
        id: r.id,
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        typeName: r.type.name,
        explorerCount: visitsById.get(r.id)?.count ?? 0,
        firstYear: visitsById.get(r.id)?.first ?? null,
      } satisfies SystemWaterway,
    ])
  );
  const toSteps = (list: { id: string; notes: string | null; depth: number; viaId: string }[]): SystemStep[] =>
    list.flatMap((x) => {
      const w = byId.get(x.id);
      return w ? [{ ...w, notes: x.notes, depth: x.depth, viaId: x.viaId }] : [];
    });

  return {
    waterway: byId.get(start.id)!,
    downstream: toSteps(downstream),
    upstream: toSteps(upstream),
    partOf: toSteps(partOf),
    parts: toSteps(parts),
    joins: toSteps(joins),
    waterwayIds: ids.filter((x) => byId.has(x)),
  };
}

// ---------------------------------------------------------------------------------------
// Decades: everything the database dates to a ten-year span
// ---------------------------------------------------------------------------------------

export interface DecadeSummary {
  decade: number;
  visits: number;
  explorers: number;
  locations: number;
  expeditions: number;
  events: number;
  documents: number;
}

export const decadeOf = (year: number): number => Math.floor(year / 10) * 10;

export async function listDecades(): Promise<DecadeSummary[]> {
  const [visits, locations, expeditions, events, documents] = await Promise.all([
    db.explorerWaterway.findMany({ where: { yearExplored: { not: null } }, select: { yearExplored: true, explorerId: true } }),
    db.location.findMany({ where: { yearEstablished: { not: null } }, select: { yearEstablished: true } }),
    db.expedition.findMany({ select: { startYear: true, endYear: true } }),
    db.timelineEvent.findMany({ select: { year: true } }),
    db.primarySourceDocument.findMany({ where: { isPublished: true, originalYear: { not: null } }, select: { originalYear: true } }),
  ]);
  const map = new Map<number, DecadeSummary & { explorerIds: Set<string> }>();
  const get = (decade: number) => {
    const row = map.get(decade) ?? { decade, visits: 0, explorers: 0, locations: 0, expeditions: 0, events: 0, documents: 0, explorerIds: new Set<string>() };
    map.set(decade, row);
    return row;
  };
  for (const v of visits) {
    const row = get(decadeOf(v.yearExplored!));
    row.visits++;
    row.explorerIds.add(v.explorerId);
  }
  for (const l of locations) get(decadeOf(l.yearEstablished!)).locations++;
  for (const e of expeditions) {
    for (let d = decadeOf(e.startYear); d <= decadeOf(e.endYear ?? e.startYear); d += 10) get(d).expeditions++;
  }
  for (const e of events) get(decadeOf(e.year)).events++;
  for (const d of documents) get(decadeOf(d.originalYear!)).documents++;
  return [...map.values()]
    .map(({ explorerIds, ...row }) => ({ ...row, explorers: explorerIds.size }))
    .sort((a, b) => a.decade - b.decade);
}

export async function getDecade(decade: number) {
  const from = decade;
  const to = decade + 9;
  const [visits, locations, expeditions, events, documents] = await Promise.all([
    db.explorerWaterway.findMany({
      where: { yearExplored: { gte: from, lte: to } },
      orderBy: [{ yearExplored: "asc" }],
      select: {
        yearExplored: true,
        expeditionNotes: true,
        explorer: { select: { id: true, name: true, nationality: true, imageUrl: true, birthYear: true, deathYear: true } },
        waterway: { select: { id: true, name: true, latitude: true, longitude: true, type: { select: { name: true } } } },
      },
    }),
    db.location.findMany({
      where: { yearEstablished: { gte: from, lte: to } },
      orderBy: [{ yearEstablished: "asc" }, { name: "asc" }],
      select: { id: true, name: true, latitude: true, longitude: true, locationType: true, yearEstablished: true, waterway: { select: { id: true, name: true } } },
    }),
    db.expedition.findMany({
      where: { startYear: { lte: to }, OR: [{ endYear: { gte: from } }, { endYear: null, startYear: { gte: from } }] },
      orderBy: [{ startYear: "asc" }, { sortOrder: "asc" }],
      select: { id: true, name: true, startYear: true, endYear: true, color: true, explorer: { select: { id: true, name: true } }, _count: { select: { legs: true } } },
    }),
    db.timelineEvent.findMany({
      where: { year: { gte: from, lte: to } },
      orderBy: [{ year: "asc" }, { month: "asc" }, { day: "asc" }],
      select: { id: true, title: true, year: true, theme: true, importance: true, explorerId: true, waterwayId: true, locationId: true },
    }),
    db.primarySourceDocument.findMany({
      where: { isPublished: true, originalYear: { gte: from, lte: to } },
      orderBy: [{ originalYear: "asc" }, { title: "asc" }],
      select: { id: true, title: true, author: true, originalYear: true, documentType: true },
    }),
  ]);

  // Visits grouped by explorer, explorers in order of their first visit in the decade
  const groups = new Map<string, { explorer: (typeof visits)[number]["explorer"]; visits: { year: number; notes: string | null; waterway: (typeof visits)[number]["waterway"] }[] }>();
  for (const v of visits) {
    const g = groups.get(v.explorer.id) ?? { explorer: v.explorer, visits: [] };
    g.visits.push({ year: v.yearExplored!, notes: v.expeditionNotes, waterway: v.waterway });
    groups.set(v.explorer.id, g);
  }

  return {
    decade,
    explorers: [...groups.values()],
    locations,
    expeditions: expeditions.map(({ _count, ...e }) => ({ ...e, legCount: _count.legs })),
    events,
    documents,
    waterwayIds: [...new Set(visits.map((v) => v.waterway.id))],
  };
}

// ---------------------------------------------------------------------------------------
// Everything about a person: the records that name an explorer, by id or by name
// ---------------------------------------------------------------------------------------

/** Honorifics the figure and lesson JSON carry or omit relative to Explorer.name. */
export const normalizePersonName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/\b(sir|dr\.?|captain|lord)\b/g, "")
    .replace(/\s*\(.*\)\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();

const parseArray = (value: string | null): unknown[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export async function getExplorerConnections(explorer: { id: string; name: string }) {
  const normalized = normalizePersonName(explorer.name);
  const [documents, timelineEvents, historicalEvents, discoveries, figureRows, maps, lessonRows] = await Promise.all([
    db.primarySourceDocument.findMany({
      where: { explorerId: explorer.id, isPublished: true },
      orderBy: [{ originalYear: "asc" }, { title: "asc" }],
      select: { id: true, title: true, documentType: true, author: true, originalYear: true, originalDate: true },
    }),
    db.timelineEvent.findMany({
      where: { explorerId: explorer.id },
      orderBy: [{ year: "asc" }, { month: "asc" }, { day: "asc" }],
      select: { id: true, title: true, year: true, endYear: true, theme: true, importance: true, waterwayId: true, locationId: true },
    }),
    db.historicalEvent.findMany({
      where: { explorerId: explorer.id },
      orderBy: [{ year: "asc" }],
      select: { id: true, title: true, year: true, category: true, latitude: true, longitude: true, locationName: true, waterwayId: true, locationId: true },
    }),
    db.archaeologicalDiscovery.findMany({
      orderBy: [{ discoveryYear: "asc" }],
      select: { id: true, name: true, discoveryYear: true, relatedExplorerName: true, latitude: true, longitude: true, waterwayId: true },
    }),
    db.notableFigure.findMany({
      where: { associatedExplorers: { not: null } },
      select: { id: true, name: true, role: true, nation: true, figureType: true, imageUrl: true, associatedExplorers: true },
      orderBy: { name: "asc" },
    }),
    db.historicalMap.findMany({
      where: { relatedExplorerIds: { contains: explorer.id } },
      orderBy: [{ year: "asc" }, { sortOrder: "asc" }],
      select: { id: true, title: true, mapmaker: true, year: true, yearLabel: true, imageUrl: true },
    }),
    db.lessonPlan.findMany({
      where: { isPublished: true, OR: [{ relatedExplorerIds: { contains: explorer.id } }, { keyFigures: { contains: explorer.name.split(" ").slice(-1)[0] ?? explorer.name } }] },
      select: { id: true, title: true, gradeLevel: true, topic: true, relatedExplorerIds: true, keyFigures: true },
      orderBy: { title: "asc" },
    }),
  ]);

  const matchesName = (value: unknown) => typeof value === "string" && normalizePersonName(value) === normalized;

  const notableFigures = figureRows
    .filter((f) =>
      parseArray(f.associatedExplorers).some((entry) => {
        const e = entry as { name?: string; explorerId?: string | null };
        return e.explorerId === explorer.id || matchesName(e.name);
      })
    )
    .map((f) => {
      const entry = parseArray(f.associatedExplorers).find((x) => {
        const e = x as { name?: string; explorerId?: string | null };
        return e.explorerId === explorer.id || matchesName(e.name);
      }) as { relationship?: string } | undefined;
      return { id: f.id, name: f.name, role: f.role, nation: f.nation, figureType: f.figureType, imageUrl: f.imageUrl, relationship: entry?.relationship ?? null };
    });

  const lessonPlans = lessonRows
    .filter(
      (l) =>
        parseArray(l.relatedExplorerIds).includes(explorer.id) ||
        parseArray(l.keyFigures).some((k) => {
          const f = k as { name?: string; explorerId?: string | null };
          return f.explorerId === explorer.id || matchesName(f.name);
        })
    )
    .map(({ relatedExplorerIds: _r, keyFigures: _k, ...l }) => l);

  return {
    documents,
    timelineEvents,
    historicalEvents,
    discoveries: discoveries.filter((d) => matchesName(d.relatedExplorerName)),
    notableFigures,
    maps,
    lessonPlans,
  };
}
