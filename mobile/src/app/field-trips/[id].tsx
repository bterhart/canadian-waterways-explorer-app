// Virtual Field Trip Detail Screen
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import {
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
} from 'lucide-react-native';
import { useFieldTrip } from '@/lib/api/education-api';
import { getGradeLevelColor, getGradeLevelLabel } from '@/lib/types/education';
import type { FieldTripStop } from '@/lib/types/education';

const { width } = Dimensions.get('window');

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

export default function FieldTripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: fieldTrip, isLoading, isError } = useFieldTrip(id ?? null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const mapRef = useRef<MapView>(null);

  const currentStop: FieldTripStop | undefined = fieldTrip?.stops[currentStopIndex];
  const totalStops = fieldTrip?.stops.length ?? 0;

  const goToStop = (index: number) => {
    if (index >= 0 && index < totalStops) {
      setCurrentStopIndex(index);
      const stop = fieldTrip?.stops[index];
      if (stop?.latitude && stop?.longitude && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: stop.latitude,
            longitude: stop.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          },
          500
        );
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  if (isError || !fieldTrip) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Unable to load field trip</Text>
      </View>
    );
  }

  // Calculate map region to show all stops
  const stopsWithCoords = fieldTrip.stops.filter(
    (s) => s.latitude && s.longitude
  );
  const initialRegion =
    stopsWithCoords.length > 0
      ? {
          latitude:
            stopsWithCoords.reduce((sum, s) => sum + (s.latitude ?? 0), 0) /
            stopsWithCoords.length,
          longitude:
            stopsWithCoords.reduce((sum, s) => sum + (s.longitude ?? 0), 0) /
            stopsWithCoords.length,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }
      : {
          latitude: 56.1304,
          longitude: -106.3468,
          latitudeDelta: 30,
          longitudeDelta: 30,
        };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: fieldTrip.title,
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={initialRegion}
          mapType="terrain"
        >
          {fieldTrip.stops.map((stop, index) =>
            stop.latitude && stop.longitude ? (
              <Marker
                key={stop.id}
                coordinate={{
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }}
                pinColor={
                  index === currentStopIndex ? colors.forestGreen : '#6B7280'
                }
                onPress={() => goToStop(index)}
              />
            ) : null
          )}
        </MapView>

        {/* Trip info overlay */}
        <View style={styles.tripInfoOverlay}>
          <View
            style={[
              styles.gradeBadge,
              { backgroundColor: getGradeLevelColor(fieldTrip.gradeLevel) },
            ]}
          >
            <Text style={styles.gradeBadgeText}>
              {getGradeLevelLabel(fieldTrip.gradeLevel)}
            </Text>
          </View>
          {fieldTrip.estimatedMinutes ? (
            <View style={styles.durationBadge}>
              <Clock size={12} color="white" />
              <Text style={styles.durationText}>
                {fieldTrip.estimatedMinutes} min
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Stop Navigation */}
      <View style={styles.stopNavigation}>
        <Pressable
          style={[
            styles.navButton,
            currentStopIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={() => goToStop(currentStopIndex - 1)}
          disabled={currentStopIndex === 0}
        >
          <ChevronLeft
            size={24}
            color={currentStopIndex === 0 ? '#D1D5DB' : colors.forestGreen}
          />
        </Pressable>

        <View style={styles.stopIndicators}>
          {fieldTrip.stops.map((_, index) => (
            <Pressable
              key={index}
              style={[
                styles.stopDot,
                index === currentStopIndex && styles.stopDotActive,
              ]}
              onPress={() => goToStop(index)}
            />
          ))}
        </View>

        <Pressable
          style={[
            styles.navButton,
            currentStopIndex === totalStops - 1 && styles.navButtonDisabled,
          ]}
          onPress={() => goToStop(currentStopIndex + 1)}
          disabled={currentStopIndex === totalStops - 1}
        >
          <ChevronRight
            size={24}
            color={
              currentStopIndex === totalStops - 1
                ? '#D1D5DB'
                : colors.forestGreen
            }
          />
        </Pressable>
      </View>

      {/* Current Stop Content */}
      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        {/* Introduction (only at start) */}
        {currentStopIndex === 0 && fieldTrip.introduction ? (
          <View style={styles.introSection}>
            <View style={styles.introHeader}>
              <Play size={16} color={colors.forestGreen} />
              <Text style={styles.introLabel}>Introduction</Text>
            </View>
            <Text style={styles.introText}>{fieldTrip.introduction}</Text>
          </View>
        ) : null}

        {/* Stop Card */}
        {currentStop ? (
          <View style={styles.stopCard}>
            <View style={styles.stopHeader}>
              <View style={styles.stopNumber}>
                <Text style={styles.stopNumberText}>
                  {currentStopIndex + 1}
                </Text>
              </View>
              <View style={styles.stopTitleContainer}>
                <Text style={styles.stopTitle}>{currentStop.title}</Text>
                <Text style={styles.stopProgress}>
                  Stop {currentStopIndex + 1} of {totalStops}
                </Text>
              </View>
            </View>

            {currentStop.imageUrl ? (
              <Image
                source={{ uri: currentStop.imageUrl }}
                style={styles.stopImage}
                resizeMode="cover"
              />
            ) : null}

            {currentStop.description ? (
              <Text style={styles.stopDescription}>
                {currentStop.description}
              </Text>
            ) : null}

            {currentStop.narrative ? (
              <View style={styles.narrativeSection}>
                <Text style={styles.narrativeLabel}>Learn More</Text>
                <Text style={styles.narrativeText}>{currentStop.narrative}</Text>
              </View>
            ) : null}

            {currentStop.audioUrl ? (
              <Pressable style={styles.audioButton}>
                <Volume2 size={20} color="white" />
                <Text style={styles.audioButtonText}>Listen to Audio Guide</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {/* Conclusion (only at end) */}
        {currentStopIndex === totalStops - 1 && fieldTrip.conclusion ? (
          <View style={styles.conclusionSection}>
            <Text style={styles.conclusionLabel}>Conclusion</Text>
            <Text style={styles.conclusionText}>{fieldTrip.conclusion}</Text>
          </View>
        ) : null}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.creamWhite,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  mapContainer: {
    height: 220,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  tripInfoOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  gradeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  stopNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#F9FAFB',
  },
  stopIndicators: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
  },
  stopDotActive: {
    backgroundColor: colors.forestGreen,
    width: 24,
    borderRadius: 5,
  },
  contentScroll: {
    flex: 1,
  },
  introSection: {
    backgroundColor: colors.forestGreen + '10',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  introLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  introText: {
    fontSize: 14,
    color: colors.darkGreen,
    lineHeight: 21,
  },
  stopCard: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  stopNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.forestGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  stopTitleContainer: {
    flex: 1,
  },
  stopTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  stopProgress: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  stopImage: {
    width: '100%',
    height: 180,
  },
  stopDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 23,
    padding: 16,
    paddingTop: 12,
  },
  narrativeSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  narrativeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  narrativeText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    margin: 16,
    marginTop: 0,
    padding: 14,
    borderRadius: 12,
  },
  audioButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  conclusionSection: {
    backgroundColor: '#FEF3C7',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
  },
  conclusionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  conclusionText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 21,
  },
  bottomSpacer: {
    height: 32,
  },
});
