// Search hook (roadmap item 3, 2026-10-19): GET /api/search?q=&types=
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type { SearchResponse, SearchType } from '@/lib/types/search';

export const searchKeys = {
  query: (q: string, types: SearchType[] | null, userId?: string) => ['search', q, types ? types.join(',') : 'all', userId ?? ''] as const,
};

/** userId is the device id (lib/identity.ts): the server cuts banded hits to the device's class content scope (spec 10.27). */
export function useSearch(query: string, types: SearchType[] | null, userId?: string) {
  const q = query.trim();
  return useQuery({
    queryKey: searchKeys.query(q, types, userId),
    queryFn: () =>
      api.get<SearchResponse>(
        `/api/search?q=${encodeURIComponent(q)}${types && types.length ? `&types=${types.join(',')}` : ''}${userId ? `&userId=${encodeURIComponent(userId)}` : ''}&limit=120`
      ),
    enabled: q.length >= 2,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previous) => previous,
  });
}
