import type { KnowledgeRecord } from './knowledge';
// Types for Canadian Waterways Education App
import type { ExplorerExpedition } from './expeditions';
import type {
  ExplorerDiscoveryRef,
  ExplorerDocumentRef,
  ExplorerEventRef,
  ExplorerFigureRef,
  ExplorerLessonRef,
  ExplorerMapRef,
} from './connections';

// Waterway types
export type WaterwayType = 'river' | 'lake' | 'bay' | 'strait';

export interface WaterwayTypeInfo {
  id: string;
  name: string;
}

export interface Waterway {
  id: string;
  name: string;
  indigenousName: string | null;
  latitude: number;
  longitude: number;
  regionName: string;
  type: {
    name: string;
  };
}

// GET /api/waterways/:id/geometry?tier=local|region|nation
/** nation/region/local match the home-map overview; detail/fine serve the selected trace when zoomed in. */
export type GeometryTier = 'nation' | 'region' | 'local' | 'detail' | 'fine';

export interface WaterwayGeometry {
  geometryKind: 'line' | 'area';
  tier: GeometryTier;
  toleranceDeg: number;
  pathCount: number;
  pointCount: number;
  originalPointCount: number;
  /** [latitude, longitude] pairs, simplified server-side. */
  paths: [number, number][][];
  /** One entry per path when the server sends it: a river's water surface is 'area', its centreline 'line'. */
  pathKinds?: ('line' | 'area')[];
}

export interface ExplorerWaterway {
  id: string;
  explorerId: string;
  waterwayId: string;
  yearExplored: number | null;
  expeditionNotes: string | null;
  explorer: {
    id: string;
    name: string;
    birthYear: number | null;
    deathYear: number | null;
    nationality: string | null;
    biography: string;
    notableAchievements: string | null;
    imageUrl: string | null;
  };
}

// One "Additional Study" entry (ReadingGuide table in Turso; decision 12, 2026-10-16).
export interface ReadingGuideEntry {
  id: string;
  title: string;
  authorSource: string | null;
  publisher: string | null;
  year: string | null;
  url: string | null;
  description: string | null;
  gradeLevel: string | null;
}

export interface RelatedNotableFigure {
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
  associatedLocations: string[] | null;
}

export interface FurTradeInfo {
  id: string;
  waterwayId: string;
  tradingCompany: string | null;
  peakTradePeriod: string | null;
  primaryFurs: string | null;
  tradeRouteNotes: string | null;
}

export interface WaterwayLocation {
  id: string;
  name: string;
  indigenousName: string | null;
  indigenousLanguage: string | null;
  description: string;
  latitude: number;
  longitude: number;
  locationType: string;
  yearEstablished: number | null;
  historicalNotes: string | null;
  imageUrl: string | null;
  cartographer: Cartographer | null;
}

// Archaeological discovery types
export interface ArchaeologicalDiscovery {
  id: string;
  name: string;
  discoveryYear: number;
  description: string;
  significance: string;
  relatedExpedition: string | null;
  relatedExplorerName: string | null;
  expeditionYear: number | null;
  latitude: number | null;
  longitude: number | null;
  locationDescription: string | null;
  waterwayId: string | null;
  sources: string | null;
}

// A hydrological link to another waterway (WaterwayConnection table in Turso, 2026-10-18).
// direction "outgoing": this waterway <relation> other (this flows_into other); "incoming": other <relation> this.
export type WaterwayRelation = 'flows_into' | 'part_of' | 'joins' | 'outlet_of';
export interface WaterwayConnection {
  id: string;
  relation: WaterwayRelation | string;
  direction: 'outgoing' | 'incoming';
  notes: string | null;
  waterway: { id: string; name: string; latitude: number; longitude: number; type: { name: string } };
}

export interface WaterwayDetail {
  id: string;
  name: string;
  indigenousName: string | null;
  indigenousLanguage: string | null;
  description: string;
  latitude: number;
  longitude: number;
  regionName: string;
  typeId: string;
  historicalSignificance: string | null;
  hasKml: boolean; // raw KML is never sent; see useWaterwayGeometry
  imageUrl: string | null;
  galleryImages: string | null;
  videoUrl: string | null;
  type: WaterwayTypeInfo;
  explorers: ExplorerWaterway[];
  notableFigures: RelatedNotableFigure[];
  furTradeInfo: FurTradeInfo | null;
  locations: WaterwayLocation[];
  discoveries: ArchaeologicalDiscovery[];
  connections: WaterwayConnection[];
  readingGuide: ReadingGuideEntry[];
  /** Knowledge given here or to this person by named Indigenous people (roadmap item 16); absent on older servers. */
  knowledgeGiven?: KnowledgeRecord[];
}

// Waterway overview geometry types
export type OverviewTierName = 'nation' | 'region' | 'local';
export type OverviewGeometryKind = 'line' | 'area';
export type OverviewLngLat = [number, number];

export interface WaterwayOverviewTier {
  toleranceDeg: number;
  pathCount: number;
  pointCount: number;
  paths: OverviewLngLat[][];
}

export interface WaterwayOverviewRecord {
  id: string;
  name: string;
  indigenousName: string | null;
  regionName: string;
  typeName: string;
  labelPoint: {
    lng: number;
    lat: number;
  };
  bbox: [number, number, number, number] | null;
  geometryKind: OverviewGeometryKind;
  hasKml: boolean;
  original: {
    pathCount: number;
    pointCount: number;
  };
  tiers: Record<OverviewTierName, WaterwayOverviewTier>;
}

