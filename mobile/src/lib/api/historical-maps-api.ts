// Cartography gallery hooks (roadmap item 15, 2026-10-19).
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type { HistoricalMapDetail, HistoricalMapSummary } from '@/lib/types/historical-maps';

export const historicalMapsKeys = {
  all: ['historical-maps'] as const,
  list: () => ['historical-maps', 'list'] as const,
  detail: (id: string) => ['historical-maps', 'detail', id] as const,
};

export function useHistoricalMaps() {
  return useQuery({
    queryKey: historicalMapsKeys.list(),
    queryFn: () => api.get<HistoricalMapSummary[]>('/api/historical-maps'),
    staleTime: 60 * 60 * 1000,
  });
}

export function useHistoricalMap(id: string | null) {
  return useQuery({
    queryKey: historicalMapsKeys.detail(id ?? ''),
    queryFn: () => api.get<HistoricalMapDetail>(`/api/historical-maps/${id}`),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}
