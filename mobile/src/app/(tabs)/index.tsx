// Interactive Map Screen for Canadian Waterways Education
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region, Polyline, Polygon, Overlay, type MapPressEvent } from 'react-native-maps';
import { useHistoricalMap } from '@/lib/api/historical-maps-api';
import type { LayoutChangeEvent } from 'react-native';
import { Menu, ChevronDown, ChevronRight, Globe2, X, Route, Layers, Network, History, Search as SearchIcon } from 'lucide-react-native';
import { useExpeditions, useExpedition } from '@/lib/api/expeditions-api';
import { useWaterwaySystem, useDecade } from '@/lib/api/connections-api';
import type { ExpeditionLeg, ExpeditionSummary } from '@/lib/types/expeditions';
import {
  useWaterways,
  useRiverOverview,
  useLocations,
  useExplorers,
  useExplorerDetail,
  useWaterwayGeometry,
} from '@/lib/api/waterways-api';
import DetailBottomSheet, { DetailBottomSheetRef } from '@/components/DetailBottomSheet';
import type {
  MarkerType,
  Waterway,
  Location,
  OverviewTierName,
  GeometryTier,
  WaterwayOverviewRecord,
} from '@/lib/types/waterways';
import { useTranslation } from '@/lib/i18n';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Filter types
type FilterType = 'legend' | 'waterway' | 'explorer' | 'period' | null;

// Time period definitions with year ranges
const TIME_PERIODS = [
  { id: 'pre1700', key: 'pre1700' as const, minYear: null, maxYear: 1699 },
  { id: '1700-1780', key: 'era1700to1780' as const, minYear: 1700, maxYear: 1780 },
  { id: '1780-1821', key: 'era1780to1821' as const, minYear: 1780, maxYear: 1821 },
  { id: '1821-1870', key: 'era1821to1870' as const, minYear: 1821, maxYear: 1870 },
  { id: 'post1870', key: 'post1870' as const, minYear: 1870, maxYear: null },
];

// Canada center coordinates
const CANADA_CENTER: Region = {
  latitude: 56.1304,
  longitude: -106.3468,
  latitudeDelta: 30,
  longitudeDelta: 30,
};

const OVERVIEW_TIER_THRESHOLDS = {
  nationMinDelta: 12,
  regionMinDelta: 4,
};

const OVERVIEW_STROKE_WIDTH: Record<OverviewTierName, number> = {
  nation: 2,
  region: 3,
  local: 4,
};

// Marker colors based on type
const markerColors: Record<string, string> = {
  // Waterway types
  River: '#3B82F6', // Blue
  Lake: '#06B6D4', // Cyan
  Bay: '#10B981', // Green/Teal
  Strait: '#0EA5E9', // Sky blue
  // Location types
  Fort: '#EF4444', // Red
  'Trading Post': '#F97316', // Orange
  Portage: '#92400E', // Brown
  Settlement: '#8B5CF6', // Purple
  'Cultural Site': '#EC4899', // Pink
};

const getMarkerColor = (typeName: string): string => {
  return markerColors[typeName] || '#6B7280';
};

// Pin colour for the waterway/location whose preview card is open
const SELECTED_PIN_COLOR = '#1A3A24';

// Generate Google Earth Web URL
const getGoogleEarthUrl = (latitude: number, longitude: number): string => {
  return `https://earth.google.com/web/@${latitude},${longitude},500a,5000d,35y,0h,45t,0r`;
};

// Parse KML text and extract all coordinate paths
// Calculate region to fit coordinates
const getRegionForCoordinates = (coordinates: { latitude: number; longitude: number }[]): Region | null => {
  if (coordinates.length === 0) return null;

  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLng = coordinates[0].longitude;
  let maxLng = coordinates[0].longitude;

  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });

  const latDelta = (maxLat - minLat) * 1.5 || 2;
  const lngDelta = (maxLng - minLng) * 1.5 || 2;

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(latDelta, 1),
    longitudeDelta: Math.max(lngDelta, 1),
  };
};

const getOverviewTier = (region: Region): OverviewTierName => {
  const maxDelta = Math.max(region.latitudeDelta, region.longitudeDelta);

  if (maxDelta >= OVERVIEW_TIER_THRESHOLDS.nationMinDelta) {
    return 'nation';
  }

  if (maxDelta >= OVERVIEW_TIER_THRESHOLDS.regionMinDelta) {
    return 'region';
  }

  return 'local';
};

const overviewPathToCoordinates = (path: [number, number][]) =>
  path.map(([longitude, latitude]) => ({ latitude, longitude }));

// Never hand MapKit a degenerate overlay. A line needs two distinct points and a polygon
// three; anything less draws nothing and has crashed the native map. Server data is already
// filtered, but the app must not depend on that.
const distinctCount = (coords: { latitude: number; longitude: number }[]) =>
  new Set(coords.map((c) => `${c.latitude},${c.longitude}`)).size;
const isDrawableLine = (coords: { latitude: number; longitude: number }[]) => distinctCount(coords) >= 2;
// The iOS map library copies a polygon's coordinates onto the main thread's 1 MB stack when it
// builds the native overlay (16 bytes a point); a 102,662-point ring crashed build 39. The server
// now caps rings at 8,000 points; this is the belt to that suspender.
const MAX_POLYGON_POINTS = 20000;
const isDrawablePolygon = (coords: { latitude: number; longitude: number }[]) =>
  coords.length <= MAX_POLYGON_POINTS && distinctCount(coords) >= 3;

// Detail tier for the selected waterway's trace, from the visible span (degrees). The first
// three match the home-map overview; detail and fine are requested with the padded viewport.
const getGeometryTier = (region: Region): GeometryTier => {
  const maxDelta = Math.max(region.latitudeDelta, region.longitudeDelta);
  if (maxDelta >= 12) return 'nation';
  if (maxDelta >= 4) return 'region';
  if (maxDelta >= 1) return 'local';
  if (maxDelta >= 0.25) return 'detail';
  return 'fine';
};

// Visible region padded by about a third on each side and snapped outward to a 0.05° grid, so
// small pans reuse the same request and the server cache: "minLng,minLat,maxLng,maxLat".
const paddedBBoxParam = (region: Region): string => {
  const halfLat = region.latitudeDelta * 0.675;
  const halfLng = region.longitudeDelta * 0.675;
  const snapDown = (v: number) => Math.floor(v / 0.05) * 0.05;
  const snapUp = (v: number) => Math.ceil(v / 0.05) * 0.05;
  return [
    snapDown(region.longitude - halfLng),
    snapDown(region.latitude - halfLat),
    snapUp(region.longitude + halfLng),
    snapUp(region.latitude + halfLat),
  ]
    .map((v) => v.toFixed(2))
    .join(',');
};

// How far (in screen pixels) a tap may land from a river and still select it. The map
// library's own polyline hit test allows only 10 px regardless of zoom or stroke width,
// which makes thin rivers nearly impossible to tap when zoomed out, so taps that reach
// the map are re-tested here against the drawn overview geometry.
const OVERVIEW_TAP_TOLERANCE_PX = 24;

