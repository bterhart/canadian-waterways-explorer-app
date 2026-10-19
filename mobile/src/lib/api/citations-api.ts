// Citations API hooks (roadmap item 14, 2026-10-19). GET /api/citations/:targetType/:targetId.
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type { CitationsResponse, CitationTargetType } from '@/lib/types/citations';

export const citationsKeys = {
  all: ['citations'] as const,
  detail: (targetType: CitationTargetType, targetId: string) => ['citations', targetType, targetId] as const,
};

export function useCitations(targetType: CitationTargetType, targetId: string | null) {
  return useQuery({
    queryKey: citationsKeys.detail(targetType, targetId ?? ''),
    queryFn: () => api.get<CitationsResponse>(`/api/citations/${targetType}/${targetId}`),
    enabled: !!targetId,
  });
}