export interface WaterwayOverviewDataset {
  generatedAt: string;
  source: string;
  filters: {
    typeFilter: string[] | null;
    onlyWithKml: boolean;
  };
  tolerancesDeg: Record<OverviewTierName, number>;
  stats: {
    totalWaterwaysRead: number;
    totalWaterwaysWritten: number;
    skippedNoKml: number;
    skippedNoGeometry: number;
  };
  waterways: WaterwayOverviewRecord[];
}

// Location types
export type LocationType = 'fort' | 'trading_post' | 'portage' | 'settlement';

export interface Location {
  id: string;
  name: string;
  indigenousName: string | null;
  latitude: number;
  longitude: number;
  locationType: string;
  yearEstablished: number | null;
  imageUrl: string | null;
  waterway: {
    id: string;
    name: string;
  };
}

export interface Cartographer {
  id: string;
  name: string;
  birthYear: number | null;
  deathYear: number | null;
  nationality: string | null;
  biography: string | null;
  notableMaps: string | null;
}

export interface LocationDetail {
  id: string;
  name: string;
  indigenousName: string | null;
  indigenousLanguage: string | null;
  description: string;
  latitude: number;
  longitude: number;
  locationType: string;
  yearEstablished: number | null;
  historicalNotes: string | null;
  imageUrl: string | null;
  galleryImages: string | null;
  videoUrl: string | null;
  waterwayId: string;
  cartographerId: string | null;
  waterway: {
    id: string;
    name: string;
    type: WaterwayTypeInfo;
    explorers: ExplorerWaterway[];
    notableFigures: RelatedNotableFigure[];
    furTradeInfo: FurTradeInfo | null;
  };
  cartographer: Cartographer | null;
  readingGuide: ReadingGuideEntry[];
  /** Knowledge given here or to this person by named Indigenous people (roadmap item 16); absent on older servers. */
  knowledgeGiven?: KnowledgeRecord[];
}

// Explorer types
export interface Explorer {
  id: string;
  name: string;
  birthYear: number | null;
  deathYear: number | null;
  nationality: string | null;
  imageUrl: string | null;
}

export interface ExplorerWaterwayDetail {
  id: string;
  explorerId: string;
  waterwayId: string;
  yearExplored: number | null;
  expeditionNotes: string | null;
  waterway: {
    id: string;
    name: string;
    type: WaterwayTypeInfo;
  };
}

export interface ExplorerDetail {
  id: string;
  name: string;
  birthYear: number | null;
  deathYear: number | null;
  nationality: string | null;
  biography: string;
  notableAchievements: string | null;
  imageUrl: string | null;
  waterways: ExplorerWaterwayDetail[];
  readingGuide: ReadingGuideEntry[];
  /** Knowledge given here or to this person by named Indigenous people (roadmap item 16); absent on older servers. */
  knowledgeGiven?: KnowledgeRecord[];
  /** Expedition route layer (roadmap item 2): the explorer's dated journeys, absent on older servers. */
  expeditions?: ExplorerExpedition[];
  /** Everything about this person (roadmap item 1): the records that name the explorer, absent on older servers. */
  documents?: ExplorerDocumentRef[];
  timelineEvents?: ExplorerEventRef[];
  historicalEvents?: ExplorerEventRef[];
  discoveries?: ExplorerDiscoveryRef[];
  notableFigures?: ExplorerFigureRef[];
  maps?: ExplorerMapRef[];
  lessonPlans?: ExplorerLessonRef[];
}

// Indigenous nation type
export interface IndigenousNation {
  id: string;
  name: string;
  alternateNames: string | null;
  languageFamily: string | null;
  traditionalTerritory: string | null;
  culturalNotes: string | null;
}

// Map marker types for UI
export type MarkerType = 'waterway' | 'location';

export interface MapMarker {
  id: string;
  type: MarkerType;
  subType: WaterwayType | LocationType;
  name: string;
  indigenousName: string | null;
  latitude: number;
  longitude: number;
}

// User contribution types
export type ContributionType = 'photo' | 'description' | 'historical_fact' | 'story';
export type ContributionStatus = 'pending' | 'approved' | 'rejected';

export interface UserContribution {
  id: string;
  contributionType: ContributionType;
  title: string;
  content: string;
  imageUrl: string | null;
  contributorName: string | null;
  waterwayId: string | null;
  locationId: string | null;
  status: ContributionStatus;
  createdAt: string;
  waterway?: {
    id: string;
    name: string;
  };
  location?: {
    id: string;
    name: string;
  };
}

export interface ContributionSubmission {
  contributionType: ContributionType;
  title: string;
  content: string;
  imageUrl?: string;
  contributorName?: string;
  contributorEmail?: string;
  waterwayId?: string;
  locationId?: string;
}

// Quiz types for RCGS Education
export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false';
  options: QuizOption[];
  correctAnswer?: string; // Only visible in admin or after attempt
  explanation?: string;   // Only visible after attempt
  sourceType?: string;
  sourceId?: string;
  orderIndex: number;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  isPublished: boolean;
  questionCount?: number;
  questions?: QuizQuestion[];
}

export interface QuizAttemptAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizAttemptSubmission {
  studentName?: string;
  studentGrade?: string;
  schoolName?: string;
  answers: QuizAttemptAnswer[];
}

export interface QuizAttemptResult {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
}

export interface QuizAttemptResponse {
  score: number;
  totalQuestions: number;
  totalPoints: number;
  maxPoints: number;
  percentageScore: number;
  results: QuizAttemptResult[];
}
