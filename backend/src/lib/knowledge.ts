/**
 * knowledge.ts — Indigenous contributions as records (roadmap item 16, 2026-10-20).
 *
 * A KnowledgeGiven row is one thing a named person gave an expedition. The list is small and
 * read on figure, explorer, waterway and location pages, so it is loaded whole and resolved
 * against the names of the records it links to.
 */
import { db } from "../db";

export const KNOWLEDGE_KINDS = ["route_shown", "map_drawn", "interpreting", "testimony", "medicine_survival", "discovery", "diplomacy"] as const;
export type KnowledgeKind = (typeof KNOWLEDGE_KINDS)[number];
export const KNOWLEDGE_KIND_LABELS: Record<KnowledgeKind, string> = {
  route_shown: "Route shown",
  map_drawn: "Map drawn",
  interpreting: "Interpreting",
  testimony: "Testimony recorded",
  medicine_survival: "Medicine and survival",
  discovery: "Discovery",
  diplomacy: "Diplomacy",
};
export const isKnowledgeKind = (v: string): v is KnowledgeKind => (KNOWLEDGE_KINDS as readonly string[]).includes(v);

export interface KnowledgeRecord {
  id: string;
  title: string;
  kind: KnowledgeKind;
  kindLabel: string;
  year: number | null;
  yearLabel: string | null;
  personName: string;
  nation: string | null;
  figure: { id: string; name: string; imageUrl: string | null } | null;
  explorer: { id: string; name: string } | null;
  explorerName: string | null;
  waterway: { id: string; name: string; latitude: number; longitude: number } | null;
  location: { id: string; name: string; latitude: number; longitude: number } | null;
  latitude: number | null;
  longitude: number | null;
  given: string;
  outcome: string | null;
  sortOrder: number;
}

export interface KnowledgeFilter {
  kind?: string;
  figureId?: string;
  explorerId?: string;
  waterwayId?: string;
  locationId?: string;
}

export async function listKnowledge(filter: KnowledgeFilter = {}): Promise<KnowledgeRecord[]> {
  const rows = await db.knowledgeGiven.findMany({
    where: {
      ...(filter.kind && isKnowledgeKind(filter.kind) ? { kind: filter.kind } : {}),
      ...(filter.figureId ? { figureId: filter.figureId } : {}),
      ...(filter.explorerId ? { explorerId: filter.explorerId } : {}),
      ...(filter.waterwayId ? { waterwayId: filter.waterwayId } : {}),
      ...(filter.locationId ? { locationId: filter.locationId } : {}),
    },
    orderBy: [{ year: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
  });
  return resolve(rows);
}

export async function getKnowledge(id: string): Promise<KnowledgeRecord | null> {
  const row = await db.knowledgeGiven.findUnique({ where: { id } });
  if (!row) return null;
  return (await resolve([row]))[0] ?? null;
}

type Row = Awaited<ReturnType<typeof db.knowledgeGiven.findMany>>[number];

async function resolve(rows: Row[]): Promise<KnowledgeRecord[]> {
  const ids = (key: "figureId" | "explorerId" | "waterwayId" | "locationId") => [...new Set(rows.map((r) => r[key]).filter((x): x is string => !!x))];
  const [figures, explorers, waterways, locations] = await Promise.all([
    ids("figureId").length ? db.notableFigure.findMany({ where: { id: { in: ids("figureId") } }, select: { id: true, name: true, imageUrl: true } }) : [],
    ids("explorerId").length ? db.explorer.findMany({ where: { id: { in: ids("explorerId") } }, select: { id: true, name: true } }) : [],
    ids("waterwayId").length ? db.waterway.findMany({ where: { id: { in: ids("waterwayId") } }, select: { id: true, name: true, latitude: true, longitude: true } }) : [],
    ids("locationId").length ? db.location.findMany({ where: { id: { in: ids("locationId") } }, select: { id: true, name: true, latitude: true, longitude: true } }) : [],
  ]);
  const f = new Map(figures.map((x) => [x.id, x]));
  const e = new Map(explorers.map((x) => [x.id, x]));
  const w = new Map(waterways.map((x) => [x.id, x]));
  const l = new Map(locations.map((x) => [x.id, x]));
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    kind: (isKnowledgeKind(r.kind) ? r.kind : "testimony") as KnowledgeKind,
    kindLabel: KNOWLEDGE_KIND_LABELS[(isKnowledgeKind(r.kind) ? r.kind : "testimony") as KnowledgeKind],
    year: r.year,
    yearLabel: r.yearLabel,
    personName: r.personName,
    nation: r.nation,
    figure: r.figureId ? f.get(r.figureId) ?? null : null,
    explorer: r.explorerId ? e.get(r.explorerId) ?? null : null,
    explorerName: r.explorerName,
    waterway: r.waterwayId ? w.get(r.waterwayId) ?? null : null,
    location: r.locationId ? l.get(r.locationId) ?? null : null,
    latitude: r.latitude,
    longitude: r.longitude,
    given: r.given,
    outcome: r.outcome,
    sortOrder: r.sortOrder,
  }));
}
