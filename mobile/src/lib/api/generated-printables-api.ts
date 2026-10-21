// Generated printables (roadmap item 13): GET /api/generated-printables/*. Each generator returns a
// complete HTML document the app previews in a WebView and prints or shares with expo-print.
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';

export interface GeneratedPrintableOptions {
  waterways: { id: string; name: string; regionName: string | null; timelineEvents: number }[];
  themes: { theme: string; events: number }[];
  explorers: { id: string; name: string; events: number }[];
  languages: { language: string; terms: number }[];
  termTypes: { termType: string; terms: number }[];
}

export interface GeneratedPrintable {
  title: string;
  html: string;
}

export type MapLabels = 'blank' | 'numbered' | 'named';

export type GeneratedPrintableRequest =
  | { kind: 'blank-map'; waterwayId: string; labels: MapLabels }
  | { kind: 'timeline-strip'; waterwayId?: string; explorerId?: string; theme?: string; blank: boolean }
  | { kind: 'pronunciation-cards'; language?: string; termType?: string };

export function requestPath(r: GeneratedPrintableRequest): string {
  const p = new URLSearchParams();
  if (r.kind === 'blank-map') {
    p.set('waterwayId', r.waterwayId);
    p.set('labels', r.labels);
  } else if (r.kind === 'timeline-strip') {
    if (r.waterwayId) p.set('waterwayId', r.waterwayId);
    if (r.explorerId) p.set('explorerId', r.explorerId);
    if (r.theme) p.set('theme', r.theme);
    if (r.blank) p.set('blank', '1');
  } else {
    if (r.language) p.set('language', r.language);
    if (r.termType) p.set('termType', r.termType);
  }
  return `/api/generated-printables/${r.kind}?${p.toString()}`;
}

export function isComplete(r: GeneratedPrintableRequest): boolean {
  if (r.kind === 'blank-map') return !!r.waterwayId;
  if (r.kind === 'timeline-strip') return !!(r.waterwayId || r.explorerId || r.theme);
  return !!(r.language || r.termType);
}

export const generatedPrintablesKeys = {
  all: ['generated-printables'] as const,
  options: () => [...generatedPrintablesKeys.all, 'options'] as const,
  one: (path: string) => [...generatedPrintablesKeys.all, path] as const,
};

export function useGeneratedPrintableOptions() {
  return useQuery({
    queryKey: generatedPrintablesKeys.options(),
    queryFn: () => api.get<GeneratedPrintableOptions>('/api/generated-printables/options'),
    staleTime: 30 * 60 * 1000,
  });
}

export function useGeneratedPrintable(request: GeneratedPrintableRequest) {
  const path = requestPath(request);
  return useQuery({
    queryKey: generatedPrintablesKeys.one(path),
    queryFn: () => api.get<GeneratedPrintable>(path),
    enabled: isComplete(request),
    staleTime: 10 * 60 * 1000,
  });
}
