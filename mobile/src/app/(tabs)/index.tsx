// Interactive Map Screen for Canadian Waterways Education
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT, Region, Polyline, Polygon } from 'react-native-maps';
import { Menu, ChevronDown, ChevronRight, Globe2, X } from 'lucide-react-native';
import {
  useWaterways,
  useRiverOverview,
  useLocations,
  useExplorers,
  useExplorerDetail,
  useWaterwayDetail,
} from '@/lib/api/waterways-api';
import DetailBottomSheet, { DetailBottomSheetRef } from '@/components/DetailBottomSheet';
import type {
  MarkerType,
  Waterway,
  Location,
  OverviewTierName,
  WaterwayOverviewRecord,
} from '@/lib/types/waterways';
import { useTranslation } from '@/lib/i18n';

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

const OVERVIEW_VIEWPORT_PADDING_FACTOR = 0.2;

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

// Generate Google Earth Web URL
const getGoogleEarthUrl = (latitude: number, longitude: number): string => {
  return `https://earth.google.com/web/@${latitude},${longitude},500a,5000d,35y,0h,45t,0r`;
};

// Parse KML text and extract all coordinate paths
const parseKmlCoordinates = (kmlData: string): Array<{ lat: number; lng: number }[]> => {
  try {
    const paths: Array<{ lat: number; lng: number }[]> = [];

    // Extract all <coordinates> blocks from the KML
    const coordRegex = /<coordinates[^>]*>([\s\S]*?)<\/coordinates>/gi;
    let match;

    while ((match = coordRegex.exec(kmlData)) !== null) {
      const coordText = match[1].trim();
      const coords = coordText
        .split(/\s+/)
        .map(triplet => triplet.trim())
        .filter(triplet => triplet.length > 0)
        .map(triplet => {
          const parts = triplet.split(',');
          if (parts.length < 2) return null;
          const lng = parseFloat(parts[0]);
          const lat = parseFloat(parts[1]);
          if (isNaN(lat) || isNaN(lng)) return null;
          return { lat, lng };
        })
        .filter((c): c is { lat: number; lng: number } => c !== null);

      if (coords.length > 0) {
        paths.push(coords);
      }
    }

    return paths;
  } catch {
    return [];
  }
};

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

const bboxIntersectsRegion = (
  bbox: [number, number, number, number] | null,
  region: Region,
  paddingFactor: number = 0,
): boolean => {
  if (!bbox) return true;

  const [minLng, minLat, maxLng, maxLat] = bbox;
  const latPadding = region.latitudeDelta * paddingFactor;
  const lngPadding = region.longitudeDelta * paddingFactor;

  const regionMinLat = region.latitude - region.latitudeDelta / 2 - latPadding;
  const regionMaxLat = region.latitude + region.latitudeDelta / 2 + latPadding;
  const regionMinLng = region.longitude - region.longitudeDelta / 2 - lngPadding;
  const regionMaxLng = region.longitude + region.longitudeDelta / 2 + lngPadding;

  return !(
    maxLat < regionMinLat ||
    minLat > regionMaxLat ||
    maxLng < regionMinLng ||
    minLng > regionMaxLng
  );
};

const overviewPathToCoordinates = (path: [number, number][]) =>
  path.map(([longitude, latitude]) => ({ latitude, longitude }));

