// Voyageur Journey List Screen - Adventure simulator for Canadian waterway exploration
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { Stack, useRouter, type Href } from 'expo-router';
import {
  Compass,
  MapPin,
  Clock,
  GraduationCap,
  ChevronRight,
  Ship,
  Mountain,
  Waves,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useVoyageurJourneys } from '@/lib/api/education-api';
import type { VoyageurJourneySummary } from '@/lib/types/education';

const { width } = Dimensions.get('window');

// Theme colors - wilderness/canoe adventure themed
const colors = {
  deepWater: '#1E3A5F',
  forestGreen: '#2D5A3D',
  sunsetOrange: '#D97706',
  creamWhite: '#FFFEF7',
  birchBark: '#F5F0E6',
  darkPine: '#1A3A24',
  goldAccent: '#C9A962',
  riverBlue: '#3B82F6',
};

// Get difficulty badge color
function getDifficultyColor(difficulty: string | null): string {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return '#10B981';
    case 'medium':
      return '#F59E0B';
    case 'hard':
      return '#EF4444';
    default:
      return '#6B7280';
  }
}

// Get difficulty label
function getDifficultyLabel(difficulty: string | null): string {
  if (!difficulty) return 'Moderate';
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

interface JourneyCardProps {
  journey: VoyageurJourneySummary;
  onPress: () => void;
}

function JourneyCard({ journey, onPress }: JourneyCardProps) {
  const difficultyColor = getDifficultyColor(journey.difficulty);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.journeyCard,
        pressed && styles.journeyCardPressed,
      ]}
    >
      {/* Cover image or gradient background */}
      {journey.coverImageUrl ? (
        <Image
          source={{ uri: journey.coverImageUrl }}
          style={styles.journeyCoverImage}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={['#1E3A5F', '#2D5A3D'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.journeyCoverGradient}
        >
          <View style={styles.coverIconsContainer}>
            <Ship size={32} color="rgba(255,255,255,0.3)" />
            <Waves size={28} color="rgba(255,255,255,0.25)" style={{ marginLeft: -8 }} />
          </View>
        </LinearGradient>
      )}

      {/* Difficulty badge */}
      <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
        <Text style={styles.difficultyText}>{getDifficultyLabel(journey.difficulty)}</Text>
      </View>

      {/* Historical year badge */}
      {journey.historicalYear ? (
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>{journey.historicalYear}</Text>
        </View>
      ) : null}

      {/* Content */}
      <View style={styles.journeyContent}>
        <Text style={styles.journeyTitle} numberOfLines={2}>
          {journey.title}
        </Text>

        {journey.description ? (
          <Text style={styles.journeyDescription} numberOfLines={2}>
            {journey.description}
          </Text>
        ) : null}

        {/* Route info */}
        <View style={styles.routeInfo}>
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.forestGreen} />
            <Text style={styles.locationText} numberOfLines={1}>
              {journey.startingLocation || 'Unknown'}
              {journey.endingLocation ? ` to ${journey.endingLocation}` : ''}
            </Text>
          </View>
        </View>

        {/* Meta info row */}
        <View style={styles.metaRow}>
          {journey.gradeLevel ? (
            <View style={styles.metaItem}>
              <GraduationCap size={14} color="#6B7280" />
              <Text style={styles.metaText}>Grade {journey.gradeLevel}</Text>
            </View>
          ) : null}
          {journey.estimatedMinutes ? (
            <View style={styles.metaItem}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.metaText}>{journey.estimatedMinutes} min</Text>
            </View>
          ) : null}
          {journey.nodeCount > 0 ? (
            <View style={styles.metaItem}>
              <Compass size={14} color="#6B7280" />
              <Text style={styles.metaText}>{journey.nodeCount} stops</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Arrow indicator */}
      <View style={styles.cardArrow}>
        <ChevronRight size={24} color={colors.forestGreen} />
      </View>
    </Pressable>
  );
}

export default function VoyageurJourneyListScreen() {
  const router = useRouter();
  const { data: journeys, isLoading, error, refetch } = useVoyageurJourneys();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Voyageur Adventures',
          headerStyle: { backgroundColor: colors.creamWhite },
          headerTintColor: colors.darkPine,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#1E3A5F', '#2D5A3D', '#1A3A24'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroIconContainer}>
              <Ship size={40} color="white" />
            </View>
            <Text style={styles.heroTitle}>Voyageur Adventures</Text>
            <Text style={styles.heroSubtitle}>
              Embark on interactive journeys through Canadian waterways.
              Make choices, face challenges, and learn history along the way.
            </Text>
          </View>

          {/* Decorative elements */}
          <View style={styles.heroDecoration}>
            <Mountain size={60} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', left: 20, bottom: 10 }} />
            <Waves size={50} color="rgba(255,255,255,0.15)" style={{ position: 'absolute', right: 30, bottom: 20 }} />
          </View>
        </LinearGradient>

        {/* Journey List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Available Journeys</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.forestGreen} />
              <Text style={styles.loadingText}>Loading adventures...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Unable to Load Journeys</Text>
              <Text style={styles.errorText}>Please check your connection and try again.</Text>
              <Pressable style={styles.retryButton} onPress={() => refetch()}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          ) : journeys && journeys.length > 0 ? (
            <View style={styles.journeysList}>
              {journeys.map((journey) => (
                <JourneyCard
                  key={journey.id}
                  journey={journey}
                  onPress={() => router.push(`/voyageur-journey/${journey.id}` as Href)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ship size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No Journeys Available</Text>
              <Text style={styles.emptyText}>
                Check back soon for new voyageur adventures!
              </Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Voyageur Journeys</Text>
          <Text style={styles.infoText}>
            These interactive simulations let you experience life as a voyageur -
            the brave paddlers who transported furs and goods across Canada's waterways.
            Navigate rivers, make important decisions, and learn about the history and
            geography of Canada's fur trade era.
          </Text>
          <View style={styles.infoFeatures}>
            <View style={styles.infoFeature}>
              <Compass size={20} color={colors.forestGreen} />
              <Text style={styles.infoFeatureText}>Make choices that affect your journey</Text>
            </View>
            <View style={styles.infoFeature}>
              <MapPin size={20} color={colors.forestGreen} />
              <Text style={styles.infoFeatureText}>Explore real historical locations</Text>
            </View>
            <View style={styles.infoFeature}>
              <GraduationCap size={20} color={colors.forestGreen} />
              <Text style={styles.infoFeatureText}>Learn through immersive storytelling</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  heroSection: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  heroIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  heroDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  listSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkPine,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.forestGreen,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  journeysList: {
    gap: 16,
  },
  journeyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  journeyCardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  journeyCoverImage: {
    width: '100%',
    height: 140,
  },
  journeyCoverGradient: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  yearBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  journeyContent: {
    padding: 16,
  },
  journeyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkPine,
    marginBottom: 6,
  },
  journeyDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  routeInfo: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: colors.forestGreen,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: 40,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoSection: {
    margin: 20,
    marginTop: 8,
    padding: 20,
    backgroundColor: colors.birchBark,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkPine,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
    marginBottom: 16,
  },
  infoFeatures: {
    gap: 10,
  },
  infoFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoFeatureText: {
    fontSize: 14,
    color: '#374151',
  },
  bottomSpacer: {
    height: 32,
  },
});
