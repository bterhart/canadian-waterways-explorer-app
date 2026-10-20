// Search across everything (roadmap item 3, 2026-10-19). Mirrors backend/src/lib/search.ts.
export type SearchType =
  | 'waterway'
  | 'location'
  | 'explorer'
  | 'notable_figure'
  | 'document'
  | 'timeline_event'
  | 'historical_event'
  | 'lesson_plan'
  | 'field_trip'
  | 'historical_map'
  | 'indigenous_word'
  | 'pronunciation'
  | 'expedition'
  | 'discovery'
  | 'quiz'
  | 'story'
  | 'knowledge'
  | 'decade';

export interface SearchHit {
  type: SearchType;
  id: string;
  title: string;
  subtitle: string | null;
  snippet: string | null;
  score: number;
  /** What the app needs to open the record; keys vary by type (see openSearchHit). */
  target: Record<string, string | number | null>;
}

// GET /api/search?q=
export interface SearchResponse {
  query: string;
  hits: SearchHit[];
  total: number;
  counts: Partial<Record<SearchType, number>>;
}

export const SEARCH_TYPE_LABEL: Record<SearchType, string> = {
  waterway: 'Waterways',
  location: 'Places',
  explorer: 'Explorers',
  notable_figure: 'Notable figures',
  document: 'Documents',
  timeline_event: 'Timeline',
  historical_event: 'What happened here',
  lesson_plan: 'Deep dives',
  field_trip: 'Field trips',
  historical_map: 'Historic maps',
  indigenous_word: 'Words',
  pronunciation: 'Pronunciations',
  expedition: 'Expeditions',
  discovery: 'Discoveries',
  quiz: 'Quizzes',
  story: 'Stories',
  knowledge: 'Knowledge given',
  decade: 'Decades',
};

export const SEARCH_TYPE_COLOR: Record<SearchType, string> = {
  waterway: '#3B82F6',
  location: '#EF4444',
  explorer: '#2D5A3D',
  notable_figure: '#8B5CF6',
  document: '#6D28D9',
  timeline_event: '#1D4ED8',
  historical_event: '#DC2626',
  lesson_plan: '#047857',
  field_trip: '#10B981',
  historical_map: '#8B5A2B',
  indigenous_word: '#B45309',
  pronunciation: '#C9A227',
  expedition: '#B45309',
  discovery: '#B91C1C',
  quiz: '#0E7490',
  story: '#7C2D12',
  knowledge: '#047857',
  decade: '#8B5A2B',
};
