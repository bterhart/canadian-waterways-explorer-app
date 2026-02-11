// React Query hooks for Educational Features API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import type {
  LessonPlanSummary,
  LessonPlanDetail,
  TimelineEvent,
  FieldTripSummary,
  FieldTripDetail,
  DocumentSummary,
  DocumentDetail,
  ComparisonSummary,
  ComparisonDetail,
  DynamicExplorerComparison,
  DynamicFortComparison,
  PronunciationGuide,
  StudentJournal,
  JournalEntry,
  SavedLocation,
  CreateJournalPayload,
  CreateEntryPayload,
  Teacher,
  TeacherRegisterPayload,
  TeacherLoginPayload,
  TeacherLoginResponse,
  ClassSummary,
  ClassDetail,
  CreateClassPayload,
  CreateAssignmentPayload,
  ClassAssignment,
  PrintableResource,
} from '@/lib/types/education';

// ============= Query Keys =============

export const lessonPlansKeys = {
  all: ['lesson-plans'] as const,
  lists: () => [...lessonPlansKeys.all, 'list'] as const,
  list: (filters?: { gradeLevel?: string; topic?: string }) =>
    [...lessonPlansKeys.lists(), filters] as const,
  details: () => [...lessonPlansKeys.all, 'detail'] as const,
  detail: (id: string) => [...lessonPlansKeys.details(), id] as const,
};

export const timelineKeys = {
  all: ['timeline'] as const,
  lists: () => [...timelineKeys.all, 'list'] as const,
  list: (filters?: {
    theme?: string;
    importance?: string;
    startYear?: string;
    endYear?: string;
  }) => [...timelineKeys.lists(), filters] as const,
  themes: () => [...timelineKeys.all, 'themes'] as const,
  detail: (id: string) => [...timelineKeys.all, 'detail', id] as const,
};

export const fieldTripsKeys = {
  all: ['field-trips'] as const,
  lists: () => [...fieldTripsKeys.all, 'list'] as const,
  list: (filters?: { gradeLevel?: string; theme?: string }) =>
    [...fieldTripsKeys.lists(), filters] as const,
  details: () => [...fieldTripsKeys.all, 'detail'] as const,
  detail: (id: string) => [...fieldTripsKeys.details(), id] as const,
};

export const documentsKeys = {
  all: ['documents'] as const,
  lists: () => [...documentsKeys.all, 'list'] as const,
  list: (filters?: { type?: string; gradeLevel?: string }) =>
    [...documentsKeys.lists(), filters] as const,
  types: () => [...documentsKeys.all, 'types'] as const,
  details: () => [...documentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentsKeys.details(), id] as const,
};

export const comparisonsKeys = {
  all: ['comparisons'] as const,
  lists: () => [...comparisonsKeys.all, 'list'] as const,
  list: (filters?: { type?: string; gradeLevel?: string }) =>
    [...comparisonsKeys.lists(), filters] as const,
  types: () => [...comparisonsKeys.all, 'types'] as const,
  details: () => [...comparisonsKeys.all, 'detail'] as const,
  detail: (id: string) => [...comparisonsKeys.details(), id] as const,
};

export const pronunciationsKeys = {
  all: ['pronunciations'] as const,
  lists: () => [...pronunciationsKeys.all, 'list'] as const,
  list: (filters?: { termType?: string; language?: string }) =>
    [...pronunciationsKeys.lists(), filters] as const,
  termTypes: () => [...pronunciationsKeys.all, 'term-types'] as const,
  languages: () => [...pronunciationsKeys.all, 'languages'] as const,
  detail: (id: string) => [...pronunciationsKeys.all, 'detail', id] as const,
  byTerm: (term: string) => [...pronunciationsKeys.all, 'by-term', term] as const,
};

export const journalsKeys = {
  all: ['journals'] as const,
  byIdentifier: (identifier: string) =>
    [...journalsKeys.all, 'identifier', identifier] as const,
  detail: (id: string) => [...journalsKeys.all, 'detail', id] as const,
};

export const teachersKeys = {
  all: ['teachers'] as const,
  detail: (id: string) => [...teachersKeys.all, 'detail', id] as const,
  classes: (id: string) => [...teachersKeys.all, id, 'classes'] as const,
};

export const classesKeys = {
  all: ['classes'] as const,
  detail: (id: string) => [...classesKeys.all, 'detail', id] as const,
  students: (id: string) => [...classesKeys.all, id, 'students'] as const,
  assignments: (id: string) => [...classesKeys.all, id, 'assignments'] as const,
  progress: (id: string) => [...classesKeys.all, id, 'progress'] as const,
};

