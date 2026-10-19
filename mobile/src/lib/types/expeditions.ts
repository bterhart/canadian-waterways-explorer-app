// Expedition route layer (roadmap item 2, 2026-10-19). Mirrors backend/src/routes/expeditions.ts.
export interface ExpeditionSummary {
  id: string;
  name: string;
  startYear: number;
  endYear: number | null;
  color: string | null;
  legCount: number;
  explorer: { id: string; name: string };
}

/** The shape attached to an explorer's detail (no explorer field). */
export interface ExplorerExpedition {
  id: string;
  name: string;
  startYear: number;
  endYear: number | null;
  summary: string;
  color: string | null;
  source: string | null;
  legCount: number;
}

export interface ExpeditionLeg {
  id: string;
  orderIndex: number;
  year: number | null;
  notes: string | null;
  waterway: { id: string; name: string; latitude: number; longitude: number; type: { name: string } | null };
  location: { id: string; name: string; latitude: number; longitude: number } | null;
}

export interface ExpeditionDetail {
  id: string;
  name: string;
  startYear: number;
  endYear: number | null;
  summary: string;
  color: string | null;
  source: string | null;
  explorer: { id: string; name: string; imageUrl: string | null };
  legs: ExpeditionLeg[];
}
