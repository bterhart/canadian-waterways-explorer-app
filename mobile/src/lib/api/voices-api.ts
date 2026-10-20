// The checked transcriptions as voices on the map (roadmap item 5): GET /api/voices.
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type { Voice } from '@/lib/types/voices';

export const voicesKeys = {
  all: ['voices'] as const,
  list: () => [...voicesKeys.all, 'list'] as const,
};

export function useVoices(enabled = true) {
  return useQuery({
    queryKey: voicesKeys.list(),
    queryFn: () => api.get<Voice[]>('/api/voices'),
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}