export const printablesKeys = {
  all: ['printables'] as const,
  lists: () => [...printablesKeys.all, 'list'] as const,
  list: (filters?: { type?: string; topic?: string; gradeLevel?: string }) =>
    [...printablesKeys.lists(), filters] as const,
  types: () => [...printablesKeys.all, 'types'] as const,
  topics: () => [...printablesKeys.all, 'topics'] as const,
  detail: (id: string) => [...printablesKeys.all, 'detail', id] as const,
};

// ============= Lesson Plans Hooks =============

export function useLessonPlans(filters?: { gradeLevel?: string; topic?: string }) {
  const params = new URLSearchParams();
  if (filters?.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
  if (filters?.topic) params.append('topic', filters.topic);
  const queryString = params.toString();

  return useQuery({
    queryKey: [...lessonPlansKeys.list(filters), queryString] as const,
    queryFn: () =>
      api.get<LessonPlanSummary[]>(
        `/api/lesson-plans${queryString ? `?${queryString}` : ''}`
      ),
  });
}

export function useLessonPlan(id: string | null) {
  return useQuery({
    queryKey: lessonPlansKeys.detail(id ?? ''),
    queryFn: () => api.get<LessonPlanDetail>(`/api/lesson-plans/${id}`),
    enabled: !!id,
  });
}

// ============= Timeline Hooks =============

export function useTimelineEvents(filters?: {
  theme?: string;
  importance?: string;
  startYear?: string;
  endYear?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.theme) params.append('theme', filters.theme);
  if (filters?.importance) params.append('importance', filters.importance);
  if (filters?.startYear) params.append('startYear', filters.startYear);
  if (filters?.endYear) params.append('endYear', filters.endYear);
  const queryString = params.toString();

  return useQuery({
    queryKey: [...timelineKeys.list(filters), queryString] as const,
    queryFn: () =>
      api.get<TimelineEvent[]>(`/api/timeline${queryString ? `?${queryString}` : ''}`),
  });
}

export function useTimelineThemes() {
  return useQuery({
    queryKey: timelineKeys.themes(),
    queryFn: () => api.get<string[]>('/api/timeline/themes'),
  });
}

export function useTimelineEvent(id: string | null) {
  return useQuery({
    queryKey: timelineKeys.detail(id ?? ''),
    queryFn: () => api.get<TimelineEvent>(`/api/timeline/${id}`),
    enabled: !!id,
  });
}

// ============= Field Trips Hooks =============

export function useFieldTrips(filters?: { gradeLevel?: string; theme?: string }) {
  const params = new URLSearchParams();
  if (filters?.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
  if (filters?.theme) params.append('theme', filters.theme);
  const queryString = params.toString();

  return useQuery({
    queryKey: [...fieldTripsKeys.list(filters), queryString] as const,
    queryFn: () =>
      api.get<FieldTripSummary[]>(
        `/api/field-trips${queryString ? `?${queryString}` : ''}`
      ),
  });
}

export function useFieldTrip(id: string | null) {
  return useQuery({
    queryKey: fieldTripsKeys.detail(id ?? ''),
    queryFn: () => api.get<FieldTripDetail>(`/api/field-trips/${id}`),
    enabled: !!id,
  });
}

// ============= Documents Hooks =============

export function useDocuments(filters?: { type?: string; gradeLevel?: string }) {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
  const queryString = params.toString();

  return useQuery({
    queryKey: [...documentsKeys.list(filters), queryString] as const,
    queryFn: () =>
      api.get<DocumentSummary[]>(
        `/api/documents${queryString ? `?${queryString}` : ''}`
      ),
  });
}

export function useDocumentTypes() {
  return useQuery({
    queryKey: documentsKeys.types(),
    queryFn: () => api.get<string[]>('/api/documents/types'),
  });
}

export function useDocument(id: string | null) {
  return useQuery({
    queryKey: documentsKeys.detail(id ?? ''),
    queryFn: () => api.get<DocumentDetail>(`/api/documents/${id}`),
    enabled: !!id,
  });
}

// ============= Comparisons Hooks =============

export function useComparisons(filters?: { type?: string; gradeLevel?: string }) {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
  const queryString = params.toString();

  return useQuery({
    queryKey: [...comparisonsKeys.list(filters), queryString] as const,
    queryFn: () =>
      api.get<ComparisonSummary[]>(
        `/api/comparisons${queryString ? `?${queryString}` : ''}`
      ),
  });
}

export function useComparisonTypes() {
  return useQuery({
    queryKey: comparisonsKeys.types(),
    queryFn: () => api.get<string[]>('/api/comparisons/types'),
  });
}

export function useComparison(id: string | null) {
  return useQuery({
    queryKey: comparisonsKeys.detail(id ?? ''),
    queryFn: () => api.get<ComparisonDetail>(`/api/comparisons/${id}`),
    enabled: !!id,
  });
}

export function useExplorerComparison(explorerIds: string[]) {
  const ids = explorerIds.join(',');
  return useQuery({
    queryKey: [...comparisonsKeys.all, 'explorers', ids] as const,
    queryFn: () =>
      api.get<DynamicExplorerComparison>(`/api/comparisons/generate/explorers?ids=${ids}`),
    enabled: explorerIds.length >= 2,
  });
}

export function useFortComparison(locationIds: string[]) {
  const ids = locationIds.join(',');
  return useQuery({
    queryKey: [...comparisonsKeys.all, 'forts', ids] as const,
    queryFn: () =>
      api.get<DynamicFortComparison>(`/api/comparisons/generate/forts?ids=${ids}`),
    enabled: locationIds.length >= 2,
  });
}

// ============= Pronunciations Hooks =============

export function usePronunciations(filters?: { termType?: string; language?: string }) {
  const params = new URLSearchParams();
  if (filters?.termType) params.append('termType', filters.termType);
  if (filters?.language) params.append('language', filters.language);
  const queryString = params.toString();

  return useQuery({
    queryKey: [...pronunciationsKeys.list(filters), queryString] as const,
    queryFn: () =>
      api.get<PronunciationGuide[]>(
        `/api/pronunciations${queryString ? `?${queryString}` : ''}`
      ),
  });
}

export function usePronunciationTermTypes() {
  return useQuery({
    queryKey: pronunciationsKeys.termTypes(),
    queryFn: () => api.get<string[]>('/api/pronunciations/term-types'),
  });
}

export function usePronunciationLanguages() {
  return useQuery({
    queryKey: pronunciationsKeys.languages(),
    queryFn: () => api.get<string[]>('/api/pronunciations/languages'),
  });
}

export function usePronunciationByTerm(term: string | null) {
  return useQuery({
    queryKey: pronunciationsKeys.byTerm(term ?? ''),
    queryFn: () =>
      api.get<PronunciationGuide>(
        `/api/pronunciations/by-term/${encodeURIComponent(term ?? '')}`
      ),
    enabled: !!term,
  });
}

// ============= Journal Hooks =============

export function useJournalByIdentifier(identifier: string | null) {
  return useQuery({
    queryKey: journalsKeys.byIdentifier(identifier ?? ''),
    queryFn: () => api.get<StudentJournal>(`/api/journals/by-identifier/${identifier}`),
    enabled: !!identifier,
  });
}

export function useJournal(id: string | null) {
  return useQuery({
    queryKey: journalsKeys.detail(id ?? ''),
    queryFn: () => api.get<StudentJournal>(`/api/journals/${id}`),
    enabled: !!id,
  });
}

export function useCreateOrGetJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateJournalPayload) =>
      api.post<StudentJournal>('/api/journals', payload),
    onSuccess: (data) => {
      queryClient.setQueryData(journalsKeys.detail(data.id), data);
      queryClient.setQueryData(
        journalsKeys.byIdentifier(data.studentIdentifier),
        data
      );
    },
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      journalId,
      payload,
    }: {
      journalId: string;
      payload: CreateEntryPayload;
    }) => api.post<JournalEntry>(`/api/journals/${journalId}/entries`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: journalsKeys.detail(variables.journalId),
      });
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      journalId,
      entryId,
      payload,
    }: {
      journalId: string;
      entryId: string;
      payload: Partial<CreateEntryPayload>;
    }) =>
      api.patch<JournalEntry>(
        `/api/journals/${journalId}/entries/${entryId}`,
        payload
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: journalsKeys.detail(variables.journalId),
      });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ journalId, entryId }: { journalId: string; entryId: string }) =>
      api.delete<void>(`/api/journals/${journalId}/entries/${entryId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: journalsKeys.detail(variables.journalId),
      });
    },
  });
}

export function useSaveLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      journalId,
      payload,
    }: {
      journalId: string;
      payload: { waterwayId?: string; locationId?: string; explorerId?: string; notes?: string };
    }) => api.post<SavedLocation>(`/api/journals/${journalId}/saved-locations`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: journalsKeys.detail(variables.journalId),
      });
    },
  });
}

export function useRemoveSavedLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      journalId,
      savedLocationId,
    }: {
      journalId: string;
      savedLocationId: string;
    }) => api.delete<void>(`/api/journals/${journalId}/saved-locations/${savedLocationId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: journalsKeys.detail(variables.journalId),
      });
    },
  });
}

