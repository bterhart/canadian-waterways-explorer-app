import type { KnowledgeRecord } from './knowledge';
import type { VoiceNear } from './voices';
// Types for Educational Features

// Lesson Plan types
export interface LessonPlanSummary {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string | null;
  topic: string;
  estimatedMinutes: number | null;
  heroImageUrl: string | null;
  readingTimeMinutes: number | null;
  createdAt: string;
}

// Deep Dive image type
export interface DeepDiveImage {
  url: string;
  caption: string;
  credit?: string;
}

// Key historical figure type (an element of LessonPlan.keyFigures JSON).
// A figure is tappable when it carries one of the two ids: `explorerId` opens the
// explorer modal, `notableFigureId` opens the Notable Figure screen. Exactly one of
// them is set in the live data (decision 1b, 2026-10-16).
export interface KeyFigure {
  name: string;
  role: string;
  years?: string;
  description: string;
  imageUrl?: string;
  explorerId?: string | null;
  notableFigureId?: string | null;
}

// Deep Dive timeline event type (an element of LessonPlan.timeline JSON).
// `eventId` points at a TimelineEvent row and makes the item tappable.
export interface DeepDiveTimelineEvent {
  year: number;
  title: string;
  description: string;
  eventId?: string | null;
}

// Canonical shape of every entry in LessonPlan.activities / teacherActivities.
// All live rows were normalized to this on 2026-10-14 and the admin API
// (admin-lesson-plans.ts activitySchema) only accepts this shape.
export interface LessonPlanActivity {
  title: string;
  description: string;
  duration: string | null;
  materials: string[];
}

// Shape as stored in Turso (LessonPlan.curriculumConnections) and written by the
// admin API: { subject, strand, expectation }. No province/grade/expectations[] exist.
export interface CurriculumConnection {
  subject: string;
  strand?: string;
  expectation?: string;
}

// Curriculum alignment by province (roadmap item 9, 2026-10-21): an outcome quoted from a
// province's published curriculum (CurriculumOutcome in Turso), served by /api/curriculum.
export interface CurriculumOutcome {
  id: string;
  province: string;
  provinceName: string;
  grade: string;
  course: string;
  strand: string | null;
  code: string | null;
  text: string;
  kind: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceYear: string | null;
  sortOrder: number;
  lessonCount: number;
}

export interface LessonOutcome extends CurriculumOutcome {
  note: string | null;
}

export interface CurriculumSummary {
  province: string;
  provinceName: string;
  grades: { grade: string; course: string; outcomes: number }[];
  sourceTitles: string[];
}

