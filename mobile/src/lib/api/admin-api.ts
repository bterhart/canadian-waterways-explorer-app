// React Query hooks for Admin Content Management API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';

// =========== Admin User Types ===========

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  organization: string | null;
  role: 'super_admin' | 'moderator';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  canCreateGlobalContent: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminRegisterPayload {
  email: string;
  name: string;
  organization?: string;
  password: string;
}

export interface AdminApprovePayload {
  canCreateGlobalContent?: boolean;
  permissions?: Record<string, boolean>;
}

export interface AdminRejectPayload {
  rejectionReason: string;
}

// =========== Lesson Plan Types ===========

export interface AdminLessonPlan {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string;
  topic: string;
  estimatedMinutes: number | null;
  isPublished: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLessonPlanDetail extends AdminLessonPlan {
  curriculumConnections: {
    subject: string;
    strand: string;
    expectation?: string;
  }[] | null;
  objectives: string[];
  materials: string[] | null;
  introduction: string | null;
  mainContent: string;
  activities: string[] | null;
  discussionQuestions: string[] | null;
  assessment: string | null;
  extensions: string | null;
  relatedQuizIds: string[] | null;
  relatedWaterwayIds: string[] | null;
  relatedLocationIds: string[] | null;
  relatedExplorerIds: string[] | null;
}

export interface CreateLessonPlanPayload {
  title: string;
  description: string;
  gradeLevel: string;
  topic: string;
  curriculumConnections?: {
    subject: string;
    strand: string;
    expectation?: string;
  }[];
  objectives: string[];
  estimatedMinutes?: number;
  materials?: string[];
  introduction?: string;
  mainContent: string;
  activities?: string[];
  discussionQuestions?: string[];
  assessment?: string;
  extensions?: string;
  relatedQuizIds?: string[];
  relatedWaterwayIds?: string[];
  relatedLocationIds?: string[];
  relatedExplorerIds?: string[];
  isPublished?: boolean;
  createdById?: string;
}

export type UpdateLessonPlanPayload = Partial<CreateLessonPlanPayload>;

// =========== Field Trip Types ===========

export interface AdminFieldTrip {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string;
  estimatedMinutes: number | null;
  theme: string;
  coverImageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  stopCount: number;
}

export interface AdminFieldTripStop {
  id: string;
  tripId: string;
  orderIndex: number;
  title: string;
  description: string;
  locationId: string | null;
  waterwayId: string | null;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  audioUrl: string | null;
  funFact: string | null;
  thinkQuestion: string | null;
}

export interface AdminFieldTripDetail extends Omit<AdminFieldTrip, 'stopCount'> {
  stops: AdminFieldTripStop[];
}

export interface CreateFieldTripPayload {
  title: string;
  description: string;
  gradeLevel: string;
  estimatedMinutes?: number;
  theme: string;
  coverImageUrl?: string;
  isPublished?: boolean;
}

export type UpdateFieldTripPayload = Partial<CreateFieldTripPayload>;

export interface CreateFieldTripStopPayload {
  orderIndex: number;
  title: string;
  description: string;
  locationId?: string;
  waterwayId?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  audioUrl?: string;
  funFact?: string;
  thinkQuestion?: string;
}

export type UpdateFieldTripStopPayload = Partial<CreateFieldTripStopPayload>;

// =========== Document Types ===========

export interface AdminDocument {
  id: string;
  title: string;
  documentType: string;
  author: string | null;
  originalDate: string | null;
  originalYear: number | null;
  imageUrl: string | null;
  gradeLevel: string | null;
  isPublished: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDocumentDetail extends AdminDocument {
  description: string | null;
  originalText: string | null;
  transcription: string | null;
  annotations: Record<string, string> | null;
  vocabulary: { word: string; definition: string }[] | null;
  discussionQuestions: string[] | null;
  historicalContext: string | null;
  explorerId: string | null;
  waterwayId: string | null;
  locationId: string | null;
}

export interface CreateDocumentPayload {
  title: string;
  documentType: string;
  author?: string;
  originalDate?: string;
  originalYear?: number;
  imageUrl?: string;
  gradeLevel?: string;
  description?: string;
  originalText?: string;
  transcription?: string;
  annotations?: Record<string, string>;
  vocabulary?: { word: string; definition: string }[];
  discussionQuestions?: string[];
  historicalContext?: string;
  explorerId?: string;
  waterwayId?: string;
  locationId?: string;
  isPublished?: boolean;
  createdById?: string;
}

export type UpdateDocumentPayload = Partial<CreateDocumentPayload>;

// =========== Printable Resource Types ===========

export interface AdminPrintable {
  id: string;
  title: string;
  description: string | null;
  resourceType: string;
  gradeLevel: string | null;
  topic: string;
  previewImageUrl: string | null;
  pdfUrl: string | null;
  isPublished: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPrintableDetail extends AdminPrintable {
  content: string | null;
  teacherNotes: string | null;
  answerKey: string | null;
}

export interface CreatePrintablePayload {
  title: string;
  description?: string;
  resourceType: string;
  gradeLevel?: string;
  topic: string;
  previewImageUrl?: string;
  pdfUrl?: string;
  content?: string;
  teacherNotes?: string;
  answerKey?: string;
  isPublished?: boolean;
  createdById?: string;
}

export type UpdatePrintablePayload = Partial<CreatePrintablePayload>;

// =========== Query Keys ===========

export const adminApprovalKeys = {
  all: ['admin-approval'] as const,
  pending: () => [...adminApprovalKeys.all, 'pending'] as const,
  allAdmins: (status?: string) => [...adminApprovalKeys.all, 'all', status] as const,
};

export const adminLessonPlansKeys = {
  all: ['admin-lesson-plans'] as const,
  lists: () => [...adminLessonPlansKeys.all, 'list'] as const,
  list: () => [...adminLessonPlansKeys.lists()] as const,
  details: () => [...adminLessonPlansKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminLessonPlansKeys.details(), id] as const,
};

export const adminFieldTripsKeys = {
  all: ['admin-field-trips'] as const,
  lists: () => [...adminFieldTripsKeys.all, 'list'] as const,
  list: () => [...adminFieldTripsKeys.lists()] as const,
  details: () => [...adminFieldTripsKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminFieldTripsKeys.details(), id] as const,
};

export const adminDocumentsKeys = {
  all: ['admin-documents'] as const,
  lists: () => [...adminDocumentsKeys.all, 'list'] as const,
  list: () => [...adminDocumentsKeys.lists()] as const,
  details: () => [...adminDocumentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminDocumentsKeys.details(), id] as const,
};

export const adminPrintablesKeys = {
  all: ['admin-printables'] as const,
  lists: () => [...adminPrintablesKeys.all, 'list'] as const,
  list: () => [...adminPrintablesKeys.lists()] as const,
  details: () => [...adminPrintablesKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminPrintablesKeys.details(), id] as const,
};

// =========== Admin Approval Hooks ===========

export function useRegisterAdmin() {
  return useMutation({
    mutationFn: (payload: AdminRegisterPayload) =>
      api.post<{ message: string; admin: AdminUser }>('/api/admin-approval/register', payload),
  });
}

export function usePendingAdmins(enabled: boolean = false) {
  return useQuery({
    queryKey: adminApprovalKeys.pending(),
    queryFn: () => api.get<AdminUser[]>('/api/admin-approval/pending'),
    enabled,
  });
}

export function useAllAdmins(status?: string) {
  return useQuery({
    queryKey: adminApprovalKeys.allAdmins(status),
    queryFn: () => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      return api.get<AdminUser[]>(`/api/admin-approval/all${status ? `?${params.toString()}` : ''}`);
    },
  });
}

export function useApproveAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminApprovePayload }) =>
      api.post<{ message: string; admin: AdminUser }>(`/api/admin-approval/approve/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminApprovalKeys.pending() });
      queryClient.invalidateQueries({ queryKey: adminApprovalKeys.all });
    },
  });
}

export function useRejectAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminRejectPayload }) =>
      api.post<{ message: string; admin: AdminUser }>(`/api/admin-approval/reject/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminApprovalKeys.pending() });
      queryClient.invalidateQueries({ queryKey: adminApprovalKeys.all });
    },
  });
}