// ============= Teacher Hooks =============

export function useTeacherRegister() {
  return useMutation({
    mutationFn: (payload: TeacherRegisterPayload) =>
      api.post<Teacher>('/api/teachers/register', payload),
  });
}

export function useTeacherLogin() {
  return useMutation({
    mutationFn: (payload: TeacherLoginPayload) =>
      api.post<TeacherLoginResponse>('/api/teachers/login', payload),
  });
}

export function useTeacher(id: string | null) {
  return useQuery({
    queryKey: teachersKeys.detail(id ?? ''),
    queryFn: () => api.get<Teacher>(`/api/teachers/${id}`),
    enabled: !!id,
  });
}

export function useTeacherClasses(teacherId: string | null) {
  return useQuery({
    queryKey: teachersKeys.classes(teacherId ?? ''),
    queryFn: () => api.get<ClassSummary[]>(`/api/teachers/${teacherId}/classes`),
    enabled: !!teacherId,
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Pick<Teacher, 'name' | 'schoolName' | 'schoolDistrict' | 'province'>>;
    }) => api.patch<Teacher>(`/api/teachers/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teachersKeys.detail(variables.id) });
    },
  });
}

// ============= Class Hooks =============

export function useClass(id: string | null) {
  return useQuery({
    queryKey: classesKeys.detail(id ?? ''),
    queryFn: () => api.get<ClassDetail>(`/api/classes/${id}`),
    enabled: !!id,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClassPayload) =>
      api.post<ClassDetail>('/api/classes', payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: teachersKeys.classes(variables.teacherId),
      });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Pick<ClassDetail, 'name' | 'gradeLevel' | 'schoolYear' | 'isActive'>>;
    }) => api.patch<ClassDetail>(`/api/classes/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: classesKeys.detail(variables.id) });
    },
  });
}

