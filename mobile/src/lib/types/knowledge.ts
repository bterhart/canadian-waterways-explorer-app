// Mirrors backend/src/lib/knowledge.ts (roadmap item 16, 2026-10-20): one thing a named
// Indigenous person gave an expedition.
import type { Citation } from './citations';

export type KnowledgeKind = 'route_shown' | 'map_drawn' | 'interpreting' | 'testimony' | 'medicine_survival' | 'discovery' | 'diplomacy';

export const KNOWLEDGE_KIND_COLOR: Record<KnowledgeKind, string> = {
  route_shown: '#0E7490',
  map_drawn: '#8B5A2B',
  interpreting: '#6D28D9',
  testimony: '#B45309',
  medicine_survival: '#047857',
  discovery: '#B91C1C',
  diplomacy: '#1D4ED8',
};

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

export interface KnowledgeRecordDetail extends KnowledgeRecord {
  citations: (Citation & { text: string })[];
}

export interface KnowledgeKindCount {
  kind: KnowledgeKind;
  label: string;
  count: number;
}
