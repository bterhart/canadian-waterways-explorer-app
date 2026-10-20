// Mirrors backend/src/lib/then-and-now.ts (roadmap item 7, 2026-10-20): a period image of a
// spot paired with a modern photograph of the same spot.
export interface ThenAndNowImage {
  url: string;
  year: number | null;
  yearLabel?: string | null;
  caption: string;
  credit: string;
  sourceUrl: string | null;
}

export interface ThenAndNowPair {
  id: string;
  title: string;
  location: { id: string; name: string } | null;
  waterway: { id: string; name: string } | null;
  latitude: number;
  longitude: number;
  then: ThenAndNowImage;
  now: ThenAndNowImage;
  note: string | null;
  sortOrder: number;
}
