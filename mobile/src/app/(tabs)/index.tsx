// Interactive Map Screen for Canadian Waterways Education
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT, Region, Polyline, Polygon } from 'react-native-maps';
import { Menu, ChevronDown, ChevronRight, Globe2, X } from 'lucide-react-native';
import { useWaterways, useLocations, useExplorers, useExplorerDetail } from '@/lib/api/waterways-api';
import DetailBottomSheet, { DetailBottomSheetRef } from '@/components/DetailBottomSheet';
import type { MarkerType, Waterway, Location } from '@/lib/types/waterways';
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

// Parse boundary coordinates from JSON string
const parseBoundaryCoordinates = (coordsString: string | null): { latitude: number; longitude: number }[] => {
  if (!coordsString) return [];
  try {
    const coords = JSON.parse(coordsString) as [number, number][];
    return coords.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
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

export default function MapScreen() {
  const { t } = useTranslation();

  // State declarations first
  const [selectedMarker, setSelectedMarker] = useState<{
    id: string;
    type: MarkerType;
  } | null>(null);
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
  const { data: locations, isLoading: locationsLoading, isError: locationsError } = useLocations();
  const { data: explorers, isLoading: explorersLoading } = useExplorers();
  const { data: explorerDetail } = useExplorerDetail(selectedExplorerId);

  const bottomSheetRef = useRef<DetailBottomSheetRef>(null);
  const mapRef = useRef<MapView>(null);
  // Store marker refs to allow programmatic callout dismissal
  const markerRefs = useRef<Record<string, any>>({});

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
    if (filterType === 'explorer' && explorerWaterwayIds.size > 0) {
      return waterways.filter(w => explorerWaterwayIds.has(w.id));
    }

    // Filter by time period - we would need year data on waterways
    // For now, show all waterways when period filter is active
    if (filterType === 'period') {
      return waterways;
    }

    return waterways;
  }, [waterways, activeFilter, filterType, filterValue, explorerWaterwayIds]);

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
    if (filterType === 'explorer' && explorerWaterwayIds.size > 0) {
      return locations.filter(l => l.waterway && explorerWaterwayIds.has(l.waterway.id));
    }

    // Filter by time period - filter by yearEstablished
    if (filterType === 'period' && selectedPeriod) {
      return locations.filter(l => {
        // We need to check location's year - using waterway relationship or other data
        // For now, we filter based on historical context
        // Locations without years are included in all periods
        return true; // Show all locations for now - would need yearEstablished data
      });
    }

    return locations;
  }, [locations, activeFilter, filterType, filterValue, explorerWaterwayIds, selectedPeriod]);

  // Find selected waterway for highlighting
  const selectedWaterway = useMemo(() => {
    if (!selectedMarker || selectedMarker.type !== 'waterway') return null;
    return waterways?.find(w => w.id === selectedMarker.id) || null;
  }, [selectedMarker, waterways]);

  // Parse boundary coordinates for the selected waterway
  const boundaryCoordinates = useMemo(() => {
    if (!selectedWaterway?.boundaryCoordinates) return [];
    return parseBoundaryCoordinates(selectedWaterway.boundaryCoordinates);
  }, [selectedWaterway]);

  // Animate to waterway when selected
  useEffect(() => {
    if (selectedMarker?.type === 'waterway' && boundaryCoordinates.length > 0) {
      const region = getRegionForCoordinates(boundaryCoordinates);
      if (region && mapRef.current) {
        mapRef.current.animateToRegion(region, 500);
      }
    } else if (selectedMarker?.type === 'location') {
      const location = locations?.find(l => l.id === selectedMarker.id);
      if (location && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }, 500);
      }
    }
  }, [selectedMarker, boundaryCoordinates, locations]);

  const handleCalloutPress = useCallback((id: string, type: MarkerType) => {
    setSelectedMarker({ id, type });
    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 100);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    // Hide the callout for the currently selected marker before clearing selection
    if (selectedMarker) {
      const markerKey = `${selectedMarker.type}-${selectedMarker.id}`;
      const markerRef = markerRefs.current[markerKey];
      if (markerRef?.hideCallout) {
        markerRef.hideCallout();
      }
    }
    setSelectedMarker(null);
  }, [selectedMarker]);

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
      >
        <Callout
          onPress={() => handleCalloutPress(waterway.id, 'waterway')}
          tooltip={false}
        >
          <View style={styles.calloutContainer}>
            {/* Header row: Type badge + Google Earth on left, Close X on right */}
            <View style={styles.calloutHeader}>
              <View style={styles.calloutHeaderLeft}>
                <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(typeName) }]}>
                  <Text style={styles.typeBadgeText}>{typeName}</Text>
                </View>
                <TouchableOpacity
                  style={styles.earthButton}
                  onPress={() => {
                    const url = getGoogleEarthUrl(waterway.latitude, waterway.longitude);
                    Linking.openURL(url);
                  }}
                >
                  <Globe2 size={14} color="white" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleBottomSheetClose}
              >
                <X size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <Text style={styles.calloutTitle}>{waterway.name}</Text>
            {waterway.indigenousName ? (
              <Text style={styles.calloutIndigenous}>"{waterway.indigenousName}"</Text>
            ) : null}
            <Text style={styles.calloutHint}>{t('tapForDetails')}</Text>
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
      >
        <Callout
          onPress={() => handleCalloutPress(location.id, 'location')}
          tooltip={false}
        >
          <View style={styles.calloutContainer}>
            {/* Header row: Type badge + Google Earth on left, Close X on right */}
            <View style={styles.calloutHeader}>
              <View style={styles.calloutHeaderLeft}>
                <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(locationType) }]}>
                  <Text style={styles.typeBadgeText}>{locationType}</Text>
                </View>
                <TouchableOpacity
                  style={styles.earthButton}
                  onPress={() => {
                    const url = getGoogleEarthUrl(location.latitude, location.longitude);
                    Linking.openURL(url);
                  }}
                >
                  <Globe2 size={14} color="white" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleBottomSheetClose}
              >
                <X size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <Text style={styles.calloutTitle}>{location.name}</Text>
            {location.indigenousName ? (
              <Text style={styles.calloutIndigenous}>"{location.indigenousName}"</Text>
            ) : null}
            <Text style={styles.calloutHint}>{t('tapForDetails')}</Text>
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
      >
        {/* Waterway markers */}
        {filteredWaterways.map(renderWaterwayMarker)}

        {/* Location markers */}
        {filteredLocations.map(renderLocationMarker)}

        {/* Boundary highlight for selected waterway */}
        {boundaryCoordinates.length > 0 && selectedWaterway ? (
          selectedWaterway.type?.name === 'Lake' || selectedWaterway.type?.name === 'Bay' ? (
            // Lakes and bays use polygon (closed shape with fill)
            <Polygon
              key={`polygon-${selectedWaterway.id}`}
              coordinates={boundaryCoordinates}
              strokeColor={getMarkerColor(selectedWaterway.type?.name || 'Lake')}
              strokeWidth={4}
              fillColor={`${getMarkerColor(selectedWaterway.type?.name || 'Lake')}30`}
              tappable={false}
            />
          ) : (
            // Rivers use polyline (path without fill)
            <Polyline
              key={`polyline-${selectedWaterway.id}`}
              coordinates={boundaryCoordinates}
              strokeColor={getMarkerColor(selectedWaterway.type?.name || 'River')}
              strokeWidth={6}
              lineCap="round"
              lineJoin="round"
              tappable={false}
            />
          )
        ) : null}
      </MapView>

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
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  calloutHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  earthButton: {
    padding: 5,
    backgroundColor: '#4285F4',
    borderRadius: 12,
  },
  closeButton: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
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
