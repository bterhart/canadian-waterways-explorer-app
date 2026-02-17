// What Happened Here? - Location-based historical events discovery
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Dimensions,
  Alert,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import {
  MapPin,
  Navigation,
  Clock,
  ChevronRight,
  Map,
  AlertCircle,
  Compass,
  Star,
  Shield,
  Users,
  Anchor,
  FileText,
  Tent,
  RefreshCw,
  Info,
  X,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useNearbyHistoryEventsByCategory,
  useNearbyHistoryCategories,
} from '@/lib/api/education-api';
import type { HistoricalEvent, NearbyHistoryCategory } from '@/lib/types/education';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  gold: '#C9A962',
  lightGreen: '#E8F5E9',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  orange: '#F97316',
  red: '#EF4444',
  cyan: '#06B6D4',
};

// Radius options in km
const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

// Category icons and colors
const categoryConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  exploration: {
    icon: <Compass size={16} color="white" />,
    color: '#3B82F6',
    label: 'Exploration',
  },
  fur_trade: {
    icon: <Tent size={16} color="white" />,
    color: '#8B5CF6',
    label: 'Fur Trade',
  },
  indigenous: {
    icon: <Users size={16} color="white" />,
    color: '#059669',
    label: 'Indigenous',
  },
  settlement: {
    icon: <Shield size={16} color="white" />,
    color: '#F97316',
    label: 'Settlement',
  },
  battle: {
    icon: <AlertCircle size={16} color="white" />,
    color: '#EF4444',
    label: 'Battle',
  },
  treaty: {
    icon: <FileText size={16} color="white" />,
    color: '#06B6D4',
    label: 'Treaty',
  },
  maritime: {
    icon: <Anchor size={16} color="white" />,
    color: '#0EA5E9',
    label: 'Maritime',
  },
};

// Significance badge config
const significanceConfig: Record<string, { color: string; label: string }> = {
  major: { color: '#EAB308', label: 'Major Event' },
  normal: { color: '#6B7280', label: 'Notable' },
  minor: { color: '#9CA3AF', label: 'Minor' },
};

// Format distance for display
function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }
  return `${Math.round(distanceKm)} km`;
}

