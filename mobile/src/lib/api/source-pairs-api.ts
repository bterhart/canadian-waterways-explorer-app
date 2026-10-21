// Primary-source literacy (roadmap item 10): GET /api/source-pairs, /api/source-pairs/:id, /api/source-pairs/kinds.
// userId is the device id (lib/identity.ts): the server cuts the list to the device's class content scope (spec 10.27).
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type { SourcePairDetail, SourcePairKindInfo, SourcePairSummary } from '@/lib/types/source-pairs';

export const sourcePairsKeys = {
  all: ['source-pairs'] as const,
  list: (filters?: { kind?: string; gradeLevel?: string; userId?: string }) => [...sourcePairsKeys.all, 'list', filters ?? {}] as const,
  kinds: () => [...sourcePairsKeys.all, 'kinds'] as const,
  detail: (id: string) => [...sourcePairsKeys.all, 'detail', id] as const,
};

export function useSourcePairs(filters?: { kind?: string; gradeLevel?: string; userId?: string }) {
  const params = new URLSearchParams();
  if (filters?.kind) params.append('kind', filters.kind);
  if (filters?.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
  if (filters?.userId) params.append('userId', filters.userId);
  const qs = params.toString();
  return useQuery({
    queryKey: sourcePairsKeys.list(filters),
    queryFn: () => api.get<SourcePairSummary[]>(`/api/source-pairs${qs ? `?${qs}` : ''}`),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSourcePairKinds() {
  return useQuery({
    queryKey: sourcePairsKeys.kinds(),
    queryFn: () => api.get<SourcePairKindInfo[]>('/api/source-pairs/kinds'),
    staleTime: 60 * 60 * 1000,
  });
}

export function useSourcePair(id: string | null) {
  return useQuery({
    queryKey: sourcePairsKeys.detail(id ?? ''),
    queryFn: () => api.get<SourcePairDetail>(`/api/source-pairs/${id}`),
    enabled: !!id,
  });
}