export function useDeleteClass() {
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/api/classes/${id}`),
  });
}

export function useRegenerateClassCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classId: string) =>
      api.post<{ joinCode: string }>(`/api/classes/${classId}/regenerate-code`, {}),
    onSuccess: (_, classId) => {
      queryClient.invalidateQueries({ queryKey: classesKeys.detail(classId) });
    },
  });
}

export function useJoinClass() {
  return useMutation({
    mutationFn: (payload: { joinCode: string; displayName: string; studentCode?: string }) =>
      api.post<{ student: { id: string }; class: { id: string; name: string } }>(
        '/api/classes/join',
        payload
      ),
  });
}

export function useClassStudents(classId: string | null) {
  return useQuery({
    queryKey: classesKeys.students(classId ?? ''),
    queryFn: () => api.get<ClassDetail['students']>(`/api/classes/${classId}/students`),
    enabled: !!classId,
  });
}

export function useAddStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      payload,
    }: {
      classId: string;
      payload: { displayName: string; studentCode?: string };
    }) => api.post<ClassDetail['students'][number]>(`/api/classes/${classId}/students`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classesKeys.students(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classesKeys.detail(variables.classId),
      });
    },
  });
}

export function useRemoveStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
      api.delete<void>(`/api/classes/${classId}/students/${studentId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classesKeys.students(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classesKeys.detail(variables.classId),
      });
    },
  });
}

export function useClassAssignments(classId: string | null) {
  return useQuery({
    queryKey: classesKeys.assignments(classId ?? ''),
    queryFn: () => api.get<ClassAssignment[]>(`/api/classes/${classId}/assignments`),
    enabled: !!classId,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      payload,
    }: {
      classId: string;
      payload: CreateAssignmentPayload;
    }) => api.post<ClassAssignment>(`/api/classes/${classId}/assignments`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classesKeys.assignments(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classesKeys.detail(variables.classId),
      });
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      assignmentId,
    }: {
      classId: string;
      assignmentId: string;
    }) => api.delete<void>(`/api/classes/${classId}/assignments/${assignmentId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: classesKeys.assignments(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: classesKeys.detail(variables.classId),
      });
    },
  });
}

// ============= Printables Hooks =============

export function usePrintables(filters?: {
  type?: string;
  topic?: string;
  gradeLevel?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.topic) params.append('topic', filters.topic);
  if (filters?.gradeLevel) params.append('gradeLevel', filters.gradeLevel);
  const queryString = params.toString();

  return useQuery({
    queryKey: [...printablesKeys.list(filters), queryString] as const,
    queryFn: () =>
      api.get<PrintableResource[]>(
        `/api/printables${queryString ? `?${queryString}` : ''}`
      ),
  });
}

export function usePrintableTypes() {
  return useQuery({
    queryKey: printablesKeys.types(),
    queryFn: () => api.get<string[]>('/api/printables/types'),
  });
}

export function usePrintableTopics() {
  return useQuery({
    queryKey: printablesKeys.topics(),
    queryFn: () => api.get<string[]>('/api/printables/topics'),
  });
}

export function usePrintable(id: string | null) {
  return useQuery({
    queryKey: printablesKeys.detail(id ?? ''),
    queryFn: () => api.get<PrintableResource>(`/api/printables/${id}`),
    enabled: !!id,
  });
}
