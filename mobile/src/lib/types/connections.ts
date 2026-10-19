// Connection views (roadmap item 1, 2026-10-19). Mirrors backend/src/lib/connections.ts and
// backend/src/routes/decades.ts.
import type { RelatedRefs } from './education';

export interface SystemWaterway {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  typeName: string;
  explorerCount: number;
  firstYear: number | null;
}

export interface SystemStep extends SystemWaterway {
  notes: string | null;
  /** 1 for a direct link to the viewed water, 2 for a link to a depth-1 water, and so on. */
  depth: number;
  viaId: string;
}

// GET /api/waterways/:id/system
export interface WaterwaySystem {
  waterway: SystemWaterway;
  downstream: SystemStep[];
  upstream: SystemStep[];
  partOf: SystemStep[];
  parts: SystemStep[];
  joins: SystemStep[];
  waterwayIds: string[];
}

// GET /api/decades
export interface DecadeSummary {
  decade: number;
  visits: number;
  explorers: number;
  locations: number;
  expeditions: number;
  events: number;
  documents: number;
}

export interface DecadeVisit {
  year: number;
  notes: string | null;
  waterway: { id: string; name: string; latitude: number; longitude: number; type: { name: string } };
}

export interface DecadeExplorerGroup {
  explorer: { id: string; name: string; nationality: string | null; imageUrl: string | null; birthYear: number | null; deathYear: number | null };
  visits: DecadeVisit[];
}

export interface DecadeLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  locationType: string;
  yearEstablished: number | null;
  waterway: { id: string; name: string };
}

export interface DecadeExpedition {
  id: string;
  name: string;
  startYear: number;
  endYear: number | null;
  color: string | null;
  legCount: number;
  explorer: { id: string; name: string };
}

export interface DecadeEvent extends RelatedRefs {
  id: string;
  title: string;
  year: number;
  theme: string;
  importance: string;
}

export interface DecadeDocument {
  id: string;
  title: string;
  author: string | null;
  originalYear: number | null;
  documentType: string;
}

// GET /api/decades/:decade
export interface DecadeDetail {
  decade: number;
  explorers: DecadeExplorerGroup[];
  locations: DecadeLocation[];
  expeditions: DecadeExpedition[];
  events: DecadeEvent[];
  documents: DecadeDocument[];
  waterwayIds: string[];
}

export const decadeOf = (year: number): number => Math.floor(year / 10) * 10;
export const decadeLabel = (decade: number): string => `${decade}s`;

// "Everything about this person": the fields GET /api/explorers/:id added for item 1
export interface ExplorerDocumentRef {
  id: string;
  title: string;
  documentType: string;
  author: string | null;
  originalYear: number | null;
  originalDate: string | null;
}

export interface ExplorerEventRef extends RelatedRefs {
  id: string;
  title: string;
  year: number;
  endYear?: number | null;
  theme?: string;
  importance?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  locationName?: string | null;
}

export interface ExplorerDiscoveryRef {
  id: string;
  name: string;
  discoveryYear: number;
  relatedExplorerName: string | null;
  latitude: number | null;
  longitude: number | null;
  waterwayId: string | null;
  waterway: { id: string; name: string } | null;
}

export interface ExplorerFigureRef {
  id: string;
  name: string;
  role: string;
  nation: string | null;
  figureType: string;
  imageUrl: string | null;
  relationship: string | null;
}

export interface ExplorerMapRef {
  id: string;
  title: string;
  mapmaker: string;
  year: number;
  yearLabel: string | null;
  imageUrl: string;
}

export interface ExplorerLessonRef {
  id: string;
  title: string;
  gradeLevel: string | null;
  topic: string | null;
}
