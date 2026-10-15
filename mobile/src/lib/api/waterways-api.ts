// React Query hooks for Canadian Waterways API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type {
  Waterway,
  WaterwayDetail,
  WaterwayOverviewDataset,
  Location,
  LocationDetail,
  Explorer,
  ExplorerDetail,
  IndigenousNation,
  UserContribution,
  ContributionSubmission,
  Quiz,
  QuizQuestion,
  QuizAttemptSubmission,
  QuizAttemptResponse,
  WaterwayGeometry,
} from '@/lib/types/waterways';

// Query keys for cache management
export const waterwaysKeys = {
  all: ['waterways'] as const,
  lists: () => [...waterwaysKeys.all, 'list'] as const,
  list: () => [...waterwaysKeys.lists()] as const,
  details: () => [...waterwaysKeys.all, 'detail'] as const,
  detail: (id: string) => [...waterwaysKeys.details(), id] as const,
  overview: () => [...waterwaysKeys.all, 'overview'] as const,
  riverOverview: () => [...waterwaysKeys.overview(), 'rivers'] as const,
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

export const contributionsKeys = {
  all: ['contributions'] as const,
  lists: () => [...contributionsKeys.all, 'list'] as const,
  list: () => [...contributionsKeys.lists()] as const,
  byWaterway: (waterwayId: string) => [...contributionsKeys.all, 'waterway', waterwayId] as const,
  byLocation: (locationId: string) => [...contributionsKeys.all, 'location', locationId] as const,
};

// Waterways hooks
export function useWaterways() {
  return useQuery({
    queryKey: waterwaysKeys.list(),
    queryFn: () => api.get<Waterway[]>('/api/waterways'),
  });
}

export function useRiverOverview() {
  return useQuery({
    queryKey: waterwaysKeys.riverOverview(),
    queryFn: () => api.get<WaterwayOverviewDataset>('/api/waterways/overview/rivers'),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
}

export function useWaterwayDetail(id: string | null) {
  return useQuery({
    queryKey: waterwaysKeys.detail(id ?? ''),
    queryFn: () => api.get<WaterwayDetail>(`/api/waterways/${id}`),
    enabled: !!id,
  });
}

/** Simplified boundary/route for the map; tiny compared with the raw KML (up to 12.7 MB). */
export function useWaterwayGeometry(id: string | null, tier: WaterwayGeometry['tier'] = 'local') {
  return useQuery({
    queryKey: [...waterwaysKeys.detail(id ?? ''), 'geometry', tier] as const,
    queryFn: () => api.get<WaterwayGeometry | null>(`/api/waterways/${id}/geometry?tier=${tier}`),
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // geometry only changes when an admin re-uploads KML
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

// Contributions hooks
export function useContributions() {
  return useQuery({
    queryKey: contributionsKeys.list(),
    queryFn: () => api.get<UserContribution[]>('/api/contributions'),
  });
}

export function useWaterwayContributions(waterwayId: string | null) {
  return useQuery({
    queryKey: contributionsKeys.byWaterway(waterwayId ?? ''),
    queryFn: () => api.get<UserContribution[]>(`/api/contributions/waterway/${waterwayId}`),
    enabled: !!waterwayId,
  });
}

export function useLocationContributions(locationId: string | null) {
  return useQuery({
    queryKey: contributionsKeys.byLocation(locationId ?? ''),
    queryFn: () => api.get<UserContribution[]>(`/api/contributions/location/${locationId}`),
    enabled: !!locationId,
  });
}

export function useSubmitContribution() {
  return useMutation({
    mutationFn: (submission: ContributionSubmission) =>
      api.post<UserContribution>('/api/contributions', submission),
  });
}

// Admin types
export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  admin?: {
    email: string;
    name: string;
    role: 'super_admin' | 'moderator';
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface PendingContribution extends UserContribution {
  contributorEmail?: string | null;
}

export interface ReviewContributionPayload {
  id: string;
  status: 'approved' | 'rejected';
  adminNotes?: string;
}

// Admin query keys
export const adminKeys = {
  all: ['admin'] as const,
  contributions: () => [...adminKeys.all, 'contributions'] as const,
  pendingContributions: () => [...adminKeys.contributions(), 'pending'] as const,
};

// Admin hooks
export function useAdminLogin() {
  return useMutation({
    mutationFn: (credentials: AdminLoginCredentials) =>
      api.post<AdminLoginResponse>('/api/admin/login', credentials),
  });
}

export function usePendingContributions(enabled: boolean = true) {
  return useQuery({
    queryKey: adminKeys.pendingContributions(),
    queryFn: () => api.get<PendingContribution[]>('/api/admin/contributions?status=pending'),
    enabled,
  });
}

export function useReviewContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, adminNotes }: ReviewContributionPayload) =>
      api.patch<UserContribution>(`/api/admin/contributions/${id}`, { status, adminNotes }),
    onSuccess: () => {
      // Admin pending list, and the public per-waterway/location contribution lists
      // (an approved contribution becomes visible in the detail sheets).
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ queryKey: contributionsKeys.all });
    },
  });
}

