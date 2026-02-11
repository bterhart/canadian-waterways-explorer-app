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
  boundaryCoordinates: string | null;
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
  boundaryCoordinates: string | null;
  type: WaterwayTypeInfo;
  explorers: ExplorerWaterway[];
  furTradeInfo: FurTradeInfo | null;
  locations: WaterwayLocation[];
  discoveries: ArchaeologicalDiscovery[];
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
  waterwayId: string;
  cartographerId: string | null;
  waterway: {
    id: string;
    name: string;
    type: WaterwayTypeInfo;
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