export function useGrantSuperAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post<{ message: string; admin: AdminUser }>(`/api/admin-approval/grant-super-admin/${id}`, { confirm: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminApprovalKeys.all });
    },
  });
}

// =========== Lesson Plan Hooks ===========

export function useAdminLessonPlans() {
  return useQuery({
    queryKey: adminLessonPlansKeys.list(),
    queryFn: () => api.get<AdminLessonPlan[]>('/api/admin/lesson-plans'),
  });
}

export function useAdminLessonPlan(id: string | null) {
  return useQuery({
    queryKey: adminLessonPlansKeys.detail(id ?? ''),
    queryFn: () => api.get<AdminLessonPlanDetail>(`/api/admin/lesson-plans/${id}`),
    enabled: !!id,
  });
}

export function useCreateLessonPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLessonPlanPayload) =>
      api.post<AdminLessonPlanDetail>('/api/admin/lesson-plans', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminLessonPlansKeys.list() });
    },
  });
}

export function useUpdateLessonPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLessonPlanPayload }) =>
      api.patch<AdminLessonPlanDetail>(`/api/admin/lesson-plans/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminLessonPlansKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminLessonPlansKeys.list() });
    },
  });
}

export function useDeleteLessonPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean; message: string }>(`/api/admin/lesson-plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminLessonPlansKeys.list() });
    },
  });
}

