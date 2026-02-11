// React Query hooks for Canadian Waterways API
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type {
  Waterway,
  WaterwayDetail,
  Location,
  LocationDetail,
  Explorer,
  ExplorerDetail,
  IndigenousNation,
} from '@/lib/types/waterways';

// Query keys for cache management
export const waterwaysKeys = {
  all: ['waterways'] as const,
  lists: () => [...waterwaysKeys.all, 'list'] as const,
  list: () => [...waterwaysKeys.lists()] as const,
  details: () => [...waterwaysKeys.all, 'detail'] as const,
  detail: (id: string) => [...waterwaysKeys.details(), id] as const,
};

export const locationsKeys = {
  all: ['locations'] as const,
  lists: () => [...locationsKeys.all, 'list'] as const,
  list: () => [...locationsKeys.lists()] as const,
  details: () => [...locationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...locationsKeys.details(), id] as const,
};

export const explorersKeys = {
  all: ['explorers'] as const,
  lists: () => [...explorersKeys.all, 'list'] as const,
  list: () => [...explorersKeys.lists()] as const,
  details: () => [...explorersKeys.all, 'detail'] as const,
  detail: (id: string) => [...explorersKeys.details(), id] as const,
};

export const indigenousNationsKeys = {
  all: ['indigenous-nations'] as const,
  lists: () => [...indigenousNationsKeys.all, 'list'] as const,
  list: () => [...indigenousNationsKeys.lists()] as const,
};

// Waterways hooks
export function useWaterways() {
  return useQuery({
    queryKey: waterwaysKeys.list(),
    queryFn: () => api.get<Waterway[]>('/api/waterways'),
  });
}

export function useWaterwayDetail(id: string | null) {
  return useQuery({
    queryKey: waterwaysKeys.detail(id ?? ''),
    queryFn: () => api.get<WaterwayDetail>(`/api/waterways/${id}`),
    enabled: !!id,
  });
}

// Locations hooks
export function useLocations() {
  return useQuery({
    queryKey: locationsKeys.list(),
    queryFn: () => api.get<Location[]>('/api/locations'),
  });
}

export function useLocationDetail(id: string | null) {
  return useQuery({
    queryKey: locationsKeys.detail(id ?? ''),
    queryFn: () => api.get<LocationDetail>(`/api/locations/${id}`),
    enabled: !!id,
  });
}

// Explorers hooks
export function useExplorers() {
  return useQuery({
    queryKey: explorersKeys.list(),
    queryFn: () => api.get<Explorer[]>('/api/explorers'),
  });
}

export function useExplorerDetail(id: string | null) {
  return useQuery({
    queryKey: explorersKeys.detail(id ?? ''),
    queryFn: () => api.get<ExplorerDetail>(`/api/explorers/${id}`),
    enabled: !!id,
  });
}

// Indigenous nations hooks
export function useIndigenousNations() {
  return useQuery({
    queryKey: indigenousNationsKeys.list(),
    queryFn: () => api.get<IndigenousNation[]>('/api/indigenous/nations'),
  });
}
