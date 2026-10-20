// Mirrors backend/src/lib/voices.ts (roadmap item 5, 2026-10-20): a checked transcription with
// the spot where its words were written or spoken.
export interface Voice {
  id: string;
  title: string;
  author: string | null;
  year: number | null;
  dateLabel: string | null;
  documentType: string;
  gradeLevel: string | null;
  spotName: string | null;
  latitude: number;
  longitude: number;
  excerpt: string;
  text: string;
  explorerId: string | null;
  waterway: { id: string; name: string } | null;
  location: { id: string; name: string } | null;
}

export interface VoiceNear extends Voice {
  distanceKm: number;
}