export interface LessonPlanDetail extends LessonPlanSummary {
  curriculumConnections: CurriculumConnection[] | null;
  // The outcomes the lesson meets, by province (item 9); [] until mapped
  outcomes: LessonOutcome[];
  objectives: string[];
  materials: string[] | null;
  activities: LessonPlanActivity[] | null;
  discussionQuestions: string[] | null;
  // Column name in Turso is `assessment`; the public route spreads the row as-is.
  assessment: string | null;
  extensionActivities: string | null;
  relatedQuizIds: string[] | null;
  relatedWaterwayIds: string[] | null;
  relatedLocationIds: string[] | null;
  relatedExplorerIds: string[] | null;
  isPublished: boolean;
  // General User Deep Dive Content
  narrativeContent: string | null;
  mainContent: string | null;
  images: DeepDiveImage[] | null;
  keyFigures: KeyFigure[] | null;
  timeline: DeepDiveTimelineEvent[] | null;
  // Enhanced Teacher Content
  teacherObjectives: string[] | null;
  teacherActivities: LessonPlanActivity[] | null;
  teacherQuestions: string[] | null;
  teacherNotes: string | null;
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

// Related records the server attaches next to the raw id columns (backend lib/related.ts).
// Null when the id is null or dangling.
export interface RelatedExplorerRef {
  id: string;
  name: string;
  imageUrl: string | null;
}
export interface RelatedWaterwayRef {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  typeName: string;
}
export interface RelatedLocationRef {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  locationType: string;
  waterwayId: string;
}
export interface RelatedRefs {
  explorer: RelatedExplorerRef | null;
  waterway: RelatedWaterwayRef | null;
  location: RelatedLocationRef | null;
}

export interface TimelineEvent extends RelatedRefs {
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

// Mirrors the FieldTripStop columns (there is no `narrative` column in Turso) plus the
// related pin and waterway the server attaches when the stop carries their ids.
export interface FieldTripStop {
  id: string;
  tripId: string;
  title: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  audioUrl: string | null;
  funFact: string | null;
  thinkQuestion: string | null;
  orderIndex: number;
  waterwayId: string | null;
  locationId: string | null;
  location: RelatedLocationRef | null;
  waterway: RelatedWaterwayRef | null;
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

// Shapes as stored in Turso (PrimarySourceDocument.annotations / .vocabulary).
export interface DocumentAnnotation {
  gradeLevel: string;
  annotation: string;
}

// Canonical shape (all live rows normalized 2026-10-15; admin API enforces it).
export interface VocabularyTerm {
  word: string;
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

// Mirrors the PrimarySourceDocument columns the public detail route returns.
export interface DocumentDetail extends DocumentSummary, RelatedRefs {
  originalText: string | null;
  transcription: string | null;
  historicalContext: string | null;
  annotations: DocumentAnnotation[] | null;
  vocabulary: VocabularyTerm[] | null;
  discussionQuestions: string[] | null;
  explorerId: string | null;
  waterwayId: string | null;
  locationId: string | null;
  isPublished: boolean;
  /** Where the words were written or spoken (roadmap item 5); null on the pointer-only documents. */
  spotLatitude: number | null;
  spotLongitude: number | null;
  spotName: string | null;
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
  accessToken: string;
  refreshToken: string;
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

// Student side — GET /api/classes/mine?userId=<device id>
export interface StudentAssignmentProgress {
  status: 'not_started' | 'in_progress' | 'completed' | string;
  score: number | null;
  maxScore: number | null;
  completedAt: string | null;
}

export interface StudentAssignment extends ClassAssignment {
  lessonPlan: { id: string; title: string } | null;
  progress: StudentAssignmentProgress | null;
}

// Class content scope (spec 10.27): what the class's students see.
// 'all' everything; 'bands' only content in contentBands (the class's own band when none listed);
// 'assigned' only assigned lessons, quizzes and field trips, other banded content by band.
export type ContentScopeMode = 'all' | 'bands' | 'assigned';

export interface MyClassMembership {
  student: { id: string; displayName: string; joinedAt: string };
  class: {
    id: string;
    name: string;
    gradeLevel: string;
    schoolYear: string | null;
    teacherName: string;
    scopeMode: ContentScopeMode;
    /** The bands the class shows (resolved by the server: contentBands, else the class's own band). */
    contentBands: string[];
  };
  assignments: StudentAssignment[];
}

export interface ClassDetail {
  id: string;
  name: string;
  gradeLevel: string;
  schoolYear: string | null;
  joinCode: string;
  isActive: boolean;
  scopeMode: ContentScopeMode;
  /** JSON array of band labels as stored, or null for the class's own band. */
  contentBands: string | null;
  createdAt: string;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  students: ClassStudent[];
  assignments: (ClassAssignment & {
    progress: { studentId: string; status: string; score: number | null; maxScore: number | null; completedAt: string | null }[];
  })[];
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
  fileUrl: string | null; // column is `fileUrl`; null for every live row today
  createdAt: string;
}

// GET /api/printables/:id — the printable body is stored as HTML in `content`.
export interface PrintableResourceDetail extends PrintableResource {
  content: string | null;
  isPublished: boolean;
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

// Grade level ranges used in the database (K-3, 4-6, 7-9, 10-12)
export const GRADE_LEVEL_RANGES = ['K-3', '4-6', '7-9', '10-12'] as const;
export type GradeLevelRange = (typeof GRADE_LEVEL_RANGES)[number];

// Grade level range color coding
export const getGradeLevelRangeColor = (grade: string | null): string => {
  if (!grade) return '#6B7280';
  switch (grade) {
    case 'K-3':
      return '#10B981'; // Green for K-3
    case '4-6':
      return '#3B82F6'; // Blue for 4-6
    case '7-9':
      return '#8B5CF6'; // Purple for 7-9
    case '10-12':
      return '#F97316'; // Orange for 10-12
    default:
      return '#6B7280';
  }
};

export const getGradeLevelRangeLabel = (grade: string | null): string => {
  if (!grade) return 'All Grades';
  switch (grade) {
    case 'K-3':
      return 'Grades K-3';
    case '4-6':
      return 'Grades 4-6';
    case '7-9':
      return 'Grades 7-9';
    case '10-12':
      return 'Grades 10-12';
    default:
      return grade;
  }
};

// ============= Indigenous Language Learning Types =============

export interface IndigenousWord {
  id: string;
  word: string;
  translation: string;
  language: string;
  phonetic: string | null;
  audioUrl: string | null;
  meaning: string | null;
  culturalContext: string | null;
  category: string | null;
  relatedWaterwayId: string | null;
  relatedLocationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WordOfTheDay {
  id: string;
  date: string;
  wordId: string;
  word: IndigenousWord;
  createdAt: string;
}

export interface VocabularyQuizSummary {
  id: string;
  title: string;
  language: string;
  difficulty: string;
  description: string | null;
  createdAt: string;
}

export interface VocabularyQuizQuestion {
  id: string;
  word: string;
  correctAnswer: string;
  options: string[];
}

export interface VocabularyQuizDetail extends VocabularyQuizSummary {
  questions: VocabularyQuizQuestion[];
  isPublished: boolean;
}

export interface VocabularyQuizSubmitPayload {
  answers: {
    questionId: string;
    selectedAnswer: string;
  }[];
}

export interface VocabularyQuizResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  results: {
    questionId: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    word: string;
  }[];
}

export interface IndigenousStorySummary {
  id: string;
  title: string;
  nation: string;
  language: string | null;
  theme: string | null;
  gradeLevel: string | null;
  summary: string | null;
  relatedWaterwayId: string | null;
  createdAt: string;
}

export interface IndigenousStoryDetail extends IndigenousStorySummary {
  content: string;
  audioUrl: string | null;
  isPublished: boolean;
}

export interface LanguageInfo {
  name: string;
  wordCount: number;
}

export interface CategoryInfo {
  name: string;
  wordCount: number;
}

// ============= Gamification Types =============

export interface UserProgressStats {
  waterwaysExplored: number;
  locationsVisited: number;
  quizzesTaken: number;
  quizPointsEarned: number;
  fieldTripsCompleted: number;
  journalEntriesWritten: number;
  pronunciationsLearned: number;
  documentsRead: number;
}

export interface UserProgressStreaks {
  dailyStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export interface UserProgress {
  userId: string;
  totalPoints: number;
  explorerRank: string;
  nextRank: string | null;
  pointsToNextRank: number;
  progressToNextRank: number;
  stats: UserProgressStats;
  streaks: UserProgressStreaks;
}

export interface AddPointsResponse {
  pointsAdded: number;
  newTotalPoints: number;
  explorerRank: string;
  rankedUp: boolean;
  previousRank: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  sortOrder: number;
  criteria: Record<string, unknown>;
}

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  earnedAt: string;
  criteria: Record<string, unknown>;
}

export interface CheckAchievementsResponse {
  newAchievements: {
    id: string;
    name: string;
    description: string;
    iconName: string;
    category: string;
  }[];
}

export interface DailyChallengeOption {
  id: string;
  text: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  question: string;
  options: DailyChallengeOption[];
  category: string;
  pointsReward: number;
  hasAttempted: boolean;
  userAttempt: {
    answer: string;
    isCorrect: boolean;
    completedAt: string;
  } | null;
  correctAnswer?: string;
  explanation?: string;
}

export interface DailyChallengeSubmitResponse {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  pointsEarned: number;
  completedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  totalPoints: number;
  explorerRank: string;
  quizzesTaken: number;
  fieldTripsCompleted: number;
  dailyStreak: number;
}

export interface RankInfo {
  name: string;
  minPoints: number;
  maxPoints: number | null;
  level: number;
}

// ============= Voyageur Journey Types =============

export interface VoyageurJourneySummary {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string | null;
  difficulty: string | null;
  estimatedMinutes: number | null;
  coverImageUrl: string | null;
  startingLocation: string | null;
  endingLocation: string | null;
  historicalYear: number | null;
  createdAt: string;
  nodeCount: number;
}

export interface JourneyChoice {
  id: string;
  text: string;
  nextNodeId: string;
  consequence?: string;
  pointsChange?: number;
  /** What people actually did at this point, and what came of it (roadmap item 6). */
  whatHappened?: string;
  source?: string;
}

/** The records a journey stop rests on (roadmap item 6); absent on older servers. */
export interface JourneyNodeLinks {
  location: { id: string; name: string; locationType: string; imageUrl: string | null } | null;
  waterway: { id: string; name: string } | null;
  explorer: { id: string; name: string } | null;
  document: { id: string; title: string } | null;
  knowledge: { id: string; title: string } | null;
}

export interface JourneyNode {
  id: string;
  journeyId: string;
  orderIndex: number;
  title: string;
  narrative: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  audioUrl: string | null;
  choices: JourneyChoice[] | null;
  historicalFact: string | null;
  voyageurSong: string | null;
  songLyrics: string | null;
  isEnding: boolean;
  endingType: string | null;
  /** Checked transcriptions written near this node, nearest first (roadmap item 5). */
  voices?: VoiceNear[];
  links?: JourneyNodeLinks;
  source?: string | null;
  sourceUrl?: string | null;
}

export interface VoyageurJourneyDetail {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string | null;
  difficulty: string | null;
  estimatedMinutes: number | null;
  coverImageUrl: string | null;
  startingLocation: string | null;
  endingLocation: string | null;
  historicalYear: number | null;
  introduction: string | null;
  conclusion: string | null;
  isPublished: boolean;
  createdAt: string;
  nodes: JourneyNode[];
  /** Where the journey was written from (roadmap item 6); absent on older servers. */
  source?: string | null;
  sourceUrl?: string | null;
}

export interface JourneyProgress {
  id: string;
  currentNodeId: string | null;
  choicesMade: string[];
  score: number;
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt?: string;
  completedAt?: string | null;
}

export interface StartJourneyResponse {
  progress: JourneyProgress;
  currentNode: JourneyNode;
  journey: {
    id: string;
    title: string;
    description: string | null;
    startingLocation: string | null;
    endingLocation: string | null;
    historicalYear: number | null;
  };
}

export interface JourneyChoiceResponse {
  choiceMade: {
    choiceId: string;
    text: string;
    consequence?: string;
    pointsChange: number;
    whatHappened?: string | null;
    source?: string | null;
  };
  /** Exploration points awarded for finishing (0 when not finished or already awarded). */
  completionPoints?: number;
  progress: JourneyProgress;
  currentNode: JourneyNode;
  isEnding: boolean;
  endingType: string | null;
}

export interface JourneyProgressResponse {
  hasProgress: boolean;
  progress: JourneyProgress | null;
  currentNode: JourneyNode | null;
  journey?: {
    id: string;
    title: string;
    description: string | null;
    startingLocation: string | null;
    endingLocation: string | null;
    historicalYear: number | null;
  };
}

// ============= Map Annotation Types =============

export interface MapPin {
  id: string;
  annotationId: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  linkedWaterwayId: string | null;
  linkedLocationId: string | null;
  linkedExplorerId: string | null;
  createdAt: string;
}

export interface MapRoute {
  id: string;
  annotationId: string;
  title: string;
  description: string | null;
  coordinates: [number, number][];
  color: string | null;
  strokeWidth: number;
  isDashed: boolean;
  compareToExplorerId: string | null;
  createdAt: string;
}

export interface MapNote {
  id: string;
  annotationId: string;
  latitude: number;
  longitude: number;
  content: string;
  backgroundColor: string | null;
  createdAt: string;
}

export interface UserMapAnnotation {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  centerLatitude: number | null;
  centerLongitude: number | null;
  zoomLevel: number | null;
  isPublic: boolean;
  shareCode: string | null;
  createdAt: string;
  updatedAt: string;
  pins: MapPin[];
  routes: MapRoute[];
  notes: MapNote[];
}

export interface CreateMapAnnotationPayload {
  userId: string;
  title: string;
  description?: string;
  centerLatitude?: number;
  centerLongitude?: number;
  zoomLevel?: number;
}

export interface CreatePinPayload {
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  color?: string;
  icon?: string;
  linkedWaterwayId?: string;
  linkedLocationId?: string;
  linkedExplorerId?: string;
}

export interface CreateRoutePayload {
  title: string;
  description?: string;
  coordinates: [number, number][];
  color?: string;
  strokeWidth?: number;
  isDashed?: boolean;
  compareToExplorerId?: string;
}

export interface CreateNotePayload {
  latitude: number;
  longitude: number;
  content: string;
  backgroundColor?: string;
}

// ============= Nearby History Types =============

export interface NearbyHistoryCategory {
  id: string;
  label: string;
  icon: string;
}

export interface HistoricalEvent extends RelatedRefs {
  id: string;
  title: string;
  description: string | null;
  year: number;
  month: number | null;
  day: number | null;
  latitude: number;
  longitude: number;
  locationName: string | null;
  category: string;
  significance: string;
  imageUrl: string | null;
  explorerId: string | null;
  waterwayId: string | null;
  locationId: string | null;
  distance?: number;
}

export interface HistoricalEventDetail extends HistoricalEvent {
  relatedExplorer: {
    id: string;
    name: string;
    birthYear: number | null;
    deathYear: number | null;
  } | null;
  relatedWaterway: {
    id: string;
    name: string;
    indigenousName: string | null;
    latitude: number;
    longitude: number;
  } | null;
  relatedLocation: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    locationType: string;
  } | null;
}

export interface NearbyHistoryResponse {
  events: HistoricalEvent[];
  searchLocation: {
    latitude: number;
    longitude: number;
  };
  radiusKm: number;
  totalFound: number;
}

export interface NearbyWaterwaysResponse {
  waterways: {
    id: string;
    name: string;
    indigenousName: string | null;
    latitude: number;
    longitude: number;
    regionName: string | null;
    historicalSignificance: string | null;
    type: { name: string } | null;
    distance: number;
  }[];
  searchLocation: {
    latitude: number;
    longitude: number;
  };
  radiusKm: number;
  totalFound: number;
}

export interface NearbyLocationsResponse {
  locations: {
    id: string;
    name: string;
    indigenousName: string | null;
    latitude: number;
    longitude: number;
    locationType: string;
    yearEstablished: number | null;
    historicalNotes: string | null;
    waterway: { id: string; name: string } | null;
    distance: number;
  }[];
  searchLocation: {
    latitude: number;
    longitude: number;
  };
  radiusKm: number;
  totalFound: number;
}

// ============= Notable Figures Types =============

export type FigureType = 'woman' | 'indigenous_leader' | 'guide' | 'interpreter' | 'trader';

// An entry of NotableFigure.associatedExplorers. The server fills `explorerId` from the
// stored value or by name match, so the app can open the explorer; null means text only.
export interface AssociatedExplorer {
  name: string;
  relationship: string;
  explorerId: string | null;
  /** Set instead of explorerId when the person is a Notable Figure (opens that screen). */
  notableFigureId: string | null;
}

// Mirrors backend lib/reading-guides.ts (ReadingGuide table).
export interface ReadingGuideItem {
  id: string;
  title: string;
  authorSource: string | null;
  publisher: string | null;
  year: string | null;
  url: string | null;
  description: string | null;
  gradeLevel: string | null;
}

export interface NotableFigureSummary {
  id: string;
  name: string;
  alternateNames: string | null;
  birthYear: number | null;
  deathYear: number | null;
  nation: string | null;
  figureType: string;
  role: string;
  imageUrl: string | null;
  isFeatured: boolean;
  activePeriodStart: number | null;
  activePeriodEnd: number | null;
}

export interface NotableFigureDetail extends NotableFigureSummary {
  birthPlace: string | null;
  biography: string;
  significance: string;
  associatedExplorers: AssociatedExplorer[] | null;
  achievements: string[] | null;
  associatedLocations: string[] | null;
  readingGuide: ReadingGuideItem[];
  /** What this person gave the expeditions (roadmap item 16); absent on older servers. */
  knowledgeGiven?: KnowledgeRecord[];
  createdAt: string;
  updatedAt: string;
}

// ============= Quiz Types =============

export interface QuizSummary {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string | null;
  difficulty: string | null;
  category: string | null;
  createdAt: string;
  questionCount: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: string;
  options: QuizOption[];
  orderIndex: number;
  points: number;
}

export interface QuizDetail {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string | null;
  difficulty: string | null;
  category: string | null;
  questions: QuizQuestion[];
}

export interface QuizAttemptAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizAttemptPayload {
  studentName?: string;
  studentGrade?: string;
  schoolName?: string;
  userId?: string; // device identity (lib/identity.ts) so the attempt can be attributed to a student
  answers: QuizAttemptAnswer[];
}

export interface QuizAttemptResult {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
  pointsEarned: number;
  pointsPossible: number;
}

// Returned by the server whenever a device completes something (quiz, lesson, field trip).
// POST /api/gamification/explore. `awarded` is false when this device already earned
// this record (server-side UserExploration row), in which case activity is null.
export interface ExplorationResult {
  awarded: boolean;
  activity: {
    pointsAdded: number;
    newTotalPoints: number;
    explorerRank: string;
    rankedUp: boolean;
    previousRank: string | null;
  } | null;
  newAchievements: { id: string; name: string; description: string; iconName: string; category: string }[];
}

export type ExplorationActivity =
  | 'waterway_explored'
  | 'location_visited'
  | 'document_read'
  | 'pronunciation_learned'
  | 'journey_completed';

export interface CompletionResult {
  activity: {
    pointsAdded: number;
    newTotalPoints: number;
    explorerRank: string;
    rankedUp: boolean;
    previousRank: string | null;
  };
  newAchievements: { id: string; name: string; description: string; iconName: string; category: string }[];
  assignmentsCompleted: number;
}

export interface QuizAttemptResponse {
  attemptId: string;
  score: number;
  totalQuestions: number;
  totalPoints: number;
  maxPoints: number;
  percentageScore: number;
  results: QuizAttemptResult[];
  gamification: CompletionResult | null; // null when no device id was sent
}