// Quiz query keys
export const quizzesKeys = {
  all: ['quizzes'] as const,
  lists: () => [...quizzesKeys.all, 'list'] as const,
  list: (filters?: QuizFilters) => [...quizzesKeys.lists(), filters] as const,
  details: () => [...quizzesKeys.all, 'detail'] as const,
  detail: (id: string) => [...quizzesKeys.details(), id] as const,
};

export const adminQuizzesKeys = {
  all: ['admin-quizzes'] as const,
  lists: () => [...adminQuizzesKeys.all, 'list'] as const,
  list: () => [...adminQuizzesKeys.lists()] as const,
  details: () => [...adminQuizzesKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminQuizzesKeys.details(), id] as const,
  stats: () => [...adminQuizzesKeys.all, 'stats'] as const,
};

// Quiz filter types
export interface QuizFilters {
  category?: string;
  gradeLevel?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Quiz stats type
export interface QuizStats {
  totalQuizzes: number;
  publishedQuizzes: number;
  totalAttempts: number;
  averageScore: number;
  byCategory: { category: string; count: number }[];
  byDifficulty: { difficulty: string; count: number }[];
}

// Public quiz hooks
export function useQuizzes(filters?: QuizFilters) {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
  if (filters?.difficulty) params.append('difficulty', filters.difficulty);
  const queryString = params.toString();

  return useQuery({
    queryKey: [...quizzesKeys.lists(), queryString] as const,
    queryFn: () => api.get<Quiz[]>(`/api/quizzes${queryString ? `?${queryString}` : ''}`),
  });
}

export function useQuiz(id: string | null) {
  return useQuery({
    queryKey: quizzesKeys.detail(id ?? ''),
    queryFn: () => api.get<Quiz>(`/api/quizzes/${id}`),
    enabled: !!id,
  });
}

export function useSubmitQuizAttempt() {
  return useMutation({
    mutationFn: ({ quizId, submission }: { quizId: string; submission: QuizAttemptSubmission }) =>
      api.post<QuizAttemptResponse>(`/api/quizzes/${quizId}/attempt`, submission),
  });
}

// Admin quiz hooks
export function useAdminQuizzes(enabled: boolean = true) {
  return useQuery({
    queryKey: adminQuizzesKeys.list(),
    queryFn: () => api.get<Quiz[]>('/api/admin/quizzes'),
    enabled,
  });
}

export function useAdminQuiz(id: string | null) {
  return useQuery({
    queryKey: adminQuizzesKeys.detail(id ?? ''),
    queryFn: () => api.get<Quiz>(`/api/admin/quizzes/${id}`),
    enabled: !!id,
  });
}

export interface CreateQuizPayload {
  title: string;
  description?: string;
  gradeLevel?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  isPublished?: boolean;
}

// Every quiz mutation refreshes both the admin caches and the public quiz caches:
// publishing/editing a quiz must show up on the Quizzes tab without waiting for staleTime.
const invalidateQuizCaches = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: adminQuizzesKeys.all });
  queryClient.invalidateQueries({ queryKey: quizzesKeys.all });
};

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuizPayload) =>
      api.post<Quiz>('/api/admin/quizzes', payload),
    onSuccess: () => invalidateQuizCaches(queryClient),
  });
}

export interface UpdateQuizPayload {
  id: string;
  title?: string;
  description?: string;
  gradeLevel?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  isPublished?: boolean;
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateQuizPayload) =>
      api.patch<Quiz>(`/api/admin/quizzes/${id}`, payload),
    onSuccess: () => invalidateQuizCaches(queryClient),
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/api/admin/quizzes/${id}`),
    onSuccess: () => invalidateQuizCaches(queryClient),
  });
}

export interface AddQuizQuestionPayload {
  quizId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false';
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
  sourceType?: string;
  sourceId?: string;
  orderIndex?: number;
  points?: number;
}

export function useAddQuizQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quizId, ...payload }: AddQuizQuestionPayload) =>
      api.post<QuizQuestion>(`/api/admin/quizzes/${quizId}/questions`, payload),
    onSuccess: () => invalidateQuizCaches(queryClient),
  });
}

export interface UpdateQuizQuestionPayload {
  quizId: string;
  questionId: string;
  questionText?: string;
  questionType?: 'multiple_choice' | 'true_false';
  options?: { id: string; text: string }[];
  correctAnswer?: string;
  explanation?: string;
  sourceType?: string;
  sourceId?: string;
  orderIndex?: number;
  points?: number;
}

export function useUpdateQuizQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quizId, questionId, ...payload }: UpdateQuizQuestionPayload) =>
      api.patch<QuizQuestion>(`/api/admin/quizzes/${quizId}/questions/${questionId}`, payload),
    onSuccess: () => invalidateQuizCaches(queryClient),
  });
}

export function useDeleteQuizQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quizId, questionId }: { quizId: string; questionId: string }) =>
      api.delete<void>(`/api/admin/quizzes/${quizId}/questions/${questionId}`),
    onSuccess: () => invalidateQuizCaches(queryClient),
  });
}

export function useQuizStats() {
  return useQuery({
    queryKey: adminQuizzesKeys.stats(),
    queryFn: () => api.get<QuizStats>('/api/admin/quizzes/stats'),
  });
}
