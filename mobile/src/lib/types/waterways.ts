// Types for Canadian Waterways Education App

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
  kmlData: string | null;
  type: {
    name: string;
  };
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
  kmlData: string | null;
  imageUrl: string | null;
  galleryImages: string | null;
  videoUrl: string | null;
  type: WaterwayTypeInfo;
  explorers: ExplorerWaterway[];
  notableFigures: RelatedNotableFigure[];
  furTradeInfo: FurTradeInfo | null;
  locations: WaterwayLocation[];
  discoveries: ArchaeologicalDiscovery[];
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
