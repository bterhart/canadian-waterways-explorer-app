// Interactive Map Screen for Canadian Waterways Education
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { useWaterways, useLocations } from '@/lib/api/waterways-api';
import DetailBottomSheet, { DetailBottomSheetRef } from '@/components/DetailBottomSheet';
import type { MarkerType, WaterwayType, LocationType, Waterway, Location } from '@/lib/types/waterways';

// Canada center coordinates
const CANADA_CENTER: Region = {
  latitude: 56.1304,
  longitude: -106.3468,
  latitudeDelta: 30,
  longitudeDelta: 30,
};

// Marker colors based on type
const markerColors = {
  // Waterway types
  river: '#3B82F6', // Blue
  lake: '#06B6D4', // Cyan
  bay: '#10B981', // Green/Teal
  // Location types
  fort: '#EF4444', // Red
  trading_post: '#F97316', // Orange
  portage: '#92400E', // Brown
  settlement: '#8B5CF6', // Purple
};

const getMarkerColor = (type: WaterwayType | LocationType): string => {
  return markerColors[type] || '#6B7280';
};

export default function MapScreen() {
  const { data: waterways, isLoading: waterwaysLoading, isError: waterwaysError } = useWaterways();
  const { data: locations, isLoading: locationsLoading, isError: locationsError } = useLocations();

  const [selectedMarker, setSelectedMarker] = useState<{
    id: string;
    type: MarkerType;
  } | null>(null);

  const bottomSheetRef = useRef<DetailBottomSheetRef>(null);
  const mapRef = useRef<MapView>(null);

  const isLoading = waterwaysLoading || locationsLoading;
  const isError = waterwaysError || locationsError;

  const handleCalloutPress = useCallback((id: string, type: MarkerType) => {
    setSelectedMarker({ id, type });
    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 100);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const renderWaterwayMarker = (waterway: Waterway) => (
    <Marker
      key={`waterway-${waterway.id}`}
      coordinate={{
        latitude: waterway.latitude,
        longitude: waterway.longitude,
      }}
      pinColor={getMarkerColor(waterway.type)}
      tracksViewChanges={false}
    >
      <Callout
        onPress={() => handleCalloutPress(waterway.id, 'waterway')}
        tooltip={false}
      >
        <View style={styles.calloutContainer}>
          <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(waterway.type) }]}>
            <Text style={styles.typeBadgeText}>
              {waterway.type === 'river' ? 'River' : waterway.type === 'lake' ? 'Lake' : 'Bay'}
            </Text>
          </View>
          <Text style={styles.calloutTitle}>{waterway.name}</Text>
          {waterway.indigenousName ? (
            <Text style={styles.calloutIndigenous}>"{waterway.indigenousName}"</Text>
          ) : null}
          <Text style={styles.calloutHint}>Tap for details</Text>
        </View>
      </Callout>
    </Marker>
  );

  const renderLocationMarker = (location: Location) => (
    <Marker
      key={`location-${location.id}`}
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}
      pinColor={getMarkerColor(location.type)}
      tracksViewChanges={false}
    >
      <Callout
        onPress={() => handleCalloutPress(location.id, 'location')}
        tooltip={false}
      >
        <View style={styles.calloutContainer}>
          <View style={[styles.typeBadge, { backgroundColor: getMarkerColor(location.type) }]}>
            <Text style={styles.typeBadgeText}>
              {location.type === 'fort'
                ? 'Historic Fort'
                : location.type === 'trading_post'
                ? 'Trading Post'
                : location.type === 'portage'
                ? 'Portage'
                : 'Settlement'}
            </Text>
          </View>
          <Text style={styles.calloutTitle}>{location.name}</Text>
          {location.indigenousName ? (
            <Text style={styles.calloutIndigenous}>"{location.indigenousName}"</Text>
          ) : null}
          <Text style={styles.calloutHint}>Tap for details</Text>
        </View>
      </Callout>
    </Marker>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2D5A3D" />
        <Text style={styles.loadingText}>Loading Canadian waterways...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Unable to Load Map Data</Text>
        <Text style={styles.errorText}>
          Please check your connection and try again.
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
      </MapView>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Map Legend</Text>
        <View style={styles.legendSection}>
          <Text style={styles.legendSectionTitle}>Waterways</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.river }]} />
            <Text style={styles.legendText}>River</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.lake }]} />
            <Text style={styles.legendText}>Lake</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.bay }]} />
            <Text style={styles.legendText}>Bay</Text>
          </View>
        </View>
        <View style={styles.legendSection}>
          <Text style={styles.legendSectionTitle}>Locations</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.fort }]} />
            <Text style={styles.legendText}>Fort</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.trading_post }]} />
            <Text style={styles.legendText}>Trading Post</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: markerColors.portage }]} />
            <Text style={styles.legendText}>Portage</Text>
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
