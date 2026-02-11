// Types for Educational Features

// Lesson Plan types
export interface LessonPlanSummary {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string | null;
  topic: string;
  estimatedMinutes: number | null;
  createdAt: string;
}

export interface LessonPlanActivity {
  title: string;
  duration: string;
  description: string;
  materials?: string[];
}

export interface CurriculumConnection {
  province: string;
  subject: string;
  grade: string;
  expectations: string[];
}

export interface LessonPlanDetail extends LessonPlanSummary {
  curriculumConnections: CurriculumConnection[] | null;
  objectives: string[];
  materials: string[] | null;
  activities: LessonPlanActivity[] | null;
  discussionQuestions: string[] | null;
  assessmentSuggestions: string | null;
  extensionActivities: string | null;
  relatedQuizIds: string[] | null;
  relatedWaterwayIds: string[] | null;
  relatedLocationIds: string[] | null;
  relatedExplorerIds: string[] | null;
  isPublished: boolean;
}

// Timeline types
export type TimelineTheme =
  | 'exploration'
  | 'fur_trade'
  | 'indigenous'
  | 'confederation'
  | 'maritime'
  | 'general';

export type EventImportance = 'major' | 'moderate' | 'minor';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string | null;
  year: number;
  month: number | null;
  day: number | null;
  endYear: number | null;
  isApproximate: boolean;
  theme: string;
  imageUrl: string | null;
  iconType: string | null;
  explorerId: string | null;
  waterwayId: string | null;
  locationId: string | null;
  importance: string;
}

// Virtual Field Trip types
export interface FieldTripSummary {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string | null;
  estimatedMinutes: number | null;
  theme: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  stopCount: number;
}

export interface FieldTripStop {
  id: string;
  fieldTripId: string;
  title: string;
  description: string | null;
  narrative: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  audioUrl: string | null;
  orderIndex: number;
  waterwayId: string | null;
  locationId: string | null;
}

export interface FieldTripDetail {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string | null;
  estimatedMinutes: number | null;
  theme: string | null;
  coverImageUrl: string | null;
  introduction: string | null;
  conclusion: string | null;
  isPublished: boolean;
  createdAt: string;
  stops: FieldTripStop[];
}

// Primary Source Document types
export type DocumentType =
  | 'map'
  | 'journal'
  | 'letter'
  | 'treaty'
  | 'photograph'
  | 'artwork'
  | 'newspaper'
  | 'other';

export interface DocumentAnnotation {
  id: string;
  text: string;
  x: number;
  y: number;
}

export interface VocabularyTerm {
  term: string;
  definition: string;
}

export interface DocumentSummary {
  id: string;
  title: string;
  documentType: string;
  author: string | null;
  originalDate: string | null;
  originalYear: number | null;
  imageUrl: string | null;
  gradeLevel: string | null;
  createdAt: string;
}

export interface DocumentDetail extends DocumentSummary {
  description: string | null;
  transcription: string | null;
  contextualBackground: string | null;
  historicalSignificance: string | null;
  annotations: DocumentAnnotation[] | null;
  vocabulary: VocabularyTerm[] | null;
  discussionQuestions: string[] | null;
  sourceUrl: string | null;
  sourceAttribution: string | null;
  isPublished: boolean;
}

// Comparison types
export interface ComparisonCriterion {
  criterion: string;
  description: string;
}

export interface ComparisonSummary {
  id: string;
  title: string;
  description: string | null;
  comparisonType: string;
  gradeLevel: string | null;
  createdAt: string;
}

export interface ComparisonDetail extends ComparisonSummary {
  items: Record<string, unknown>[];
  criteria: ComparisonCriterion[];
  analysisPrompts: string[] | null;
  isPublished: boolean;
}

export interface DynamicExplorerComparison {
  comparisonType: 'explorers';
  items: {
    id: string;
    name: string;
    birthYear: number | null;
    deathYear: number | null;
    nationality: string | null;
    biography: string;
    notableAchievements: string | null;
    waterwaysExplored: {
      id: string;
      name: string;
      yearExplored: number | null;
    }[];
  }[];
  criteria: ComparisonCriterion[];
}

export interface DynamicFortComparison {
  comparisonType: 'forts';
  items: {
    id: string;
    name: string;
    indigenousName: string | null;
    locationType: string;
    yearEstablished: number | null;
    historicalNotes: string | null;
    waterway: { id: string; name: string } | null;
    latitude: number;
    longitude: number;
  }[];
  criteria: ComparisonCriterion[];
}