export default function MapScreen() {
  const { t } = useTranslation();

  // State declarations first
  const [selectedMarker, setSelectedMarker] = useState<{
    id: string;
    type: MarkerType;
  } | null>(null);

  // Track which waterway callout is visible (controls boundary display)
  // This is separate from selectedMarker which controls bottom sheet
  const [visibleCalloutMarker, setVisibleCalloutMarker] = useState<{
    id: string;
    type: MarkerType;
  } | null>(null);

  // Track screen position of the callout icons
  const [calloutScreenPosition, setCalloutScreenPosition] = useState<{ x: number; y: number } | null>(null);
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

  // Fetch KML for either a visible waterway callout or a waterway selected directly from the overview layer
  const detailWaterwayId =
    visibleCalloutMarker?.type === 'waterway'
      ? visibleCalloutMarker.id
      : selectedMarker?.type === 'waterway'
        ? selectedMarker.id
        : null;
  const { data: waterwayKmlDetail } = useWaterwayDetail(detailWaterwayId);

  const bottomSheetRef = useRef<DetailBottomSheetRef>(null);
  const mapRef = useRef<MapView>(null);
  // Store marker refs to allow programmatic callout dismissal
  const markerRefs = useRef<Record<string, any>>({});
  // Ignore only map presses that occur immediately after a callout tap
  const lastCalloutPressAtRef = useRef(0);
  // Keep floating callout icon positioning smooth and reject stale async point lookups
  const calloutPositionFrameRef = useRef<number | null>(null);
  const calloutPositionRequestIdRef = useRef(0);

  const isLoading = waterwaysLoading || locationsLoading;
  const isError = waterwaysError || locationsError;

  const toggleLegend = useCallback(() => {
    setLegendVisible(prev => !prev);
  }, []);

  // Legacy legend filter handler (for map legend items)
  const handleLegendFilterPress = useCallback((legendType: string) => {
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
  }, [activeFilter]);

  // Handler for waterway filter selection
  const handleWaterwayFilterSelect = useCallback((waterwayId: string) => {
    setFilterType('waterway');
    setFilterValue(waterwayId);
    setActiveFilter(null);
    setSelectedExplorerId(null);
  }, []);

  // Handler for explorer filter selection
  const handleExplorerFilterSelect = useCallback((explorerId: string) => {
    setFilterType('explorer');
    setFilterValue(explorerId);
    setSelectedExplorerId(explorerId);
    setActiveFilter(null);
  }, []);

  // Handler for time period filter selection
  const handlePeriodFilterSelect = useCallback((periodId: string) => {
    setFilterType('period');
    setFilterValue(periodId);
    setActiveFilter(null);
    setSelectedExplorerId(null);
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setActiveFilter(null);
    setFilterType(null);
    setFilterValue(null);
    setSelectedExplorerId(null);
  }, []);

  // Check if any filter is active
  const hasActiveFilter = filterType !== null || activeFilter !== null;
  const hasRiverOverviewData = !!riverOverviewData?.waterways?.length;
  const shouldPreferRiverOverviewMode = !hasActiveFilter && !visibleCalloutMarker;
  const shouldShowRiverOverview = shouldPreferRiverOverviewMode && !selectedMarker && hasRiverOverviewData;
  const shouldSuppressMarkersForOverview = shouldPreferRiverOverviewMode && (riverOverviewLoading || hasRiverOverviewData);
  const shouldRenderMarkers = !shouldSuppressMarkersForOverview;
  const riverOverviewTier = useMemo(() => getOverviewTier(mapRegion), [mapRegion]);
  const isRiverOverviewInteractive = riverOverviewTier === 'local';
  const riverOverviewStrokeWidth = OVERVIEW_STROKE_WIDTH[riverOverviewTier];

  const visibleRiverOverviewRecords = useMemo(() => {
    if (!shouldShowRiverOverview || !riverOverviewData?.waterways) return [];

    return riverOverviewData.waterways.filter((record) =>
      bboxIntersectsRegion(record.bbox, mapRegion, OVERVIEW_VIEWPORT_PADDING_FACTOR),
    );
  }, [shouldShowRiverOverview, riverOverviewData, mapRegion]);

  // Get explorer's waterway IDs for filtering
  const explorerWaterwayIds = useMemo(() => {
    if (!explorerDetail?.waterways) return new Set<string>();
    return new Set(explorerDetail.waterways.map(ew => ew.waterway.id));
  }, [explorerDetail]);

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

  const selectedWaterwayKml = useMemo(() => {
    if (!detailWaterwayId) return null;
    return waterwayKmlDetail?.kmlData || selectedWaterway?.kmlData || null;
  }, [detailWaterwayId, waterwayKmlDetail, selectedWaterway]);

  // Get coordinates for the visible callout marker (for floating icons)
  const visibleMarkerCoords = useMemo(() => {
    if (!visibleCalloutMarker) return null;
    if (visibleCalloutMarker.type === 'waterway') {
      const waterway = waterways?.find(w => w.id === visibleCalloutMarker.id);
      return waterway ? { latitude: waterway.latitude, longitude: waterway.longitude } : null;
    } else {
      const location = locations?.find(l => l.id === visibleCalloutMarker.id);
      return location ? { latitude: location.latitude, longitude: location.longitude } : null;
    }
  }, [visibleCalloutMarker, waterways, locations]);

  // Animate to waterway when a waterway is focused through either a callout or direct overview selection
  useEffect(() => {
    if (detailWaterwayId && selectedWaterway) {
      if (selectedWaterwayKml) {
        const paths = parseKmlCoordinates(selectedWaterwayKml);
        const allCoords = paths.flat().map(c => ({ latitude: c.lat, longitude: c.lng }));
        const region = getRegionForCoordinates(allCoords);
        if (region && mapRef.current) {
          mapRef.current.animateToRegion(region, 500);
          return;
        }
      }

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: selectedWaterway.latitude,
          longitude: selectedWaterway.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }, 500);
      }

      return;
    }

    if (visibleCalloutMarker?.type === 'location') {
      const location = locations?.find(l => l.id === visibleCalloutMarker.id);
      if (location && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }, 500);
      }
    }
  }, [detailWaterwayId, selectedWaterway, selectedWaterwayKml, visibleCalloutMarker, locations]);

  // Function to update screen position of callout icons
  const updateCalloutScreenPosition = useCallback(async () => {
    if (!visibleMarkerCoords || !mapRef.current) {
      setCalloutScreenPosition(null);
      return;
    }
    const requestId = ++calloutPositionRequestIdRef.current;
    try {
      const point = await mapRef.current.pointForCoordinate({
        latitude: visibleMarkerCoords.latitude,
        longitude: visibleMarkerCoords.longitude,
      });
      if (requestId !== calloutPositionRequestIdRef.current) {
        return;
      }
      if (point) {
        setCalloutScreenPosition({ x: point.x, y: point.y });
      }
    } catch {
      // Ignore errors - map may not be ready
    }
  }, [visibleMarkerCoords]);

  const scheduleCalloutScreenPositionUpdate = useCallback(() => {
    if (!visibleMarkerCoords) {
      setCalloutScreenPosition(null);
      return;
    }

    if (calloutPositionFrameRef.current !== null) {
      cancelAnimationFrame(calloutPositionFrameRef.current);
    }

    calloutPositionFrameRef.current = requestAnimationFrame(() => {
      calloutPositionFrameRef.current = null;
      updateCalloutScreenPosition();
    });
  }, [visibleMarkerCoords, updateCalloutScreenPosition]);

  // Update screen position immediately when the visible marker changes
  useEffect(() => {
    if (!visibleMarkerCoords) {
      if (calloutPositionFrameRef.current !== null) {
        cancelAnimationFrame(calloutPositionFrameRef.current);
        calloutPositionFrameRef.current = null;
      }
      calloutPositionRequestIdRef.current += 1;
      setCalloutScreenPosition(null);
      return;
    }
    scheduleCalloutScreenPositionUpdate();

    return () => {
      if (calloutPositionFrameRef.current !== null) {
        cancelAnimationFrame(calloutPositionFrameRef.current);
        calloutPositionFrameRef.current = null;
      }
    };
  }, [visibleMarkerCoords, scheduleCalloutScreenPositionUpdate]);

  // Update callout icon position when map region changes (drag/zoom)
  const handleRegionChange = useCallback(() => {
    if (visibleMarkerCoords) {
      scheduleCalloutScreenPositionUpdate();
    }
  }, [visibleMarkerCoords, scheduleCalloutScreenPositionUpdate]);

  const handleRegionChangeComplete = useCallback((region: Region) => {
    setMapRegion(region);
    handleRegionChange();
  }, [handleRegionChange]);

  // Open the bottom sheet only after it has mounted
  useEffect(() => {
    if (!selectedMarker) return;

    const frame = requestAnimationFrame(() => {
      bottomSheetRef.current?.expand();
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedMarker]);

  // Called when marker is tapped (callout appears) - show boundary
  const handleMarkerSelect = useCallback((id: string, type: MarkerType) => {
    setVisibleCalloutMarker({ id, type });
  }, []);

  // Called when "Tap for details" is pressed in callout - show bottom sheet
  const handleCalloutPress = useCallback((id: string, type: MarkerType) => {
    lastCalloutPressAtRef.current = Date.now();
    setSelectedMarker({ id, type });
  }, []);

  // Called when a river overview line is pressed at local zoom - open river details directly
  const handleRiverOverviewPress = useCallback((waterwayId: string) => {
    lastCalloutPressAtRef.current = Date.now();
    setVisibleCalloutMarker(null);
    setSelectedMarker({ id: waterwayId, type: 'waterway' });
  }, []);

  // Called when bottom sheet is closed - only closes sheet, leaves callout and boundary visible
  const handleBottomSheetClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  // Called when callout should be dismissed (clears both callout and boundary)
  const handleCalloutDismiss = useCallback(() => {
    // Hide the callout for the currently visible marker
    if (visibleCalloutMarker) {
      const markerKey = `${visibleCalloutMarker.type}-${visibleCalloutMarker.id}`;
      const markerRef = markerRefs.current[markerKey];
      if (markerRef?.hideCallout) {
        markerRef.hideCallout();
      }
    }
    if (calloutPositionFrameRef.current !== null) {
      cancelAnimationFrame(calloutPositionFrameRef.current);
      calloutPositionFrameRef.current = null;
    }
    calloutPositionRequestIdRef.current += 1;
    setCalloutScreenPosition(null);
    setVisibleCalloutMarker(null);
    // Also close bottom sheet if open
    setSelectedMarker(null);
    bottomSheetRef.current?.close();
  }, [visibleCalloutMarker]);

  const handleMapPress = useCallback(() => {
    if (Date.now() - lastCalloutPressAtRef.current < 300) {
      return;
    }

    handleCalloutDismiss();
    setLegendVisible(false);
  }, [handleCalloutDismiss]);

  const renderWaterwayMarker = (waterway: Waterway) => {
    const typeName = waterway.type?.name || 'River';
    const markerKey = `waterway-${waterway.id}`;
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
        pinColor={getMarkerColor(typeName)}
        tracksViewChanges={false}
        onSelect={() => handleMarkerSelect(waterway.id, 'waterway')}
      >
        <Callout
          onPress={() => handleCalloutPress(waterway.id, 'waterway')}
          tooltip={false}
        >
          <View style={styles.calloutContainer}>
            <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(typeName) }]}>
              <Text style={styles.typeBadgeText}>{typeName}</Text>
            </View>
            <Text style={styles.calloutTitle}>{waterway.name}</Text>
            {waterway.indigenousName ? (
              <Text style={styles.calloutIndigenous}>"{waterway.indigenousName}"</Text>
            ) : null}
            <View style={styles.calloutDetailButton}>
              <Text style={styles.calloutDetailButtonText}>{t('tapForDetails')}</Text>
            </View>
          </View>
        </Callout>
      </Marker>
    );
  };

  const renderLocationMarker = (location: Location) => {
    const locationType = location.locationType || 'Settlement';
    const markerKey = `location-${location.id}`;
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
        pinColor={getMarkerColor(locationType)}
        tracksViewChanges={false}
        onSelect={() => handleMarkerSelect(location.id, 'location')}
      >
        <Callout
          onPress={() => handleCalloutPress(location.id, 'location')}
          tooltip={false}
        >
          <View style={styles.calloutContainer}>
            <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(locationType) }]}>
              <Text style={styles.typeBadgeText}>{locationType}</Text>
            </View>
            <Text style={styles.calloutTitle}>{location.name}</Text>
            {location.indigenousName ? (
              <Text style={styles.calloutIndigenous}>"{location.indigenousName}"</Text>
            ) : null}
            <View style={styles.calloutDetailButton}>
              <Text style={styles.calloutDetailButtonText}>{t('tapForDetails')}</Text>
            </View>
          </View>
        </Callout>
      </Marker>
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={CANADA_CENTER}
        showsUserLocation={false}
        showsCompass={true}
        showsScale={true}
        mapType="terrain"
        onRegionChange={handleRegionChange}
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={handleMapPress}
      >
        {/* River overview layer for the initial home map */}
        {shouldShowRiverOverview
          ? visibleRiverOverviewRecords.map((record: WaterwayOverviewRecord) => {
              const tierData = record.tiers[riverOverviewTier];
              const strokeColor = getMarkerColor(record.typeName || 'River');

              if (!tierData?.paths?.length) return null;

              return tierData.paths.map((path, index) => {
                const coordinates = overviewPathToCoordinates(path);

                if (record.geometryKind === 'area') {
                  return (
                    <Polygon
                      key={`overview-area-${riverOverviewTier}-${record.id}-${index}`}
                      coordinates={coordinates}
                      strokeColor={strokeColor}
                      fillColor={`${strokeColor}20`}
                      strokeWidth={2}
                      tappable={isRiverOverviewInteractive}
                      onPress={isRiverOverviewInteractive ? () => handleRiverOverviewPress(record.id) : undefined}
                    />
                  );
                }

                return (
                  <Polyline
                    key={`overview-line-${riverOverviewTier}-${record.id}-${index}`}
                    coordinates={coordinates}
                    strokeColor={strokeColor}
                    strokeWidth={riverOverviewStrokeWidth}
                    tappable={isRiverOverviewInteractive}
                    onPress={isRiverOverviewInteractive ? () => handleRiverOverviewPress(record.id) : undefined}
                  />
                );
              });
            })
          : null}

        {/* Waterway markers */}
        {shouldRenderMarkers ? filteredWaterways.map(renderWaterwayMarker) : null}

        {/* Location markers */}
        {shouldRenderMarkers ? filteredLocations.map(renderLocationMarker) : null}

        {/* KML overlay for selected waterway */}
        {selectedWaterwayKml && selectedWaterway ? (() => {
          const paths = parseKmlCoordinates(selectedWaterwayKml);
          const isArea = selectedWaterway.type?.name === 'Lake' || selectedWaterway.type?.name === 'Bay';
          const color = selectedWaterway.type?.name === 'River' ? '#3B82F6'
            : selectedWaterway.type?.name === 'Lake' ? '#06B6D4'
            : selectedWaterway.type?.name === 'Bay' ? '#10B981'
            : '#0EA5E9';

          return paths.map((coords, index) => {
            const latLngs = coords.map(c => ({ latitude: c.lat, longitude: c.lng }));
            if (isArea) {
              return (
                <Polygon
                  key={`kml-poly-${index}`}
                  coordinates={latLngs}
                  strokeColor={color}
                  fillColor={`${color}30`}
                  strokeWidth={2}
                />
              );
            }
            return (
              <Polyline
                key={`kml-line-${index}`}
                coordinates={latLngs}
                strokeColor={color}
                strokeWidth={3}
              />
            );
          });
        })() : null}
      </MapView>

      {/* Floating Icons Above Callout */}
      {visibleCalloutMarker && visibleMarkerCoords && calloutScreenPosition ? (
        <View style={styles.calloutIconsOverlay} pointerEvents="box-none">
          {/* Google Earth Button - Left aligned with callout left edge */}
          <TouchableOpacity
            style={[
              styles.calloutEarthButton,
              {
                position: 'absolute',
                // Callout is 200px wide, centered on marker. Left edge = marker.x - 100
                left: calloutScreenPosition.x - 100,
                // Position barely above callout
                top: calloutScreenPosition.y - 195,
              },
            ]}
            onPress={() => {
              const url = getGoogleEarthUrl(visibleMarkerCoords.latitude, visibleMarkerCoords.longitude);
              Linking.openURL(url);
            }}
            activeOpacity={0.8}
          >
            <Globe2 size={16} color="white" />
          </TouchableOpacity>

          {/* Close Button - Right aligned with callout right edge */}
          <TouchableOpacity
            style={[
              styles.calloutCloseButton,
              {
                position: 'absolute',
                // Right edge of callout = marker.x + 100
                // Button is 56px wide, so left = callout right - button width
                left: calloutScreenPosition.x + 100 - 56,
                top: calloutScreenPosition.y - 195,
              },
            ]}
            onPress={handleCalloutDismiss}
            activeOpacity={0.8}
          >
            <X size={16} color="white" strokeWidth={3} />
          </TouchableOpacity>
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
          onReturnToMap={handleCalloutDismiss}
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
  calloutContainer: {
    width: 200,
    padding: 12,
    backgroundColor: '#FFFEF7',
    borderRadius: 12,
  },
  calloutIconsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  calloutEarthButton: {
    width: 56,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutCloseButton: {
    width: 56,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutDetailButton: {
    marginTop: 8,
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  calloutDetailButtonText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '500',
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
