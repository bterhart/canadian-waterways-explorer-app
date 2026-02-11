// Types for Canadian Waterways Education App

// Waterway types
export type WaterwayType = 'river' | 'lake' | 'bay';

export interface Waterway {
  id: string;
  name: string;
  indigenousName: string | null;
  indigenousNation: string | null;
  type: WaterwayType;
  description: string;
  latitude: number;
  longitude: number;
}

export interface WaterwayDetail extends Waterway {
  historicalSignificance: string;
  length: number | null;
  furTradeInfo: FurTradeInfo | null;
  explorers: Explorer[];
  locations: Location[];
}

// Location types
export type LocationType = 'fort' | 'trading_post' | 'portage' | 'settlement';

export interface Location {
  id: string;
  name: string;
  indigenousName: string | null;
  type: LocationType;
  description: string;
  latitude: number;
  longitude: number;
  yearEstablished: number | null;
}

export interface LocationDetail extends Location {
  historicalSignificance: string;
  cartographer: string | null;
  relatedWaterway: Waterway | null;
}

// Explorer types
export interface Explorer {
  id: string;
  name: string;
  nationality: string;
  birthYear: number | null;
  deathYear: number | null;
  imageUrl: string | null;
  shortBio: string;
}

export interface ExplorerDetail extends Explorer {
  biography: string;
  achievements: string[];
  waterwaysExplored: Waterway[];
}

// Indigenous nation type
export interface IndigenousNation {
  id: string;
  name: string;
  territory: string;
  languages: string[];
  description: string;
}

// Fur trade info type
export interface FurTradeInfo {
  id: string;
  company: string;
  tradingPeriod: string;
  primaryGoods: string[];
  significance: string;
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
