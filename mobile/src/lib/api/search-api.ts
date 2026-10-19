// Search hook (roadmap item 3, 2026-10-19): GET /api/search?q=&types=
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type { SearchResponse, SearchType } from '@/lib/types/search';

export const searchKeys = {
  query: (q: string, types: SearchType[] | null) => ['search', q, types ? types.join(',') : 'all'] as const,
};

export function useSearch(query: string, types: SearchType[] | null) {
  const q = query.trim();
  return useQuery({
    queryKey: searchKeys.query(q, types),
    queryFn: () =>
      api.get<SearchResponse>(
        `/api/search?q=${encodeURIComponent(q)}${types && types.length ? `&types=${types.join(',')}` : ''}&limit=120`
      ),
    enabled: q.length >= 2,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previous) => previous,
  });
}