// =========== Field Trip Hooks ===========

export function useAdminFieldTrips() {
  return useQuery({
    queryKey: adminFieldTripsKeys.list(),
    queryFn: () => api.get<AdminFieldTrip[]>('/api/admin/field-trips'),
  });
}

export function useAdminFieldTrip(id: string | null) {
  return useQuery({
    queryKey: adminFieldTripsKeys.detail(id ?? ''),
    queryFn: () => api.get<AdminFieldTripDetail>(`/api/admin/field-trips/${id}`),
    enabled: !!id,
  });
}

export function useCreateFieldTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFieldTripPayload) =>
      api.post<AdminFieldTripDetail>('/api/admin/field-trips', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFieldTripsKeys.list() });
    },
  });
}

export function useUpdateFieldTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFieldTripPayload }) =>
      api.patch<AdminFieldTripDetail>(`/api/admin/field-trips/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminFieldTripsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminFieldTripsKeys.list() });
    },
  });
}

export function useDeleteFieldTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean; message: string }>(`/api/admin/field-trips/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminFieldTripsKeys.list() });
    },
  });
}

export function useCreateFieldTripStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, payload }: { tripId: string; payload: CreateFieldTripStopPayload }) =>
      api.post<AdminFieldTripStop>(`/api/admin/field-trips/${tripId}/stops`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminFieldTripsKeys.detail(variables.tripId) });
    },
  });
}

export function useUpdateFieldTripStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, stopId, payload }: { tripId: string; stopId: string; payload: UpdateFieldTripStopPayload }) =>
      api.patch<AdminFieldTripStop>(`/api/admin/field-trips/${tripId}/stops/${stopId}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminFieldTripsKeys.detail(variables.tripId) });
    },
  });
}

export function useDeleteFieldTripStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, stopId }: { tripId: string; stopId: string }) =>
      api.delete<{ success: boolean; message: string }>(`/api/admin/field-trips/${tripId}/stops/${stopId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminFieldTripsKeys.detail(variables.tripId) });
    },
  });
}

// =========== Document Hooks ===========

export function useAdminDocuments() {
  return useQuery({
    queryKey: adminDocumentsKeys.list(),
    queryFn: () => api.get<AdminDocument[]>('/api/admin/documents'),
  });
}

export function useAdminDocument(id: string | null) {
  return useQuery({
    queryKey: adminDocumentsKeys.detail(id ?? ''),
    queryFn: () => api.get<AdminDocumentDetail>(`/api/admin/documents/${id}`),
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) =>
      api.post<AdminDocumentDetail>('/api/admin/documents', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDocumentsKeys.list() });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDocumentPayload }) =>
      api.patch<AdminDocumentDetail>(`/api/admin/documents/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminDocumentsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminDocumentsKeys.list() });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean; message: string }>(`/api/admin/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDocumentsKeys.list() });
    },
  });
}

// =========== Printable Resource Hooks ===========

export function useAdminPrintables() {
  return useQuery({
    queryKey: adminPrintablesKeys.list(),
    queryFn: () => api.get<AdminPrintable[]>('/api/admin/printables'),
  });
}

export function useAdminPrintable(id: string | null) {
  return useQuery({
    queryKey: adminPrintablesKeys.detail(id ?? ''),
    queryFn: () => api.get<AdminPrintableDetail>(`/api/admin/printables/${id}`),
    enabled: !!id,
  });
}

export function useCreatePrintable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePrintablePayload) =>
      api.post<AdminPrintableDetail>('/api/admin/printables', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPrintablesKeys.list() });
    },
  });
}

export function useUpdatePrintable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePrintablePayload }) =>
      api.patch<AdminPrintableDetail>(`/api/admin/printables/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminPrintablesKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminPrintablesKeys.list() });
    },
  });
}

export function useDeletePrintable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean; message: string }>(`/api/admin/printables/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPrintablesKeys.list() });
    },
  });
}
