// Expedition route layer hooks (roadmap item 2, 2026-10-19).
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type { ExpeditionDetail, ExpeditionSummary } from '@/lib/types/expeditions';

export const expeditionsKeys = {
  all: ['expeditions'] as const,
  list: () => ['expeditions', 'list'] as const,
  detail: (id: string) => ['expeditions', 'detail', id] as const,
};

export function useExpeditions() {
  return useQuery({
    queryKey: expeditionsKeys.list(),
    queryFn: () => api.get<ExpeditionSummary[]>('/api/expeditions'),
    staleTime: 60 * 60 * 1000,
  });
}

export function useExpedition(id: string | null) {
  return useQuery({
    queryKey: expeditionsKeys.detail(id ?? ''),
    queryFn: () => api.get<ExpeditionDetail>(`/api/expeditions/${id}`),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}
