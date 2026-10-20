// Indigenous contributions as records (roadmap item 16): GET /api/knowledge.
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type { KnowledgeKindCount, KnowledgeRecord, KnowledgeRecordDetail } from '@/lib/types/knowledge';

export interface KnowledgeFilter {
  kind?: string;
  figureId?: string;
  explorerId?: string;
  waterwayId?: string;
  locationId?: string;
}

export const knowledgeKeys = {
  all: ['knowledge'] as const,
  list: (filter: KnowledgeFilter) => [...knowledgeKeys.all, 'list', filter] as const,
  kinds: () => [...knowledgeKeys.all, 'kinds'] as const,
  detail: (id: string) => [...knowledgeKeys.all, 'detail', id] as const,
};

export function useKnowledge(filter: KnowledgeFilter = {}, enabled = true) {
  const params = new URLSearchParams();
  (Object.entries(filter) as [string, string | undefined][]).forEach(([k, v]) => { if (v) params.append(k, v); });
  const qs = params.toString();
  return useQuery({
    queryKey: knowledgeKeys.list(filter),
    queryFn: () => api.get<KnowledgeRecord[]>(`/api/knowledge${qs ? `?${qs}` : ''}`),
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}

export function useKnowledgeKinds() {
  return useQuery({
    queryKey: knowledgeKeys.kinds(),
    queryFn: () => api.get<KnowledgeKindCount[]>('/api/knowledge/kinds'),
    staleTime: 10 * 60 * 1000,
  });
}

export function useKnowledgeRecord(id: string | null) {
  return useQuery({
    queryKey: knowledgeKeys.detail(id ?? ''),
    queryFn: () => api.get<KnowledgeRecordDetail>(`/api/knowledge/${id}`),
    enabled: !!id,
  });
}