const distanceToSegmentPx = (
  px: number, py: number,
  ax: number, ay: number,
  bx: number, by: number,
): number => {
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

// Ray casting in lng/lat; good enough for lake and bay outlines at map scale
const ringContains = (lng: number, lat: number, ring: [number, number][]): boolean => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

/** The id of the overview waterway nearest to a tap, or null if none is within tolerance. */
const findOverviewRecordAtTap = (
  tap: { latitude: number; longitude: number },
  region: Region,
  mapSize: { width: number; height: number },
  records: WaterwayOverviewRecord[],
  tier: OverviewTierName,
): string | null => {
  if (mapSize.width === 0 || mapSize.height === 0) return null;
  const lngPerPx = region.longitudeDelta / mapSize.width;
  const latPerPx = region.latitudeDelta / mapSize.height;
  const tolLng = OVERVIEW_TAP_TOLERANCE_PX * lngPerPx;
  const tolLat = OVERVIEW_TAP_TOLERANCE_PX * latPerPx;

  let bestId: string | null = null;
  let bestDistance = OVERVIEW_TAP_TOLERANCE_PX;

  for (const record of records) {
    if (record.bbox) {
      const [minLng, minLat, maxLng, maxLat] = record.bbox;
      if (
        tap.longitude < minLng - tolLng || tap.longitude > maxLng + tolLng ||
        tap.latitude < minLat - tolLat || tap.latitude > maxLat + tolLat
      ) {
        continue;
      }
    }
    const paths = record.tiers[tier]?.paths;
    if (!paths?.length) continue;

    for (const path of paths) {
      if (record.geometryKind === 'area' && ringContains(tap.longitude, tap.latitude, path)) {
        return record.id;
      }
      for (let i = 0; i < path.length - 1; i += 1) {
        const d = distanceToSegmentPx(
          tap.longitude / lngPerPx, tap.latitude / latPerPx,
          path[i][0] / lngPerPx, path[i][1] / latPerPx,
          path[i + 1][0] / lngPerPx, path[i + 1][1] / latPerPx,
        );
        if (d < bestDistance) {
          bestDistance = d;
          bestId = record.id;
        }
      }
    }
  }
  return bestId;
};

export default function MapScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // State declarations first
  const [selectedMarker, setSelectedMarker] = useState<{
    id: string;
    type: MarkerType;
  } | null>(null);

  // The preview card docked at the bottom of the map. Set by a pin tap (fromOverview false) or
  // by tapping a river on the overview layer (fromOverview true). Either fetches the boundary
  // and zooms to it; an overview preview keeps the overview rivers on screen instead of
  // swapping them for the full set of pins.
  const [preview, setPreview] = useState<{
    id: string;
    type: MarkerType;
    fromOverview: boolean;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>(CANADA_CENTER);

  const [legendVisible, setLegendVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Expanded filter state
  const [filterType, setFilterType] = useState<FilterType>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);

  // Collapsible section states
  const [legendExpanded, setLegendExpanded] = useState(true);
  const [waterwayExpanded, setWaterwayExpanded] = useState(false);
  const [explorerExpanded, setExplorerExpanded] = useState(false);
  const [eraExpanded, setEraExpanded] = useState(false);

  // Selected explorer ID for fetching detail
  const [selectedExplorerId, setSelectedExplorerId] = useState<string | null>(null);

  // Data fetching hooks (after state declarations)
  const { data: waterways, isLoading: waterwaysLoading, isError: waterwaysError } = useWaterways();
  const { data: riverOverviewData, isLoading: riverOverviewLoading } = useRiverOverview();
  const { data: locations, isLoading: locationsLoading, isError: locationsError } = useLocations();
  const { data: explorers, isLoading: explorersLoading } = useExplorers();
  const { data: explorerDetail } = useExplorerDetail(selectedExplorerId);

  // Expedition route layer (roadmap item 2, 2026-10-19): one dated journey drawn over the map as
  // its legs' waterway geometry, numbered leg markers and a leg strip. Chosen from the filter
  // menu's Expeditions section or opened from an explorer's "Show on map" (`/?expeditionId=`).
  const [expeditionId, setExpeditionId] = useState<string | null>(null);
  const [expeditionsExpanded, setExpeditionsExpanded] = useState(false);
  const { data: expeditions } = useExpeditions();
  const { data: expedition } = useExpedition(expeditionId);

  // Connection highlights (roadmap item 1, 2026-10-19): a set of waters drawn over the map with a
  // strip of chips. Either a river system (`/?systemId=`, from Follow the Water) or the waters
  // explorers were on in one decade (`/?decade=`, from the decade view).
  const [systemId, setSystemId] = useState<string | null>(null);
  const [decade, setDecade] = useState<number | null>(null);
  const { data: system } = useWaterwaySystem(systemId);
  const { data: decadeData } = useDecade(decade);

  // Historic map overlay (roadmap item 15): a georeferenced map image laid over the live map at
  // its bounds, opened from a map's page (`/?mapOverlayId=`), with an opacity control.
  const [mapOverlayId, setMapOverlayId] = useState<string | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.7);
  const { data: overlayMap } = useHistoricalMap(mapOverlayId);

  // Fetch the boundary for a waterway previewed from a pin or opened in the bottom sheet
  const detailWaterwayId =
    preview?.type === 'waterway'
      ? preview.id
      : selectedMarker?.type === 'waterway'
        ? selectedMarker.id
        : null;

  const bottomSheetRef = useRef<DetailBottomSheetRef>(null);
  const mapRef = useRef<MapView>(null);
  // Counts renders of this screen; see the testID on the MapView below for why.
  const mapRenderVersionRef = useRef(0);
  // Marker refs so a dismissed pin can be deselected natively; otherwise MapKit does not fire
  // onSelect again the next time the same pin is tapped
  const markerRefs = useRef<Record<string, any>>({});
  // Ignore the map press MapKit reports right after an overlay (river line) press
  const lastOverlayPressAtRef = useRef(0);
  // Map size in pixels, for converting the tap tolerance into degrees
  const mapSizeRef = useRef({ width: 0, height: 0 });

  const isLoading = waterwaysLoading || locationsLoading;
  const isError = waterwaysError || locationsError;

  // Close the preview card and deselect its pin
  const closePreview = useCallback(() => {
    if (preview && !preview.fromOverview) {
      markerRefs.current[`${preview.type}-${preview.id}`]?.hideCallout?.();
    }
    setPreview(null);
  }, [preview]);

  const toggleLegend = useCallback(() => {
    setLegendVisible(prev => !prev);
  }, []);

  // Legacy legend filter handler (for map legend items)
  const handleLegendFilterPress = useCallback((legendType: string) => {
    closePreview();

    if (activeFilter === legendType) {
      // Clear filter if same item tapped
      setActiveFilter(null);
      setFilterType(null);
      setFilterValue(null);
    } else {
      setActiveFilter(legendType);
      setFilterType('legend');
      setFilterValue(legendType);
    }
  }, [activeFilter, closePreview]);

  // Handler for waterway filter selection
  const handleWaterwayFilterSelect = useCallback((waterwayId: string) => {
    closePreview();

    setFilterType('waterway');
    setFilterValue(waterwayId);
    setActiveFilter(null);
    setSelectedExplorerId(null);
  }, [closePreview]);

  // Handler for explorer filter selection
  const handleExplorerFilterSelect = useCallback((explorerId: string) => {
    closePreview();

    setFilterType('explorer');
    setFilterValue(explorerId);
    setSelectedExplorerId(explorerId);
    setActiveFilter(null);
  }, [closePreview]);

  // Handler for time period filter selection
  const handlePeriodFilterSelect = useCallback((periodId: string) => {
    closePreview();

    setFilterType('period');
    setFilterValue(periodId);
    setActiveFilter(null);
    setSelectedExplorerId(null);
  }, [closePreview]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    closePreview();

    setActiveFilter(null);
    setFilterType(null);
    setFilterValue(null);
    setSelectedExplorerId(null);
  }, [closePreview]);

  // Check if any filter is active
  const hasActiveFilter = filterType !== null || activeFilter !== null;
  const hasRiverOverviewData = !!riverOverviewData?.waterways?.length;
  // Overview mode: no filter, and either nothing is previewed/open or the preview came from
  // the overview layer itself (then the rivers stay and the pins stay hidden, sheet or not)
  const shouldPreferRiverOverviewMode =
    !hasActiveFilter && (preview ? preview.fromOverview : !selectedMarker);
  const shouldShowRiverOverview = shouldPreferRiverOverviewMode && hasRiverOverviewData;
  const shouldSuppressMarkersForOverview = shouldPreferRiverOverviewMode && (riverOverviewLoading || hasRiverOverviewData);
  const shouldRenderMarkers = !shouldSuppressMarkersForOverview;
  const riverOverviewTier = useMemo(() => getOverviewTier(mapRegion), [mapRegion]);
  const riverOverviewStrokeWidth = OVERVIEW_STROKE_WIDTH[riverOverviewTier];

  // Every overview record stays mounted while the overview is shown. Culling by viewport
  // added and removed native overlays on every pan, and adding/removing MapView children
  // while the map is moving crashed the iOS map library (build 54 crash log:
  // "-[__NSArrayM insertObject:atIndex:]: object cannot be nil" during mounting). MapKit
  // culls off-screen overlays itself; the whole set is ~420 small paths.
  const visibleRiverOverviewRecords = useMemo(() => {
    if (!shouldShowRiverOverview || !riverOverviewData?.waterways) return [];
    return riverOverviewData.waterways;
  }, [shouldShowRiverOverview, riverOverviewData]);

  // Get explorer's waterway IDs for filtering
  const explorerWaterwayIds = useMemo(() => {
    if (!explorerDetail?.waterways) return new Set<string>();
    return new Set(explorerDetail.waterways.map(ew => ew.waterway.id));
  }, [explorerDetail]);

  // Everything the docked preview card shows, resolved from the full lists when available
  // and from the overview dataset otherwise
  const previewInfo = useMemo(() => {
    if (!preview) return null;
    if (preview.type === 'location') {
      const location = locations?.find((l) => l.id === preview.id);
      if (!location) return null;
      return {
        typeName: location.locationType || 'Settlement',
        name: location.name,
        indigenousName: location.indigenousName,
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }
    const waterway = waterways?.find((w) => w.id === preview.id);
    const record = riverOverviewData?.waterways?.find((r) => r.id === preview.id);
    if (!waterway && !record) return null;
    return {
      typeName: waterway?.type?.name || record?.typeName || 'River',
      name: waterway?.name || record?.name || '',
      indigenousName: waterway?.indigenousName || record?.indigenousName || null,
      latitude: waterway?.latitude ?? record!.labelPoint.lat,
      longitude: waterway?.longitude ?? record!.labelPoint.lng,
    };
  }, [preview, waterways, locations, riverOverviewData]);

  // Get time period for filtering
  const selectedPeriod = useMemo(() => {
    if (filterType !== 'period' || !filterValue) return null;
    return TIME_PERIODS.find(p => p.id === filterValue) || null;
  }, [filterType, filterValue]);

  // Derive which waterway IDs contain locations established within the selected era.
  // Locations with no yearEstablished are treated as timeless and included in all eras.
  const eraWaterwayIds = useMemo(() => {
    if (filterType !== 'period' || !selectedPeriod || !locations) return null;
    const { minYear, maxYear } = selectedPeriod;
    const relevantLocations = locations.filter(l => {
      if (l.yearEstablished === null) return true;
      if (minYear !== null && l.yearEstablished < minYear) return false;
      if (maxYear !== null && l.yearEstablished > maxYear) return false;
      return true;
    });
    return new Set(
      relevantLocations
        .map(l => l.waterway?.id)
        .filter((id): id is string => !!id)
    );
  }, [filterType, selectedPeriod, locations]);

  // Filter waterways based on active filter
  const filteredWaterways = useMemo(() => {
    if (!waterways) return [];

    // No filter active - show all
    if (!filterType && !activeFilter) return waterways;

    // Legacy legend filter (waterway types)
    if (filterType === 'legend' || activeFilter) {
      const filter = activeFilter || filterValue;
      if (['River', 'Lake', 'Bay'].includes(filter || '')) {
        return waterways.filter(w => w.type?.name === filter);
      }
      // If filtering by location type, don't show waterways
      if (['Fort', 'Trading Post', 'Portage'].includes(filter || '')) {
        return [];
      }
    }

    // Filter by specific waterway - show only that waterway
    if (filterType === 'waterway' && filterValue) {
      return waterways.filter(w => w.id === filterValue);
    }

    // Filter by explorer - show waterways they explored
    if (filterType === 'explorer') {
      // While explorerDetail is loading, show nothing rather than all markers
      if (explorerWaterwayIds.size === 0) return [];
      return waterways.filter(w => explorerWaterwayIds.has(w.id));
    }

    // Filter by time period - show only waterways that have era-relevant locations
    if (filterType === 'period') {
      if (eraWaterwayIds === null) return waterways;
      return waterways.filter(w => eraWaterwayIds.has(w.id));
    }

    return waterways;
  }, [waterways, activeFilter, filterType, filterValue, explorerWaterwayIds, eraWaterwayIds]);

  // Filter locations based on active filter
  const filteredLocations = useMemo(() => {
    if (!locations) return [];

    // No filter active - show all
    if (!filterType && !activeFilter) return locations;

    // Legacy legend filter (location types)
    if (filterType === 'legend' || activeFilter) {
      const filter = activeFilter || filterValue;
      if (['Fort', 'Trading Post', 'Portage'].includes(filter || '')) {
        return locations.filter(l => l.locationType === filter);
      }
      // If filtering by waterway type, don't show locations
      if (['River', 'Lake', 'Bay'].includes(filter || '')) {
        return [];
      }
    }

    // Filter by specific waterway - show locations on that waterway
    if (filterType === 'waterway' && filterValue) {
      return locations.filter(l => l.waterway?.id === filterValue);
    }

    // Filter by explorer - show locations along their waterways
    if (filterType === 'explorer') {
      // While explorerDetail is loading, show nothing rather than all markers
      if (explorerWaterwayIds.size === 0) return [];
      return locations.filter(l => l.waterway && explorerWaterwayIds.has(l.waterway.id));
    }

    // Filter by time period - filter locations by yearEstablished
    if (filterType === 'period' && selectedPeriod) {
      const { minYear, maxYear } = selectedPeriod;
      return locations.filter(l => {
        if (l.yearEstablished === null) return true;
        if (minYear !== null && l.yearEstablished < minYear) return false;
        if (maxYear !== null && l.yearEstablished > maxYear) return false;
        return true;
      });
    }

    return locations;
  }, [locations, activeFilter, filterType, filterValue, explorerWaterwayIds, selectedPeriod]);

  // Find waterway for boundary highlighting (from either a visible callout or a direct overview selection)
  const selectedWaterway = useMemo(() => {
    if (!detailWaterwayId) return null;
    return waterways?.find(w => w.id === detailWaterwayId) || null;
  }, [detailWaterwayId, waterways]);

  // Simplified boundary/route from the server (never raw KML). Two requests:
  //  - the coarse, unclipped "nation" trace: the waterway's full extent, used to zoom to it
  //    and as the fallback drawing while a finer tier loads;
  //  - the tier the current zoom calls for, clipped to the padded viewport at the two finest
  //    tiers, so detail grows as the user zooms in while the download stays small.
  const geometryTier = useMemo(() => getGeometryTier(mapRegion), [mapRegion]);
  const geometryBBox = useMemo(
    () => (geometryTier === 'detail' || geometryTier === 'fine' ? paddedBBoxParam(mapRegion) : null),
    [geometryTier, mapRegion]
  );
  const { data: extentGeometry } = useWaterwayGeometry(detailWaterwayId, 'nation');
  const { data: tierGeometry } = useWaterwayGeometry(detailWaterwayId, geometryTier, geometryBBox);
  const selectedWaterwayGeometry = tierGeometry ?? extentGeometry ?? null;
  const selectedWaterwayPaths = useMemo(
    () =>
      selectedWaterwayGeometry?.paths.map((path) =>
        path.map(([latitude, longitude]) => ({ latitude, longitude }))
      ) ?? null,
    [selectedWaterwayGeometry]
  );
  const extentPaths = useMemo(
    () =>
      extentGeometry?.paths.map((path) => path.map(([latitude, longitude]) => ({ latitude, longitude }))) ?? null,
    [extentGeometry]
  );

  // Zoom to the selected waterway's full extent when known, otherwise to its pin
  const animateToSelectedWaterway = useCallback(() => {
    if (!selectedWaterway || !mapRef.current) return;
    if (extentPaths && extentPaths.length > 0) {
      const region = getRegionForCoordinates(extentPaths.flat());
      if (region) {
        mapRef.current.animateToRegion(region, 500);
        return;
      }
    }
    mapRef.current.animateToRegion({
      latitude: selectedWaterway.latitude,
      longitude: selectedWaterway.longitude,
      latitudeDelta: 2,
      longitudeDelta: 2,
    }, 500);
  }, [selectedWaterway, extentPaths]);

  // Animate once per selection: to the pin as soon as a waterway is chosen, then to its full
  // extent when that arrives. Later geometry updates (finer tiers as the user zooms) must not
  // move the map, or they would fight the user's own zooming.
  const animatedExtentForRef = useRef<string | null>(null);
  useEffect(() => {
    if (detailWaterwayId && selectedWaterway) {
      const extentReady = !!(extentPaths && extentPaths.length > 0);
      const stamp = `${detailWaterwayId}:${extentReady ? 'extent' : 'pin'}`;
      if (animatedExtentForRef.current === stamp || animatedExtentForRef.current === `${detailWaterwayId}:extent`) return;
      animatedExtentForRef.current = stamp;
      animateToSelectedWaterway();
      return;
    }
    animatedExtentForRef.current = null;

    if (preview?.type === 'location') {
      const location = locations?.find(l => l.id === preview.id);
      if (location && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }, 500);
      }
    }
  }, [detailWaterwayId, selectedWaterway, animateToSelectedWaterway, preview, locations]);

  const handleRegionChangeComplete = useCallback((region: Region) => {
    setMapRegion(region);
  }, []);

  // Open the bottom sheet only after it has mounted
  useEffect(() => {
    if (!selectedMarker) return;

    const frame = requestAnimationFrame(() => {
      bottomSheetRef.current?.expand();
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedMarker]);

  // Pin tapped: show the preview card (and, through detailWaterwayId, the waterway boundary)
  const handleMarkerSelect = useCallback((id: string, type: MarkerType) => {
    setPreview({ id, type, fromOverview: false });
  }, []);

  // Opened from another screen (decision 11, 2026-10-16): `/?markerId=&markerType=` selects
  // that waterway or location and opens its detail sheet; `/?lat=&lng=` (What Happened Here)
  // centres the map on an event. Each distinct param set is handled once.
  const params = useLocalSearchParams<{ markerId?: string; markerType?: string; lat?: string; lng?: string; expeditionId?: string; mapOverlayId?: string; systemId?: string; decade?: string }>();
  const handledParamsRef = useRef<string | null>(null);
  useEffect(() => {
    const { markerId, markerType, lat, lng, expeditionId: paramExpeditionId, mapOverlayId: paramOverlayId, systemId: paramSystemId, decade: paramDecade } = params;
    const key = `${markerId ?? ''}|${markerType ?? ''}|${lat ?? ''}|${lng ?? ''}|${paramExpeditionId ?? ''}|${paramOverlayId ?? ''}|${paramSystemId ?? ''}|${paramDecade ?? ''}`;
    if (key === '|||||||' || handledParamsRef.current === key) return;

    // One drawn layer at a time (expedition, system or decade highlight, historic overlay):
    // the newcomer replaces the others, so the map never stacks three sets of overlays.
    if (paramSystemId || paramDecade) {
      handledParamsRef.current = key;
      closePreview();
      setSelectedMarker(null);
      setExpeditionId(null);
      setMapOverlayId(null);
      setSystemId(paramSystemId ?? null);
      setDecade(paramDecade && Number.isFinite(Number(paramDecade)) ? Number(paramDecade) : null);
      return;
    }

    if (paramOverlayId) {
      handledParamsRef.current = key;
      closePreview();
      setSelectedMarker(null);
      setExpeditionId(null);
      setSystemId(null);
      setDecade(null);
      setMapOverlayId(paramOverlayId);
      return;
    }

    if (paramExpeditionId) {
      handledParamsRef.current = key;
      closePreview();
      setSelectedMarker(null);
      setSystemId(null);
      setDecade(null);
      setMapOverlayId(null);
      setExpeditionId(paramExpeditionId);
      return;
    }

    if (markerId && (markerType === 'waterway' || markerType === 'location')) {
      const known =
        markerType === 'waterway' ? waterways?.some((w) => w.id === markerId) : locations?.some((l) => l.id === markerId);
      if (!known) return; // wait for the list to load; a missing id is ignored once loaded below
      handledParamsRef.current = key;
      setPreview({ id: markerId, type: markerType, fromOverview: false });
      setSelectedMarker({ id: markerId, type: markerType });
      return;
    }

    const latitude = lat ? Number(lat) : NaN;
    const longitude = lng ? Number(lng) : NaN;
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      handledParamsRef.current = key;
      mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.5, longitudeDelta: 0.5 }, 500);
    }
  }, [params, waterways, locations, closePreview]);

  // The expedition's drawable pieces: each leg's waterway paths from the overview dataset (the
  // same simplified geometry the home map draws), the leg's anchor (its historic place, else
  // the waterway's centre), and dashed connectors between consecutive anchors so the order
  // reads even where two legs share no water.
  const expeditionColor = expedition?.color ?? '#B45309';
  const expeditionDrawing = useMemo(() => {
    if (!expedition) return null;
    const records = new Map((riverOverviewData?.waterways ?? []).map((r) => [r.id, r]));
    const legPaths: { key: string; coordinates: { latitude: number; longitude: number }[]; isArea: boolean }[] = [];
    const anchors: { leg: ExpeditionLeg; latitude: number; longitude: number }[] = [];
    expedition.legs.forEach((leg) => {
      const record = records.get(leg.waterway.id);
      const tier = record?.tiers[riverOverviewTier];
      tier?.paths?.forEach((path, index) => {
        const coordinates = overviewPathToCoordinates(path);
        const isArea = record!.geometryKind === 'area';
        if (isArea ? isDrawablePolygon(coordinates) : isDrawableLine(coordinates)) {
          legPaths.push({ key: `exp-${leg.id}-${index}`, coordinates, isArea });
        }
      });
      const point = leg.location ?? leg.waterway;
      anchors.push({ leg, latitude: point.latitude, longitude: point.longitude });
    });
    // Legs that start from the same place (Hearne leaves Prince of Wales Fort as leg 1 and
    // returns to it as leg 5) share one badge reading "1 · 5": two markers on one point hid
    // each other, so the start or the finish went missing depending on which drew last.
    const badges: { key: string; legs: ExpeditionLeg[]; latitude: number; longitude: number }[] = [];
    anchors.forEach((a) => {
      const existing = badges.find((b) => Math.abs(b.latitude - a.latitude) < 0.0005 && Math.abs(b.longitude - a.longitude) < 0.0005);
      if (existing) existing.legs.push(a.leg);
      else badges.push({ key: `exp-badge-${a.leg.id}`, legs: [a.leg], latitude: a.latitude, longitude: a.longitude });
    });
    return { legPaths, anchors, badges };
  }, [expedition, riverOverviewData, riverOverviewTier]);

  // Fit the camera to the whole route once per expedition
  const fittedExpeditionRef = useRef<string | null>(null);
  useEffect(() => {
    if (!expedition || !expeditionDrawing || !mapRef.current) return;
    if (fittedExpeditionRef.current === expedition.id) return;
    fittedExpeditionRef.current = expedition.id;
    const points = [
      ...expeditionDrawing.anchors.map((a) => ({ latitude: a.latitude, longitude: a.longitude })),
      ...expeditionDrawing.legPaths.flatMap((p) => p.coordinates),
    ];
    const region = getRegionForCoordinates(points);
    if (region) mapRef.current.animateToRegion(region, 700);
  }, [expedition, expeditionDrawing]);

  // Fit the camera to the overlay's bounds once per map
  const fittedOverlayRef = useRef<string | null>(null);
  useEffect(() => {
    if (!overlayMap?.bounds || !mapRef.current) return;
    if (fittedOverlayRef.current === overlayMap.id) return;
    fittedOverlayRef.current = overlayMap.id;
    const { southWest, northEast } = overlayMap.bounds;
    mapRef.current.animateToRegion({
      latitude: (southWest.latitude + northEast.latitude) / 2,
      longitude: (southWest.longitude + northEast.longitude) / 2,
      latitudeDelta: Math.abs(northEast.latitude - southWest.latitude) * 1.15,
      longitudeDelta: Math.abs(northEast.longitude - southWest.longitude) * 1.15,
    }, 700);
  }, [overlayMap]);

  const closeOverlay = useCallback(() => {
    setMapOverlayId(null);
    fittedOverlayRef.current = null;
  }, []);

  const handleExpeditionSelect = useCallback((id: string) => {
    closePreview();
    setSelectedMarker(null);
    setLegendVisible(false);
    setSystemId(null);
    setDecade(null);
    setMapOverlayId(null);
    setExpeditionId((current) => (current === id ? null : id));
  }, [closePreview]);

  // The highlighted set of waters: a river system or a decade's visited waters, in one shape
  const highlight = useMemo(() => {
    if (systemId && system) {
      const items = [
        { ...system.waterway, meta: 'this water', isHere: true },
        ...system.downstream.map((s) => ({ ...s, meta: 'downstream', isHere: false })),
        ...system.upstream.map((s) => ({ ...s, meta: s.depth === 1 ? 'tributary' : 'upstream', isHere: false })),
        ...system.partOf.map((s) => ({ ...s, meta: 'part of', isHere: false })),
        ...system.parts.map((s) => ({ ...s, meta: 'arm', isHere: false })),
        ...system.joins.map((s) => ({ ...s, meta: 'joined', isHere: false })),
      ];
      return {
        key: `system:${system.waterway.id}`,
        kind: 'system' as const,
        title: `${system.waterway.name} system`,
        subtitle: `${items.length} connected ${items.length === 1 ? 'water' : 'waters'} · tap a chip to go there`,
        color: '#0E7490',
        items,
        detailsLabel: null as string | null,
        onDetails: null as (() => void) | null,
      };
    }
    if (decade !== null && decadeData) {
      const byWater = new Map<string, { id: string; name: string; latitude: number; longitude: number; explorers: string[] }>();
      decadeData.explorers.forEach((g) =>
        g.visits.forEach((v) => {
          const row = byWater.get(v.waterway.id) ?? { ...v.waterway, explorers: [] };
          if (!row.explorers.includes(g.explorer.name)) row.explorers.push(g.explorer.name);
          byWater.set(v.waterway.id, row);
        })
      );
      const items = [...byWater.values()].map((w) => ({ id: w.id, name: w.name, latitude: w.latitude, longitude: w.longitude, meta: w.explorers.join(', '), isHere: false }));
      return {
        key: `decade:${decade}`,
        kind: 'decade' as const,
        title: `The ${decade}s`,
        subtitle: `${decadeData.explorers.length} ${decadeData.explorers.length === 1 ? 'explorer' : 'explorers'} on ${items.length} ${items.length === 1 ? 'water' : 'waters'}`,
        color: '#6D28D9',
        items,
        detailsLabel: 'Who was here',
        onDetails: () => router.push(`/decades/${decade}`),
      };
    }
    return null;
  }, [systemId, system, decade, decadeData, router]);

  // Each highlighted water's overview geometry; waters without geometry get a dot at their centre
  const highlightDrawing = useMemo(() => {
    if (!highlight) return null;
    const records = new Map((riverOverviewData?.waterways ?? []).map((r) => [r.id, r]));
    const paths: { key: string; coordinates: { latitude: number; longitude: number }[]; isArea: boolean; isHere: boolean }[] = [];
    const dots: { id: string; name: string; latitude: number; longitude: number }[] = [];
    highlight.items.forEach((item) => {
      const record = records.get(item.id);
      const tier = record?.tiers[riverOverviewTier];
      let drawn = 0;
      tier?.paths?.forEach((path, index) => {
        const coordinates = overviewPathToCoordinates(path);
        const isArea = record!.geometryKind === 'area';
        if (isArea ? isDrawablePolygon(coordinates) : isDrawableLine(coordinates)) {
          paths.push({ key: `hl-${item.id}-${index}`, coordinates, isArea, isHere: item.isHere });
          drawn++;
        }
      });
      if (drawn === 0) dots.push({ id: item.id, name: item.name, latitude: item.latitude, longitude: item.longitude });
    });
    return { paths, dots };
  }, [highlight, riverOverviewData, riverOverviewTier]);

  // Fit the camera to the highlighted set once per set
  const fittedHighlightRef = useRef<string | null>(null);
  useEffect(() => {
    if (!highlight || !highlightDrawing || !mapRef.current) return;
    if (fittedHighlightRef.current === highlight.key) return;
    fittedHighlightRef.current = highlight.key;
    const points = [
      ...highlight.items.map((i) => ({ latitude: i.latitude, longitude: i.longitude })),
      ...highlightDrawing.paths.flatMap((p) => p.coordinates),
    ];
    const region = getRegionForCoordinates(points);
    if (region) mapRef.current.animateToRegion(region, 700);
  }, [highlight, highlightDrawing]);

  const closeHighlight = useCallback(() => {
    setSystemId(null);
    setDecade(null);
    fittedHighlightRef.current = null;
  }, []);

  // A highlight chip or dot: move to that water and preview it like a pin tap (one camera move,
  // see handleLegPress)
  const handleHighlightPress = useCallback((item: { id: string; latitude: number; longitude: number }) => {
    animatedExtentForRef.current = `${item.id}:extent`;
    mapRef.current?.animateToRegion({ latitude: item.latitude, longitude: item.longitude, latitudeDelta: 1.5, longitudeDelta: 1.5 }, 500);
    setSelectedMarker(null);
    setPreview({ id: item.id, type: 'waterway', fromOverview: true });
  }, []);

  const closeExpedition = useCallback(() => {
    setExpeditionId(null);
    fittedExpeditionRef.current = null;
  }, []);

  // A leg chip or leg marker: move to that water and preview it like a pin tap. The camera goes
  // to the leg's point only: previewing the water would otherwise also fire the zoom-to-extent
  // animation, so a tap on one Mackenzie leg flew in to it and straight back out to the whole
  // river. Marking the extent as already animated keeps the camera where the leg is.
  // A leg that stands at a historic place (Bloody Falls, Prince of Wales Fort) previews that
  // place, not its river, so the card matches the chip the user tapped.
  const handleLegPress = useCallback((leg: ExpeditionLeg) => {
    setSelectedMarker(null);
    if (leg.location && locations?.some((l) => l.id === leg.location!.id)) {
      // The location preview effect moves the camera to the place itself
      setPreview({ id: leg.location.id, type: 'location', fromOverview: true });
      return;
    }
    const point = leg.location ?? leg.waterway;
    animatedExtentForRef.current = `${leg.waterway.id}:extent`;
    mapRef.current?.animateToRegion({ latitude: point.latitude, longitude: point.longitude, latitudeDelta: 1.5, longitudeDelta: 1.5 }, 500);
    setPreview({ id: leg.waterway.id, type: 'waterway', fromOverview: true });
  }, [locations]);

  // Expeditions grouped by explorer for the filter menu, explorers in order of first journey
  const expeditionGroups = useMemo(() => {
    const groups = new Map<string, { explorerName: string; items: ExpeditionSummary[] }>();
    (expeditions ?? []).forEach((e) => {
      const group = groups.get(e.explorer.id) ?? { explorerName: e.explorer.name, items: [] };
      group.items.push(e);
      groups.set(e.explorer.id, group);
    });
    return [...groups.values()];
  }, [expeditions]);

  // "Tap for details" on the preview card: open the bottom sheet
  const handlePreviewDetailsPress = useCallback(() => {
    if (!preview) return;
    setSelectedMarker({ id: preview.id, type: preview.type });
  }, [preview]);

  // River tapped on the overview layer (any zoom): preview it exactly like a pin tap
  const handleRiverOverviewPress = useCallback((waterwayId: string) => {
    lastOverlayPressAtRef.current = Date.now();
    setSelectedMarker(null);
    setPreview({ id: waterwayId, type: 'waterway', fromOverview: true });
  }, []);

  // The selected waterway's outline tapped: zoom back to it (the card is already showing it)
  const handleSelectedOutlinePress = useCallback(() => {
    lastOverlayPressAtRef.current = Date.now();
    animateToSelectedWaterway();
  }, [animateToSelectedWaterway]);

  // Called when bottom sheet is closed - only closes sheet, leaves preview and boundary visible
  const handleBottomSheetClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  // Close everything: preview card, boundary and bottom sheet
  const handleDismissAll = useCallback(() => {
    closePreview();
    setSelectedMarker(null);
    bottomSheetRef.current?.close();
  }, [closePreview]);

  const handleMapLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    mapSizeRef.current = { width, height };
  }, []);

  const handleMapPress = useCallback((event: MapPressEvent) => {
    if (Date.now() - lastOverlayPressAtRef.current < 300) {
      return;
    }
    // The native hit test missed (or was beyond its 10 px limit): try our own, wider one
    if (shouldShowRiverOverview) {
      const hitId = findOverviewRecordAtTap(
        event.nativeEvent.coordinate,
        mapRegion,
        mapSizeRef.current,
        visibleRiverOverviewRecords,
        riverOverviewTier,
      );
      if (hitId) {
        handleRiverOverviewPress(hitId);
        return;
      }
    }
    handleDismissAll();
    setLegendVisible(false);
  }, [
    shouldShowRiverOverview,
    mapRegion,
    visibleRiverOverviewRecords,
    riverOverviewTier,
    handleRiverOverviewPress,
    handleDismissAll,
  ]);

  // Pins carry no Callout child and no title, so MapKit draws no native callout; the docked
  // preview card below the map takes its place.
  const renderWaterwayMarker = (waterway: Waterway) => {
    const typeName = waterway.type?.name || 'River';
    const markerKey = `waterway-${waterway.id}`;
    const isSelected = preview?.type === 'waterway' && preview.id === waterway.id;
    return (
      <Marker
        key={markerKey}
        ref={(ref) => {
          if (ref) markerRefs.current[markerKey] = ref;
        }}
        coordinate={{
          latitude: waterway.latitude,
          longitude: waterway.longitude,
        }}
        pinColor={isSelected ? SELECTED_PIN_COLOR : getMarkerColor(typeName)}
        zIndex={isSelected ? 10 : 0}
        tracksViewChanges={false}
        onSelect={() => handleMarkerSelect(waterway.id, 'waterway')}
      />
    );
  };

  const renderLocationMarker = (location: Location) => {
    const locationType = location.locationType || 'Settlement';
    const markerKey = `location-${location.id}`;
    const isSelected = preview?.type === 'location' && preview.id === location.id;
    return (
      <Marker
        key={markerKey}
        ref={(ref) => {
          if (ref) markerRefs.current[markerKey] = ref;
        }}
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        pinColor={isSelected ? SELECTED_PIN_COLOR : getMarkerColor(locationType)}
        zIndex={isSelected ? 10 : 0}
        tracksViewChanges={false}
        onSelect={() => handleMarkerSelect(location.id, 'location')}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2D5A3D" />
        <Text style={styles.loadingText}>{t('loadingWaterways')}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>{t('unableToLoadMap')}</Text>
        <Text style={styles.errorText}>
          {t('checkConnection')}
        </Text>
      </View>
    );
  }

  // Build 54 and build 60 crashed with "-[__NSArrayM insertObject:atIndex:]: object cannot be
  // nil" from the iOS map library. The new-architecture interop layer mounts a MapView child
  // immediately only when it lands at the END of the children; a child inserted anywhere else
  // is held back until the MapView itself next receives a prop update, and within a React
  // commit that update is applied BEFORE any child removals. If the held-back child is removed
  // and recycled before the MapView updates, the flush inserts nil and the app aborts. That
  // happened when a lake or bay leg was previewed and the map zoomed: its trace's polylines grew
  // from none to hundreds in front of its polygon (held back), then shrank on the next zoom.
  // A prop that changes on every render makes the MapView flush held-back children at the start
  // of the very next commit, before anything can be removed, so no insert can ever go stale.
  mapRenderVersionRef.current += 1;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        testID={`waterways-map-${mapRenderVersionRef.current}`}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={CANADA_CENTER}
        showsUserLocation={false}
        showsCompass={true}
        showsScale={true}
        mapType="terrain"
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={handleMapPress}
        onLayout={handleMapLayout}
      >
        {/* River overview layer for the initial home map */}
        {shouldShowRiverOverview
          ? visibleRiverOverviewRecords.map((record: WaterwayOverviewRecord) => {
              const tierData = record.tiers[riverOverviewTier];
              const strokeColor = getMarkerColor(record.typeName || 'River');

              if (!tierData?.paths?.length) return null;

              return tierData.paths.map((path, index) => {
                const coordinates = overviewPathToCoordinates(path);

                // Keys carry no tier: a zoom level change updates each overlay's coordinates in
                // place instead of unmounting and remounting hundreds of native overlays.
                if (record.geometryKind === 'area') {
                  if (!isDrawablePolygon(coordinates)) return null;
                  return (
                    <Polygon
                      key={`overview-area-${record.id}-${index}`}
                      coordinates={coordinates}
                      strokeColor={strokeColor}
                      fillColor={`${strokeColor}20`}
                      strokeWidth={2}
                      tappable
                      onPress={() => handleRiverOverviewPress(record.id)}
                    />
                  );
                }

                if (!isDrawableLine(coordinates)) return null;
                return (
                  <Polyline
                    key={`overview-line-${record.id}-${index}`}
                    coordinates={coordinates}
                    strokeColor={strokeColor}
                    strokeWidth={riverOverviewStrokeWidth}
                    tappable
                    onPress={() => handleRiverOverviewPress(record.id)}
                  />
                );
              });
            })
          : null}

        {/* Waterway markers */}
        {shouldRenderMarkers ? filteredWaterways.map(renderWaterwayMarker) : null}

        {/* Location markers */}
        {shouldRenderMarkers ? filteredLocations.map(renderLocationMarker) : null}

        {/* Historic map overlay at its georeferenced bounds (roadmap item 15) */}
        {overlayMap?.bounds ? (
          <Overlay
            key={`overlay-${overlayMap.id}`}
            image={{ uri: overlayMap.imageUrl }}
            bounds={[
              [overlayMap.bounds.southWest.latitude, overlayMap.bounds.southWest.longitude],
              [overlayMap.bounds.northEast.latitude, overlayMap.bounds.northEast.longitude],
            ]}
            opacity={overlayOpacity}
          />
        ) : null}
        {/* The overlay's frame, so its placement reads even while the image is still loading */}
        {overlayMap?.bounds ? (
          <Polyline
            key={`overlay-frame-${overlayMap.id}`}
            coordinates={[
              { latitude: overlayMap.bounds.southWest.latitude, longitude: overlayMap.bounds.southWest.longitude },
              { latitude: overlayMap.bounds.northEast.latitude, longitude: overlayMap.bounds.southWest.longitude },
              { latitude: overlayMap.bounds.northEast.latitude, longitude: overlayMap.bounds.northEast.longitude },
              { latitude: overlayMap.bounds.southWest.latitude, longitude: overlayMap.bounds.northEast.longitude },
              { latitude: overlayMap.bounds.southWest.latitude, longitude: overlayMap.bounds.southWest.longitude },
            ]}
            strokeColor="#8B5A2B"
            strokeWidth={2}
            lineDashPattern={[8, 6]}
          />
        ) : null}

        {/* Expedition route layer: the legs' waters in the expedition colour, dashed connectors
            between consecutive legs, and numbered leg markers (roadmap item 2) */}
        {expeditionDrawing
          ? [
              ...expeditionDrawing.legPaths.map((p) =>
                p.isArea ? (
                  <Polygon key={p.key} coordinates={p.coordinates} strokeColor={expeditionColor} fillColor={`${expeditionColor}33`} strokeWidth={3} zIndex={5} />
                ) : (
                  <Polyline key={p.key} coordinates={p.coordinates} strokeColor={expeditionColor} strokeWidth={5} zIndex={5} />
                )
              ),
              // Numbered badges only; the order reads from the numbers and the leg strip. The
              // dashed straight lines that joined consecutive legs across land were removed: they
              // suggested a route where none is recorded.
              ...expeditionDrawing.badges.map((b) => (
                <Marker
                  key={b.key}
                  coordinate={{ latitude: b.latitude, longitude: b.longitude }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  zIndex={20}
                  onPress={() => handleLegPress(b.legs[0]!)}
                >
                  <View style={[styles.legMarker, b.legs.length > 1 && styles.legMarkerWide, { backgroundColor: expeditionColor }]}>
                    <Text style={styles.legMarkerText}>{b.legs.map((leg) => leg.orderIndex + 1).join(' · ')}</Text>
                  </View>
                </Marker>
              )),
            ]
          : null}

        {/* Connection highlight: a river system or a decade's waters in one colour, with dots
            for waters that have no drawn geometry (roadmap item 1) */}
        {highlight && highlightDrawing
          ? [
              ...highlightDrawing.paths.map((p) =>
                p.isArea ? (
                  <Polygon key={p.key} coordinates={p.coordinates} strokeColor={highlight.color} fillColor={`${highlight.color}${p.isHere ? '66' : '33'}`} strokeWidth={p.isHere ? 4 : 2} zIndex={5} />
                ) : (
                  <Polyline key={p.key} coordinates={p.coordinates} strokeColor={highlight.color} strokeWidth={p.isHere ? 6 : 4} zIndex={5} />
                )
              ),
              ...highlightDrawing.dots.map((d) => (
                <Marker
                  key={`hl-dot-${d.id}`}
                  coordinate={{ latitude: d.latitude, longitude: d.longitude }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  zIndex={19}
                  tracksViewChanges={false}
                  onPress={() => handleHighlightPress(d)}
                >
                  <View style={[styles.highlightDot, { backgroundColor: highlight.color }]} />
                </Marker>
              )),
            ]
          : null}

        {/* KML overlay for selected waterway */}
        {selectedWaterwayPaths && selectedWaterwayGeometry && selectedWaterway ? (() => {
          const isArea = selectedWaterwayGeometry.geometryKind === 'area';
          const color = selectedWaterway.type?.name === 'River' ? '#3B82F6'
            : selectedWaterway.type?.name === 'Lake' ? '#06B6D4'
            : selectedWaterway.type?.name === 'Bay' ? '#10B981'
            : '#0EA5E9';

          // Per-path kind lets a river carry its mapped water surface (filled) alongside its
          // centreline (line); older servers send no pathKinds and fall back to the waterway kind.
          // Areas come first and lines after, each numbered within its own group: a lake or bay
          // has one water-surface polygon and a shoreline that grows from no lines at the nation
          // tier to hundreds at the fine tier, so the group that changes size sits at the very end
          // of the MapView's children, where the iOS interop layer mounts and unmounts children
          // immediately (see the testID on the MapView). Lines after areas also draws the
          // centreline over the water surface.
          const lines: { latitude: number; longitude: number }[][] = [];
          const areas: { latitude: number; longitude: number }[][] = [];
          selectedWaterwayPaths.forEach((latLngs, index) => {
            const pathIsArea = (selectedWaterwayGeometry.pathKinds?.[index] ?? (isArea ? 'area' : 'line')) === 'area';
            if (pathIsArea) {
              if (isDrawablePolygon(latLngs)) areas.push(latLngs);
            } else if (isDrawableLine(latLngs)) {
              lines.push(latLngs);
            }
          });
          return [
            ...areas.map((latLngs, i) => (
              <Polygon
                key={`trace-area-${i}`}
                coordinates={latLngs}
                strokeColor={color}
                fillColor={`${color}30`}
                strokeWidth={2}
                tappable
                onPress={handleSelectedOutlinePress}
              />
            )),
            ...lines.map((latLngs, i) => (
              <Polyline
                key={`trace-line-${i}`}
                coordinates={latLngs}
                strokeColor={color}
                strokeWidth={3}
                tappable
                onPress={handleSelectedOutlinePress}
              />
            )),
          ];
        })() : null}
      </MapView>

      {/* Preview card docked at the bottom of the map, so it never has to track the pin.
          Hidden while the bottom sheet is open; it returns when the sheet closes. */}
      {preview && previewInfo && !selectedMarker ? (
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(previewInfo.typeName) }]}>
              <Text style={styles.typeBadgeText}>{previewInfo.typeName}</Text>
            </View>
            <TouchableOpacity
              style={styles.previewCloseButton}
              onPress={handleDismissAll}
              hitSlop={8}
              accessibilityLabel={t('close')}
            >
              <X size={18} color="#6B7280" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Text style={styles.calloutTitle} numberOfLines={2}>
            {previewInfo.name}
          </Text>
          {previewInfo.indigenousName ? (
            <Text style={styles.calloutIndigenous} numberOfLines={1}>
              "{previewInfo.indigenousName}"
            </Text>
          ) : null}
          <View style={styles.previewActions}>
            <TouchableOpacity
              style={styles.previewDetailButton}
              onPress={handlePreviewDetailsPress}
              activeOpacity={0.8}
            >
              <Text style={styles.previewDetailButtonText}>{t('tapForDetails')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.previewEarthButton}
              onPress={() =>
                Linking.openURL(getGoogleEarthUrl(previewInfo.latitude, previewInfo.longitude))
              }
              activeOpacity={0.8}
            >
              <Globe2 size={16} color="white" />
              <Text style={styles.previewEarthButtonText}>Google Earth</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* Legend Toggle Button */}
      <TouchableOpacity
        style={styles.legendButton}
        onPress={toggleLegend}
        activeOpacity={0.8}
      >
        <Menu size={24} color="#2D5A3D" />
      </TouchableOpacity>

      {/* Search across everything (roadmap item 3) */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push('/search')}
        activeOpacity={0.8}
        accessibilityLabel={t('search')}
      >
        <SearchIcon size={22} color="#2D5A3D" />
      </TouchableOpacity>

      {/* Historic map overlay control: title, year, opacity steps and close (roadmap item 15).
          Shown as soon as an overlay is requested, so a map still loading, or one without
          bounds, is reported here instead of leaving the screen silent. */}
      {mapOverlayId ? (
        <View style={[styles.expeditionStrip, { borderLeftColor: '#8B5A2B', top: expedition || highlight ? 150 : 16 }]}>
          <View style={styles.expeditionStripHeader}>
            <Layers size={16} color="#8B5A2B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.expeditionStripTitle} numberOfLines={1}>{overlayMap?.title ?? 'Loading map…'}</Text>
              <Text style={styles.expeditionStripSubtitle} numberOfLines={1}>
                {overlayMap
                  ? overlayMap.bounds
                    ? `${overlayMap.mapmaker} · ${overlayMap.yearLabel ?? overlayMap.year}`
                    : 'This map has no overlay bounds'
                  : 'Fetching the map record'}
              </Text>
            </View>
            <TouchableOpacity onPress={closeOverlay} hitSlop={8} accessibilityLabel={t('close')} style={styles.previewCloseButton}>
              <X size={16} color="#6B7280" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          {overlayMap?.bounds ? (
          <View style={styles.opacityRow}>
            <Text style={styles.opacityLabel}>Opacity</Text>
            {[0.3, 0.5, 0.7, 1].map((value) => (
              <TouchableOpacity key={value} onPress={() => setOverlayOpacity(value)} style={[styles.opacityChip, overlayOpacity === value && styles.opacityChipActive]}>
                <Text style={[styles.opacityChipText, overlayOpacity === value && styles.opacityChipTextActive]}>{Math.round(value * 100)}%</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => router.push(`/historical-maps/${overlayMap.id}`)} style={styles.opacityAbout}>
              <Text style={styles.opacityAboutText}>About</Text>
            </TouchableOpacity>
          </View>
          ) : null}
        </View>
      ) : null}

      {/* Connection highlight strip: the system or decade, then a chip per water (roadmap item 1) */}
      {highlight ? (
        <View style={[styles.expeditionStrip, { borderLeftColor: highlight.color }]}>
          <View style={styles.expeditionStripHeader}>
            {highlight.kind === 'system' ? <Network size={16} color={highlight.color} /> : <History size={16} color={highlight.color} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.expeditionStripTitle} numberOfLines={1}>{highlight.title}</Text>
              <Text style={styles.expeditionStripSubtitle} numberOfLines={1}>{highlight.subtitle}</Text>
            </View>
            {highlight.onDetails ? (
              <TouchableOpacity onPress={highlight.onDetails} style={styles.opacityAbout}>
                <Text style={styles.opacityAboutText}>{highlight.detailsLabel}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={closeHighlight} hitSlop={8} accessibilityLabel={t('close')} style={styles.previewCloseButton}>
              <X size={16} color="#6B7280" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.legChips}>
            {highlight.items.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.legChip, { borderColor: highlight.color }, item.isHere && { backgroundColor: `${highlight.color}22` }]} onPress={() => handleHighlightPress(item)} activeOpacity={0.8}>
                <View>
                  <Text style={styles.legChipName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.legChipMeta} numberOfLines={1}>{item.meta}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Expedition strip: the journey's name and years, then its legs in order; a chip moves
          the map to that leg and previews its water (roadmap item 2) */}
      {expedition ? (
        <View style={[styles.expeditionStrip, { borderLeftColor: expeditionColor }]}>
          <View style={styles.expeditionStripHeader}>
            <Route size={16} color={expeditionColor} />
            <View style={{ flex: 1 }}>
              <Text style={styles.expeditionStripTitle} numberOfLines={1}>{expedition.name}</Text>
              <Text style={styles.expeditionStripSubtitle} numberOfLines={1}>
                {expedition.explorer.name} · {expedition.endYear && expedition.endYear !== expedition.startYear ? `${expedition.startYear}-${expedition.endYear}` : expedition.startYear} · {expedition.legs.length} {expedition.legs.length === 1 ? 'leg' : 'legs'}
              </Text>
            </View>
            <TouchableOpacity onPress={closeExpedition} hitSlop={8} accessibilityLabel={t('close')} style={styles.previewCloseButton}>
              <X size={16} color="#6B7280" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.legChips}>
            {expedition.legs.map((leg) => (
              <TouchableOpacity key={leg.id} style={[styles.legChip, { borderColor: expeditionColor }]} onPress={() => handleLegPress(leg)} activeOpacity={0.8}>
                <View style={[styles.legChipNumber, { backgroundColor: expeditionColor }]}>
                  <Text style={styles.legChipNumberText}>{leg.orderIndex + 1}</Text>
                </View>
                <View>
                  <Text style={styles.legChipName} numberOfLines={1}>{leg.location ? `${leg.location.name}` : leg.waterway.name}</Text>
                  <Text style={styles.legChipMeta} numberOfLines={1}>{leg.location ? `${leg.waterway.name}${leg.year ? ` · ${leg.year}` : ''}` : leg.year ?? ''}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {expedition.source ? <Text style={styles.expeditionStripSource} numberOfLines={1}>Route ordered from {expedition.source}</Text> : null}
        </View>
      ) : null}

      {/* Filter Menu Dropdown */}
      {legendVisible ? (
        <View style={styles.filterMenu}>
          <ScrollView style={styles.filterMenuScroll} showsVerticalScrollIndicator={false}>
            {/* Map Legend Section */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setLegendExpanded(prev => !prev)}
            >
              {legendExpanded ? (
                <ChevronDown size={16} color="#2D5A3D" />
              ) : (
                <ChevronRight size={16} color="#2D5A3D" />
              )}
              <Text style={styles.sectionHeaderText}>{t('mapLegend')}</Text>
            </TouchableOpacity>

            {legendExpanded ? (
              <View style={styles.sectionContent}>
                <Text style={styles.legendSectionTitle}>{t('waterways')}</Text>
                <TouchableOpacity
                  style={[styles.legendRow, activeFilter === 'River' && styles.legendRowActive]}
                  onPress={() => handleLegendFilterPress('River')}
                >
                  <View style={[styles.legendDot, { backgroundColor: markerColors.River }]} />
                  <Text style={[styles.legendText, activeFilter === 'River' && styles.legendTextActive]}>{t('river')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.legendRow, activeFilter === 'Lake' && styles.legendRowActive]}
                  onPress={() => handleLegendFilterPress('Lake')}
                >
                  <View style={[styles.legendDot, { backgroundColor: markerColors.Lake }]} />
                  <Text style={[styles.legendText, activeFilter === 'Lake' && styles.legendTextActive]}>{t('lake')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.legendRow, activeFilter === 'Bay' && styles.legendRowActive]}
                  onPress={() => handleLegendFilterPress('Bay')}
                >
                  <View style={[styles.legendDot, { backgroundColor: markerColors.Bay }]} />
                  <Text style={[styles.legendText, activeFilter === 'Bay' && styles.legendTextActive]}>{t('bay')}</Text>
                </TouchableOpacity>

                <Text style={[styles.legendSectionTitle, { marginTop: 8 }]}>{t('locations')}</Text>
                <TouchableOpacity
                  style={[styles.legendRow, activeFilter === 'Fort' && styles.legendRowActive]}
                  onPress={() => handleLegendFilterPress('Fort')}
                >
                  <View style={[styles.legendDot, { backgroundColor: markerColors.Fort }]} />
                  <Text style={[styles.legendText, activeFilter === 'Fort' && styles.legendTextActive]}>{t('fort')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.legendRow, activeFilter === 'Trading Post' && styles.legendRowActive]}
                  onPress={() => handleLegendFilterPress('Trading Post')}
                >
                  <View style={[styles.legendDot, { backgroundColor: markerColors['Trading Post'] }]} />
                  <Text style={[styles.legendText, activeFilter === 'Trading Post' && styles.legendTextActive]}>{t('tradingPost')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.legendRow, activeFilter === 'Portage' && styles.legendRowActive]}
                  onPress={() => handleLegendFilterPress('Portage')}
                >
                  <View style={[styles.legendDot, { backgroundColor: markerColors.Portage }]} />
                  <Text style={[styles.legendText, activeFilter === 'Portage' && styles.legendTextActive]}>{t('portage')}</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Filter by Waterway Section */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setWaterwayExpanded(prev => !prev)}
            >
              {waterwayExpanded ? (
                <ChevronDown size={16} color="#2D5A3D" />
              ) : (
                <ChevronRight size={16} color="#2D5A3D" />
              )}
              <Text style={styles.sectionHeaderText}>{t('filterByWaterway')}</Text>
            </TouchableOpacity>

            {waterwayExpanded ? (
              <View style={styles.sectionContent}>
                {waterways && waterways.length > 0 ? (
                  <ScrollView style={styles.filterList} nestedScrollEnabled>
                    {waterways.map(waterway => (
                      <TouchableOpacity
                        key={waterway.id}
                        style={[
                          styles.filterItem,
                          filterType === 'waterway' && filterValue === waterway.id && styles.filterItemActive,
                        ]}
                        onPress={() => handleWaterwayFilterSelect(waterway.id)}
                      >
                        <View style={[styles.legendDot, { backgroundColor: getMarkerColor(waterway.type?.name || 'River') }]} />
                        <Text
                          style={[
                            styles.filterItemText,
                            filterType === 'waterway' && filterValue === waterway.id && styles.filterItemTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {waterway.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.emptyText}>{t('noWaterwaysFound')}</Text>
                )}
              </View>
            ) : null}

            {/* Filter by Explorer Section */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setExplorerExpanded(prev => !prev)}
            >
              {explorerExpanded ? (
                <ChevronDown size={16} color="#2D5A3D" />
              ) : (
                <ChevronRight size={16} color="#2D5A3D" />
              )}
              <Text style={styles.sectionHeaderText}>{t('filterByExplorer')}</Text>
            </TouchableOpacity>

            {explorerExpanded ? (
              <View style={styles.sectionContent}>
                {explorersLoading ? (
                  <Text style={styles.emptyText}>{t('loadingExplorers')}</Text>
                ) : explorers && explorers.length > 0 ? (
                  <ScrollView style={styles.filterList} nestedScrollEnabled>
                    {explorers.map(explorer => (
                      <TouchableOpacity
                        key={explorer.id}
                        style={[
                          styles.filterItem,
                          filterType === 'explorer' && filterValue === explorer.id && styles.filterItemActive,
                        ]}
                        onPress={() => handleExplorerFilterSelect(explorer.id)}
                      >
                        <Text
                          style={[
                            styles.filterItemText,
                            filterType === 'explorer' && filterValue === explorer.id && styles.filterItemTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {explorer.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.emptyText}>{t('noExplorersFound')}</Text>
                )}
              </View>
            ) : null}

            {/* Filter by Era Section */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setEraExpanded(prev => !prev)}
            >
              {eraExpanded ? (
                <ChevronDown size={16} color="#2D5A3D" />
              ) : (
                <ChevronRight size={16} color="#2D5A3D" />
              )}
              <Text style={styles.sectionHeaderText}>{t('filterByEra')}</Text>
            </TouchableOpacity>

            {eraExpanded ? (
              <View style={styles.sectionContent}>
                {TIME_PERIODS.map(period => (
                  <TouchableOpacity
                    key={period.id}
                    style={[
                      styles.filterItem,
                      filterType === 'period' && filterValue === period.id && styles.filterItemActive,
                    ]}
                    onPress={() => handlePeriodFilterSelect(period.id)}
                  >
                    <Text
                      style={[
                        styles.filterItemText,
                        filterType === 'period' && filterValue === period.id && styles.filterItemTextActive,
                      ]}
                    >
                      {t(period.key)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}

            {/* Expeditions Section (route layer, roadmap item 2) */}
            {expeditionGroups.length > 0 ? (
              <>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => setExpeditionsExpanded(prev => !prev)}
                >
                  {expeditionsExpanded ? (
                    <ChevronDown size={16} color="#2D5A3D" />
                  ) : (
                    <ChevronRight size={16} color="#2D5A3D" />
                  )}
                  <Text style={styles.sectionHeaderText}>{t('expeditions')}</Text>
                </TouchableOpacity>

                {expeditionsExpanded ? (
                  <View style={styles.sectionContent}>
                    <ScrollView style={styles.filterList} nestedScrollEnabled>
                      {expeditionGroups.map((group) => (
                        <View key={group.explorerName}>
                          <Text style={styles.legendSectionTitle}>{group.explorerName}</Text>
                          {group.items.map((item) => (
                            <TouchableOpacity
                              key={item.id}
                              style={[styles.filterItem, expeditionId === item.id && styles.filterItemActive]}
                              onPress={() => handleExpeditionSelect(item.id)}
                            >
                              <View style={[styles.legendDot, { backgroundColor: item.color ?? '#B45309' }]} />
                              <Text style={[styles.filterItemText, expeditionId === item.id && styles.filterItemTextActive]} numberOfLines={2}>
                                {item.name} ({item.endYear && item.endYear !== item.startYear ? `${item.startYear}-${item.endYear}` : item.startYear})
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}
              </>
            ) : null}

            {/* Clear All Filters */}
            {hasActiveFilter ? (
              <TouchableOpacity style={styles.clearAllButton} onPress={clearAllFilters}>
                <Text style={styles.clearAllText}>{t('clearAllFilters')}</Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        </View>
      ) : null}

      {/* Bottom Sheet for details */}
      {selectedMarker ? (
        <DetailBottomSheet
          ref={bottomSheetRef}
          markerId={selectedMarker.id}
          markerType={selectedMarker.type}
          onClose={handleBottomSheetClose}
          onReturnToMap={handleDismissAll}
          markerLatitude={
            selectedMarker.type === 'waterway'
              ? waterways?.find(w => w.id === selectedMarker.id)?.latitude
              : locations?.find(l => l.id === selectedMarker.id)?.latitude
          }
          markerLongitude={
            selectedMarker.type === 'waterway'
              ? waterways?.find(w => w.id === selectedMarker.id)?.longitude
              : locations?.find(l => l.id === selectedMarker.id)?.longitude
          }
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFEF7',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2D5A3D',
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  previewCard: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    padding: 14,
    backgroundColor: '#FFFEF7',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  previewDetailButton: {
    flex: 1,
    backgroundColor: '#2D5A3D',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewDetailButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  previewEarthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  previewEarthButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5A3D',
    marginBottom: 2,
  },
  calloutIndigenous: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#8B4513',
    marginBottom: 4,
  },
  calloutHint: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  expeditionStrip: {
    position: 'absolute',
    top: 16,
    left: 72,
    right: 64, // clear of the search button at top-right
    backgroundColor: 'rgba(255, 254, 247, 0.97)',
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  expeditionStripHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  expeditionStripTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  expeditionStripSubtitle: { fontSize: 11, color: '#6B7280' },
  expeditionStripSource: { fontSize: 10, color: '#9CA3AF', fontStyle: 'italic', marginTop: 6 },
  legChips: { gap: 8, paddingRight: 4 },
  legChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 10, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: 'white', maxWidth: 190 },
  legChipNumber: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  legChipNumberText: { color: 'white', fontSize: 11, fontWeight: '700' },
  legChipName: { fontSize: 12, fontWeight: '600', color: '#1F2937', maxWidth: 140 },
  legChipMeta: { fontSize: 10, color: '#6B7280', maxWidth: 140 },
  opacityRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  opacityLabel: { fontSize: 11, color: '#6B7280', marginRight: 2 },
  opacityChip: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'white' },
  opacityChipActive: { backgroundColor: '#8B5A2B', borderColor: '#8B5A2B' },
  opacityChipText: { fontSize: 11, color: '#374151', fontWeight: '600' },
  opacityChipTextActive: { color: 'white' },
  opacityAbout: { marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 3 },
  opacityAboutText: { fontSize: 11, color: '#3B82A3', textDecorationLine: 'underline', fontWeight: '600' },
  legMarker: { minWidth: 26, height: 26, borderRadius: 13, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white' },
  legMarkerWide: { paddingHorizontal: 8 },
  highlightDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: 'white' },
  legMarkerText: { color: 'white', fontSize: 12, fontWeight: '700' },
  searchButton: {
    position: 'absolute',
    top: 16,
    right: 12,
    backgroundColor: 'rgba(255, 254, 247, 0.95)',
    padding: 11,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 254, 247, 0.95)',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legend: {
    position: 'absolute',
    top: 60,
    left: 16,
    backgroundColor: 'rgba(255, 254, 247, 0.95)',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 140,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5A3D',
    marginBottom: 8,
  },
  legendSection: {
    marginBottom: 8,
  },
  legendSectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 11,
    color: '#374151',
  },
  legendRowActive: {
    backgroundColor: 'rgba(45, 90, 61, 0.1)',
    borderRadius: 4,
    marginHorizontal: -4,
    paddingHorizontal: 4,
  },
  legendTextActive: {
    fontWeight: '600',
    color: '#2D5A3D',
  },
  clearFilterButton: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearFilterText: {
    fontSize: 11,
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '500',
  },
  // New filter menu styles
  filterMenu: {
    position: 'absolute',
    top: 60,
    left: 16,
    backgroundColor: 'rgba(255, 254, 247, 0.98)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: 220,
    maxHeight: 400,
  },
  filterMenuScroll: {
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D5A3D',
    marginLeft: 6,
  },
  sectionContent: {
    paddingVertical: 8,
    paddingLeft: 22,
  },
  filterList: {
    maxHeight: 120,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 2,
  },
  filterItemActive: {
    backgroundColor: 'rgba(45, 90, 61, 0.15)',
  },
  filterItemText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  filterItemTextActive: {
    fontWeight: '600',
    color: '#2D5A3D',
  },
  emptyText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  clearAllButton: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearAllText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '600',
  },
});
