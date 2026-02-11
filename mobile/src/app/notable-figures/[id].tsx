// Notable Figure Detail Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  User,
  Crown,
  Compass,
  Languages,
  Users,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  ChevronRight,
  Star,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotableFigure } from '@/lib/api/education-api';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  gold: '#C9A962',
};

// Figure type configurations
const figureTypeConfig: Record<
  string,
  { label: string; color: string; icon: typeof User; gradientColors: readonly [string, string] }
> = {
  woman: {
    label: 'Women',
    color: '#EC4899',
    icon: User,
    gradientColors: ['#EC4899', '#BE185D'] as const,
  },
  indigenous_leader: {
    label: 'Indigenous Leader',
    color: '#8B5CF6',
    icon: Crown,
    gradientColors: ['#8B5CF6', '#6D28D9'] as const,
  },
  guide: {
    label: 'Guide',
    color: '#10B981',
    icon: Compass,
    gradientColors: ['#10B981', '#047857'] as const,
  },
  interpreter: {
    label: 'Interpreter',
    color: '#3B82F6',
    icon: Languages,
    gradientColors: ['#3B82F6', '#1D4ED8'] as const,
  },
  trader: {
    label: 'Trader',
    color: '#F97316',
    icon: Users,
    gradientColors: ['#F97316', '#C2410C'] as const,
  },
};

function getTypeConfig(figureType: string) {
  return (
    figureTypeConfig[figureType] || {
      label: figureType,
      color: '#6B7280',
      icon: User,
      gradientColors: ['#6B7280', '#4B5563'] as const,
    }
  );
}

function formatYearRange(
  birthYear: number | null,
  deathYear: number | null
): string {
  if (birthYear && deathYear) {
    return `${birthYear} - ${deathYear}`;
  } else if (birthYear) {
    return `b. ${birthYear}`;
  } else if (deathYear) {
    return `d. ${deathYear}`;
  }
  return 'Dates unknown';
}

export default function NotableFigureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: figure, isLoading, isError } = useNotableFigure(id ?? null);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Loading...',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
          }}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading figure details...</Text>
        </View>
      </View>
    );
  }

  if (isError || !figure) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Error',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load figure details</Text>
        </View>
      </View>
    );
  }

  const config = getTypeConfig(figure.figureType);
  const IconComponent = config.icon;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: figure.name,
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <LinearGradient
          colors={config.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroHeader}>
            <View style={styles.heroIconContainer}>
              <IconComponent size={32} color="white" />
            </View>
            {figure.isFeatured ? (
              <View style={styles.featuredBadge}>
                <Star size={16} color="#FCD34D" fill="#FCD34D" />
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.heroName}>{figure.name}</Text>

          {figure.alternateNames ? (
            <Text style={styles.heroAltNames}>
              Also known as: {figure.alternateNames}
            </Text>
          ) : null}

          <View style={styles.heroMeta}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{config.label}</Text>
            </View>

            {figure.nation ? (
              <View style={styles.nationBadge}>
                <Text style={styles.nationBadgeText}>{figure.nation}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.heroRole}>{figure.role}</Text>

          <View style={styles.heroDetails}>
            <View style={styles.heroDetailItem}>
              <Calendar size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroDetailText}>
                {formatYearRange(figure.birthYear, figure.deathYear)}
              </Text>
            </View>

            {figure.birthPlace ? (
              <View style={styles.heroDetailItem}>
                <MapPin size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroDetailText}>{figure.birthPlace}</Text>
              </View>
            ) : null}

            {figure.activePeriodStart && figure.activePeriodEnd ? (
              <View style={styles.heroDetailItem}>
                <BookOpen size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroDetailText}>
                  Active: {figure.activePeriodStart} - {figure.activePeriodEnd}
                </Text>
              </View>
            ) : null}
          </View>
        </LinearGradient>

        {/* Biography Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biography</Text>
          <Text style={styles.biographyText}>{figure.biography}</Text>
        </View>

        {/* Historical Significance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historical Significance</Text>
          <View style={styles.significanceCard}>
            <Text style={styles.significanceText}>{figure.significance}</Text>
          </View>
        </View>

        {/* Achievements Section */}
        {figure.achievements && figure.achievements.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Achievements</Text>
            <View style={styles.achievementsList}>
              {figure.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <View style={styles.achievementBullet}>
                    <Award size={16} color={config.color} />
                  </View>
                  <Text style={styles.achievementText}>{achievement}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Associated Explorers Section */}
        {figure.associatedExplorers && figure.associatedExplorers.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Associated Explorers</Text>
            <View style={styles.explorersList}>
              {figure.associatedExplorers.map((explorer, index) => (
                <View key={index} style={styles.explorerCard}>
                  <View style={styles.explorerIcon}>
                    <Users size={20} color={colors.forestGreen} />
                  </View>
                  <View style={styles.explorerInfo}>
                    <Text style={styles.explorerName}>{explorer.name}</Text>
                    <Text style={styles.explorerRelationship}>
                      {explorer.relationship}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Associated Locations Section */}
        {figure.associatedLocations && figure.associatedLocations.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Associated Locations</Text>
            <View style={styles.locationsList}>
              {figure.associatedLocations.map((location, index) => (
                <View key={index} style={styles.locationChip}>
                  <MapPin size={14} color={colors.forestGreen} />
                  <Text style={styles.locationText}>{location}</Text>
                </View>
              ))}
            </View>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  heroSection: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  featuredText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  heroName: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  heroAltNames: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  nationBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nationBadgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  heroRole: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
    marginBottom: 16,
  },
  heroDetails: {
    gap: 8,
  },
  heroDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroDetailText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 12,
  },
  biographyText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  significanceCard: {
    backgroundColor: colors.forestGreen + '08',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.forestGreen,
  },
  significanceText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    paddingTop: 4,
  },
  explorersList: {
    gap: 10,
  },
  explorerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  explorerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  explorerInfo: {
    flex: 1,
  },
  explorerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  explorerRelationship: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  locationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.forestGreen + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: colors.forestGreen,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});
