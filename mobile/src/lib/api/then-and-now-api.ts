// Then-and-now imagery (roadmap item 7): GET /api/then-and-now.
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type { ThenAndNowPair } from '@/lib/types/then-and-now';

export const thenAndNowKeys = {
  all: ['then-and-now'] as const,
  list: () => [...thenAndNowKeys.all, 'list'] as const,
  detail: (id: string) => [...thenAndNowKeys.all, 'detail', id] as const,
};

export function useThenAndNow() {
  return useQuery({
    queryKey: thenAndNowKeys.list(),
    queryFn: () => api.get<ThenAndNowPair[]>('/api/then-and-now'),
    staleTime: 10 * 60 * 1000,
  });
}

export function useThenAndNowPair(id: string | null) {
  return useQuery({
    queryKey: thenAndNowKeys.detail(id ?? ''),
    queryFn: () => api.get<ThenAndNowPair>(`/api/then-and-now/${id}`),
    enabled: !!id,
  });
}
