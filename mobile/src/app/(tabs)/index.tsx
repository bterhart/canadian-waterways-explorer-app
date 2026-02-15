// Interactive Map Screen for Canadian Waterways Education
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT, Region, Polyline, Polygon } from 'react-native-maps';
import { useWaterways, useLocations } from '@/lib/api/waterways-api';
import DetailBottomSheet, { DetailBottomSheetRef } from '@/components/DetailBottomSheet';
import type { MarkerType, Waterway, Location } from '@/lib/types/waterways';
import { useTranslation } from '@/lib/i18n';

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
  const { data: waterways, isLoading: waterwaysLoading, isError: waterwaysError } = useWaterways();
  const { data: locations, isLoading: locationsLoading, isError: locationsError } = useLocations();
  const { t } = useTranslation();

  const [selectedMarker, setSelectedMarker] = useState<{
    id: string;
    type: MarkerType;
  } | null>(null);

  const bottomSheetRef = useRef<DetailBottomSheetRef>(null);
  const mapRef = useRef<MapView>(null);

  const isLoading = waterwaysLoading || locationsLoading;
  const isError = waterwaysError || locationsError;

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
    setSelectedMarker(null);
  }, []);

  const renderWaterwayMarker = (waterway: Waterway) => {
    const typeName = waterway.type?.name || 'River';
    return (
      <Marker
        key={`waterway-${waterway.id}`}
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
            <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(typeName) }]}>
              <Text style={styles.typeBadgeText}>{typeName}</Text>
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
    return (
      <Marker
        key={`location-${location.id}`}
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
            <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(locationType) }]}>
              <Text style={styles.typeBadgeText}>{locationType}</Text>
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
        {waterways?.map(renderWaterwayMarker)}

        {/* Location markers */}
        {locations?.map(renderLocationMarker)}

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

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>{t('mapLegend')}</Text>
        <View style={styles.legendSection}>
          <Text style={styles.legendSectionTitle}>{t('waterways')}</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.River }]} />
            <Text style={styles.legendText}>{t('river')}</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.Lake }]} />
            <Text style={styles.legendText}>{t('lake')}</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.Bay }]} />
            <Text style={styles.legendText}>{t('bay')}</Text>
          </View>
        </View>
        <View style={styles.legendSection}>
          <Text style={styles.legendSectionTitle}>{t('locations')}</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.Fort }]} />
            <Text style={styles.legendText}>{t('fort')}</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors['Trading Post'] }]} />
            <Text style={styles.legendText}>{t('tradingPost')}</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.Portage }]} />
            <Text style={styles.legendText}>{t('portage')}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Sheet for details */}
      {selectedMarker ? (
        <DetailBottomSheet
          ref={bottomSheetRef}
          markerId={selectedMarker.id}
          markerType={selectedMarker.type}
          onClose={handleBottomSheetClose}
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
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
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
  legend: {
    position: 'absolute',
    top: 16,
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
});