// Pronunciation Guide types
export interface PronunciationGuide {
  id: string;
  term: string;
  termType: string;
  language: string | null;
  phonetic: string | null;
  audioUrl: string | null;
  meaning: string | null;
}

// Student Journal types
export interface JournalEntry {
  id: string;
  journalId: string;
  title: string | null;
  content: string;
  waterwayId: string | null;
  locationId: string | null;
  explorerId: string | null;
  quizId: string | null;
  lessonPlanId: string | null;
  fieldTripId: string | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface SavedLocation {
  id: string;
  journalId: string;
  waterwayId: string | null;
  locationId: string | null;
  explorerId: string | null;
  notes: string | null;
  createdAt: string;
}

export interface StudentJournal {
  id: string;
  studentIdentifier: string;
  studentName: string | null;
  schoolName: string | null;
  gradeLevel: string | null;
  createdAt: string;
  entries: JournalEntry[];
  savedLocations: SavedLocation[];
}

export interface CreateJournalPayload {
  studentIdentifier: string;
  studentName?: string;
  schoolName?: string;
  gradeLevel?: string;
}

export interface CreateEntryPayload {
  title?: string;
  content: string;
  waterwayId?: string;
  locationId?: string;
  explorerId?: string;
  quizId?: string;
  lessonPlanId?: string;
  fieldTripId?: string;
  tags?: string[];
}

// Teacher types
export interface Teacher {
  id: string;
  email: string;
  name: string;
  schoolName: string | null;
  schoolDistrict: string | null;
  province: string | null;
  createdAt: string;
  classCount?: number;
}

export interface TeacherRegisterPayload {
  email: string;
  name: string;
  password: string;
  schoolName?: string;
  schoolDistrict?: string;
  province?: string;
}

export interface TeacherLoginPayload {
  email: string;
  password: string;
}

export interface TeacherLoginResponse {
  success: boolean;
  teacher: Teacher;
}

// Class types
export interface ClassSummary {
  id: string;
  name: string;
  gradeLevel: string;
  schoolYear: string | null;
  joinCode: string;
  isActive: boolean;
  createdAt: string;
  studentCount: number;
  assignmentCount: number;
}

export interface ClassStudent {
  id: string;
  classId: string;
  displayName: string;
  studentCode: string | null;
  createdAt: string;
}

export interface ClassAssignment {
  id: string;
  classId: string;
  assignmentType: 'quiz' | 'lesson_plan' | 'field_trip';
  quizId: string | null;
  lessonPlanId: string | null;
  fieldTripId: string | null;
  title: string;
  instructions: string | null;
  dueDate: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ClassDetail {
  id: string;
  name: string;
  gradeLevel: string;
  schoolYear: string | null;
  joinCode: string;
  isActive: boolean;
  createdAt: string;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  students: ClassStudent[];
  assignments: ClassAssignment[];
}

export interface CreateClassPayload {
  name: string;
  gradeLevel: string;
  schoolYear?: string;
  teacherId: string;
}

export interface CreateAssignmentPayload {
  assignmentType: 'quiz' | 'lesson_plan' | 'field_trip';
  quizId?: string;
  lessonPlanId?: string;
  fieldTripId?: string;
  title: string;
  instructions?: string;
  dueDate?: string;
}

// Printable Resource types
export interface PrintableResource {
  id: string;
  title: string;
  description: string | null;
  resourceType: string;
  gradeLevel: string | null;
  topic: string;
  previewImageUrl: string | null;
  pdfUrl: string | null;
  createdAt: string;
}

// Grade level helper
export const GRADE_LEVELS = [
  'K',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
] as const;

export type GradeLevel = (typeof GRADE_LEVELS)[number];

// Grade level color coding
export const getGradeLevelColor = (grade: string | null): string => {
  if (!grade) return '#6B7280';
  const gradeNum = grade === 'K' ? 0 : parseInt(grade, 10);
  if (isNaN(gradeNum)) return '#6B7280';
  if (gradeNum <= 3) return '#10B981'; // Green for K-3
  if (gradeNum <= 6) return '#3B82F6'; // Blue for 4-6
  if (gradeNum <= 8) return '#8B5CF6'; // Purple for 7-8
  return '#F97316'; // Orange for 9-12
};

export const getGradeLevelLabel = (grade: string | null): string => {
  if (!grade) return 'All Grades';
  if (grade === 'K') return 'Kindergarten';
  return `Grade ${grade}`;
};