// Format date from year, month, day
function formatHistoricalDate(
  year: number,
  month?: number | null,
  day?: number | null
): string {
  if (month && day) {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  if (month) {
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short' });
  }
  return `${year}`;
}

// Event card component
function EventCard({
  event,
  isClosest,
  onPress,
}: {
  event: HistoricalEvent;
  isClosest: boolean;
  onPress: () => void;
}) {
  const category = categoryConfig[event.category] || {
    icon: <MapPin size={16} color="white" />,
    color: '#6B7280',
    label: event.category,
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.eventCard,
        isClosest && styles.eventCardClosest,
        pressed && styles.cardPressed,
      ]}
    >
      {isClosest ? (
        <LinearGradient
          colors={[colors.forestGreen, colors.darkGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.closestBanner}
        >
          <Star size={14} color="#F59E0B" />
          <Text style={styles.closestBannerText}>Nearest Historical Event</Text>
        </LinearGradient>
      ) : null}

      <View style={styles.eventCardContent}>
        {/* Header with category and distance */}
        <View style={styles.eventHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
            {category.icon}
            <Text style={styles.categoryText}>{category.label}</Text>
          </View>
          <View style={styles.distanceBadge}>
            <Navigation size={12} color={colors.forestGreen} />
            <Text style={styles.distanceText}>
              {event.distance !== undefined ? formatDistance(event.distance) : 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.eventTitle}>{event.title}</Text>

        {/* Description */}
        {event.description ? (
          <Text style={styles.eventDescription} numberOfLines={3}>
            {event.description}
          </Text>
        ) : null}

        {/* Meta info row */}
        <View style={styles.eventMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.metaText}>
              {formatHistoricalDate(event.year, event.month, event.day)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.eventFooter}>
          <Pressable style={styles.viewMapButton} onPress={onPress}>
            <Map size={16} color={colors.forestGreen} />
            <Text style={styles.viewMapText}>View on Map</Text>
          </Pressable>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
      </View>
    </Pressable>
  );
}

// Closest event highlight component
function ClosestEventHighlight({
  event,
  onPress,
}: {
  event: HistoricalEvent;
  onPress: () => void;
}) {
  const distanceText =
    event.distance !== undefined ? formatDistance(event.distance) : 'nearby';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.cardPressed}>
      <LinearGradient
        colors={['#2D5A3D', '#1A3A24']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.highlightCard}
      >
        <View style={styles.highlightIconContainer}>
          <Star size={32} color="#F59E0B" />
        </View>

        <Text style={styles.highlightLabel}>You are {distanceText} from where...</Text>
        <Text style={styles.highlightTitle}>{event.title}</Text>
        <Text style={styles.highlightYear}>
          {formatHistoricalDate(event.year, event.month, event.day)}
        </Text>

        <View style={styles.highlightAction}>
          <Text style={styles.highlightActionText}>Tap to learn more</Text>
          <ChevronRight size={16} color="rgba(255,255,255,0.8)" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// Location permission denied view
function LocationPermissionDenied({ onRetry }: { onRetry: () => void }) {
  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View style={styles.centerContainer}>
      <View style={styles.permissionIconContainer}>
        <MapPin size={48} color="#9CA3AF" />
      </View>
      <Text style={styles.permissionTitle}>Location Access Required</Text>
      <Text style={styles.permissionDescription}>
        To discover historical events near you, please allow location access in your device
        settings.
      </Text>
      <View style={styles.permissionButtons}>
        <Pressable style={styles.settingsButton} onPress={openSettings}>
          <Text style={styles.settingsButtonText}>Open Settings</Text>
        </Pressable>
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <RefreshCw size={16} color={colors.forestGreen} />
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Empty state component
function EmptyState({ radius }: { radius: number }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MapPin size={48} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>No Historical Events Nearby</Text>
      <Text style={styles.emptyDescription}>
        No recorded historical events were found within {radius} km of your location. Try
        increasing the search radius or explore a different area.
      </Text>
    </View>
  );
}

export default function NearbyHistoryScreen() {
  const router = useRouter();

  // Location state
  const [locationStatus, setLocationStatus] = useState<
    'loading' | 'granted' | 'denied' | 'error'
  >('loading');
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Filter state
  const [selectedRadius, setSelectedRadius] = useState(50);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selected event for modal
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);

  // Fetch categories
  const { data: categories } = useNearbyHistoryCategories();

  // Fetch nearby events
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    isError: isEventsError,
    refetch: refetchEvents,
  } = useNearbyHistoryEventsByCategory(
    userLocation?.latitude ?? null,
    userLocation?.longitude ?? null,
    selectedRadius,
    selectedCategory
  );

  // Request location permission and get location
  const requestLocation = useCallback(async () => {
    setLocationStatus('loading');
    setLocationError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationStatus('denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLocationStatus('granted');
    } catch (error) {
      console.error('Location error:', error);
      setLocationError('Unable to get your location. Please try again.');
      setLocationStatus('error');
    }
  }, []);

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await requestLocation();
    if (userLocation) {
      await refetchEvents();
    }
    setIsRefreshing(false);
  }, [requestLocation, refetchEvents, userLocation]);

  // Handle event press - show details modal
  const handleEventPress = (event: HistoricalEvent) => {
    setSelectedEvent(event);
  };

  // Handle view on map press
  const handleViewOnMap = (event: HistoricalEvent) => {
    setSelectedEvent(null);
    router.push(`/?lat=${event.latitude}&lng=${event.longitude}&eventId=${event.id}`);
  };

  // Get sorted events (closest first)
  const sortedEvents = eventsData?.events
    ?.slice()
    .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  const closestEvent = sortedEvents?.[0];
  const otherEvents = sortedEvents?.slice(1);

  // Render loading state
  if (locationStatus === 'loading') {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'What Happened Here?',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
          }}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </View>
    );
  }

  // Render permission denied state
  if (locationStatus === 'denied') {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'What Happened Here?',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
          }}
        />
        <LocationPermissionDenied onRetry={requestLocation} />
      </View>
    );
  }

  // Render error state
  if (locationStatus === 'error') {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'What Happened Here?',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
          }}
        />
        <View style={styles.centerContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Location Error</Text>
          <Text style={styles.errorDescription}>{locationError}</Text>
          <Pressable style={styles.retryButtonLarge} onPress={requestLocation}>
            <RefreshCw size={20} color="white" />
            <Text style={styles.retryButtonLargeText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'What Happened Here?',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Current Location Display */}
      <View style={styles.locationBar}>
        <View style={styles.locationInfo}>
          <MapPin size={16} color={colors.forestGreen} />
          <Text style={styles.locationText}>
            {userLocation
              ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
              : 'Location unavailable'}
          </Text>
        </View>
        <Pressable style={styles.refreshLocationButton} onPress={requestLocation}>
          <RefreshCw size={16} color={colors.forestGreen} />
        </Pressable>
      </View>

      {/* Radius Selector */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Search Radius:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={styles.filterChips}
        >
          {RADIUS_OPTIONS.map((radius) => (
            <Pressable
              key={radius}
              style={[
                styles.radiusChip,
                selectedRadius === radius && styles.radiusChipActive,
              ]}
              onPress={() => setSelectedRadius(radius)}
            >
              <Text
                style={[
                  styles.radiusChipText,
                  selectedRadius === radius && styles.radiusChipTextActive,
                ]}
              >
                {radius} km
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Category:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={styles.filterChips}
        >
          <Pressable
            style={[
              styles.categoryChip,
              !selectedCategory && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(undefined)}
          >
            <Text
              style={[
                styles.categoryChipText,
                !selectedCategory && styles.categoryChipTextActive,
              ]}
            >
              All
            </Text>
          </Pressable>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <Pressable
              key={key}
              style={[
                styles.categoryChip,
                selectedCategory === key && styles.categoryChipActive,
                selectedCategory === key && { backgroundColor: config.color },
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === key ? undefined : key)
              }
            >
              {selectedCategory === key ? config.icon : null}
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === key && styles.categoryChipTextActive,
                ]}
              >
                {config.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {isLoadingEvents ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Discovering history nearby...</Text>
        </View>
      ) : isEventsError ? (
        <View style={styles.centerContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Unable to load events</Text>
          <Text style={styles.errorDescription}>
            Please check your connection and try again.
          </Text>
          <Pressable style={styles.retryButtonLarge} onPress={() => refetchEvents()}>
            <RefreshCw size={20} color="white" />
            <Text style={styles.retryButtonLargeText}>Retry</Text>
          </Pressable>
        </View>
      ) : !sortedEvents || sortedEvents.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.forestGreen]}
              tintColor={colors.forestGreen}
            />
          }
        >
          <EmptyState radius={selectedRadius} />
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.eventsList}
          contentContainerStyle={styles.eventsListContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.forestGreen]}
              tintColor={colors.forestGreen}
            />
          }
        >
          {/* Results count */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {eventsData?.totalFound ?? sortedEvents.length} event
              {(eventsData?.totalFound ?? sortedEvents.length) !== 1 ? 's' : ''} found within{' '}
              {selectedRadius} km
            </Text>
          </View>

          {/* Closest Event Highlight */}
          {closestEvent ? (
            <View style={styles.highlightSection}>
              <ClosestEventHighlight
                event={closestEvent}
                onPress={() => handleEventPress(closestEvent)}
              />
            </View>
          ) : null}

          {/* Other Events */}
          {otherEvents && otherEvents.length > 0 ? (
            <View style={styles.otherEventsSection}>
              <Text style={styles.sectionTitle}>More Nearby Events</Text>
              {otherEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isClosest={false}
                  onPress={() => handleEventPress(event)}
                />
              ))}
            </View>
          ) : null}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* Event Detail Modal */}
      <Modal
        visible={selectedEvent !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedEvent(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setSelectedEvent(null)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {selectedEvent?.title}
              </Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setSelectedEvent(null)}
              >
                <X size={20} color="#6B7280" />
              </Pressable>
            </View>
            <ScrollView
              style={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedEvent ? (
                <>
                  {/* Category and Distance */}
                  <View style={styles.modalMetaRow}>
                    <View
                      style={[
                        styles.categoryBadge,
                        {
                          backgroundColor:
                            categoryConfig[selectedEvent.category]?.color || '#6B7280',
                        },
                      ]}
                    >
                      {categoryConfig[selectedEvent.category]?.icon || (
                        <MapPin size={16} color="white" />
                      )}
                      <Text style={styles.categoryText}>
                        {categoryConfig[selectedEvent.category]?.label ||
                          selectedEvent.category}
                      </Text>
                    </View>
                    {selectedEvent.distance !== undefined ? (
                      <View style={styles.distanceBadge}>
                        <Navigation size={12} color={colors.forestGreen} />
                        <Text style={styles.distanceText}>
                          {formatDistance(selectedEvent.distance)}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Date */}
                  <View style={styles.modalDateRow}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.modalDateText}>
                      {formatHistoricalDate(
                        selectedEvent.year,
                        selectedEvent.month,
                        selectedEvent.day
                      )}
                    </Text>
                  </View>

                  {/* Description */}
                  {selectedEvent.description ? (
                    <Text style={styles.modalDescription}>
                      {selectedEvent.description}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.modalDescription,
                        { color: '#9CA3AF', fontStyle: 'italic' },
                      ]}
                    >
                      No additional details available for this event.
                    </Text>
                  )}

                  {/* View on Map Button */}
                  <Pressable
                    style={styles.viewOnMapButton}
                    onPress={() => handleViewOnMap(selectedEvent)}
                  >
                    <Map size={20} color="white" />
                    <Text style={styles.viewOnMapButtonText}>View on Map</Text>
                  </Pressable>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Location bar
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  refreshLocationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.forestGreen + '15',
  },

  // Filters
  filterSection: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  radiusChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  radiusChipActive: {
    backgroundColor: colors.forestGreen,
  },
  radiusChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  radiusChipTextActive: {
    color: 'white',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryChipActive: {
    backgroundColor: colors.forestGreen,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: 'white',
  },

  // Results
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Highlight section
  highlightSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  highlightCard: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  highlightIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  highlightLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
  },
  highlightTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
    lineHeight: 28,
  },
  highlightYear: {
    fontSize: 15,
    color: colors.gold,
    fontWeight: '600',
    marginBottom: 16,
  },
  highlightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  highlightActionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },

  // Events list
  eventsList: {
    flex: 1,
  },
  eventsListContent: {
    paddingTop: 4,
  },
  scrollContent: {
    flexGrow: 1,
  },
  otherEventsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 12,
  },

  // Event card
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  eventCardClosest: {
    borderWidth: 2,
    borderColor: colors.gold,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  closestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  closestBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  eventCardContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.forestGreen + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 8,
    lineHeight: 24,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewMapText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.forestGreen,
  },

  // Permission denied
  permissionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  settingsButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.forestGreen,
  },
  settingsButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.forestGreen + '15',
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.forestGreen,
  },

  // Error state
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.forestGreen,
  },
  retryButtonLargeText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },

  bottomSpacer: {
    height: 32,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
    flex: 1,
    marginRight: 12,
  },
  modalScrollContent: {
    padding: 16,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalDateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  modalDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  viewOnMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  viewOnMapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
