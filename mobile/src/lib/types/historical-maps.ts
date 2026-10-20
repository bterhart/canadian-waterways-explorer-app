// Cartography gallery (roadmap item 15, 2026-10-19). Mirrors backend/src/routes/historical-maps.ts.
import type { Citation } from './citations';

export interface HistoricalMapSummary {
  id: string;
  title: string;
  mapmaker: string;
  mapmakerNation: string | null;
  year: number;
  yearLabel: string | null;
  region: string | null;
  imageUrl: string;
  imageCredit: string;
  /** Short projection label read from the sheet (2026-10-20); absent on older servers. */
  projection?: string | null;
  hasBounds: boolean;
}

export interface MapBounds {
  southWest: { latitude: number; longitude: number };
  northEast: { latitude: number; longitude: number };
}

export interface HistoricalMapDetail {
  id: string;
  title: string;
  mapmaker: string;
  mapmakerNation: string | null;
  year: number;
  yearLabel: string | null;
  description: string;
  whatItShows: string | null;
  whatItGotWrong: string | null;
  region: string | null;
  imageUrl: string;
  imageCredit: string;
  imageLicense: string;
  sourceUrl: string | null;
  sourceNote: string | null;
  bounds: MapBounds | null;
  /** The sheet's projection and how it was re-projected for the overlay (2026-10-20). */
  projection?: string | null;
  projectionNote?: string | null;
  /** Mercator-ready copy for the live-map overlay (cropped to the neatline, latitudes re-sampled); absent on older servers. */
  overlayImageUrl?: string | null;
  cartographer: { id: string; name: string; birthYear: number | null; deathYear: number | null; nationality: string | null; biography: string | null; notableMaps: string | null } | null;
  relatedWaterways: { id: string; name: string; latitude: number; longitude: number }[];
  relatedExplorers: { id: string; name: string }[];
  citations: Citation[];
}
