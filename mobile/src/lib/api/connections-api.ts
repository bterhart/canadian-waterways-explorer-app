// Connection view hooks (roadmap item 1, 2026-10-19): follow this river, who was here in a decade.
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type { DecadeDetail, DecadeSummary, WaterwaySystem } from '@/lib/types/connections';

export const connectionsKeys = {
  system: (waterwayId: string) => ['waterways', 'system', waterwayId] as const,
  decades: () => ['decades', 'list'] as const,
  decade: (decade: number) => ['decades', 'detail', decade] as const,
};

export function useWaterwaySystem(waterwayId: string | null) {
  return useQuery({
    queryKey: connectionsKeys.system(waterwayId ?? ''),
    queryFn: () => api.get<WaterwaySystem>(`/api/waterways/${waterwayId}/system`),
    enabled: !!waterwayId,
    staleTime: 60 * 60 * 1000,
  });
}

export function useDecades() {
  return useQuery({
    queryKey: connectionsKeys.decades(),
    queryFn: () => api.get<DecadeSummary[]>('/api/decades'),
    staleTime: 60 * 60 * 1000,
  });
}

export function useDecade(decade: number | null) {
  return useQuery({
    queryKey: connectionsKeys.decade(decade ?? 0),
    queryFn: () => api.get<DecadeDetail>(`/api/decades/${decade}`),
    enabled: decade !== null && Number.isFinite(decade),
    staleTime: 60 * 60 * 1000,
  });
}
