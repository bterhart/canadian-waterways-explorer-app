// Notable Figures Screen - Women, Indigenous leaders, and important historical figures
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Stack, useRouter, Href } from 'expo-router';
import {
  Users,
  User,
  Crown,
  Compass,
  Languages,
  Star,
  ChevronRight,
  Filter,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useNotableFigures,
  useFeaturedNotableFigures,
  useNotableFigureTypes,
  useNotableFigureNations,
} from '@/lib/api/education-api';
import type { NotableFigureSummary } from '@/lib/types/education';

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
    label: 'Indigenous Leaders',
    color: '#8B5CF6',
    icon: Crown,
    gradientColors: ['#8B5CF6', '#6D28D9'] as const,
  },
  guide: {
    label: 'Guides',
    color: '#10B981',
    icon: Compass,
    gradientColors: ['#10B981', '#047857'] as const,
  },
  interpreter: {
    label: 'Interpreters',
    color: '#3B82F6',
    icon: Languages,
    gradientColors: ['#3B82F6', '#1D4ED8'] as const,
  },
  trader: {
    label: 'Traders',
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

interface FeaturedCardProps {
  figure: NotableFigureSummary;
  onPress: () => void;
}

function FeaturedCard({ figure, onPress }: FeaturedCardProps) {
  const config = getTypeConfig(figure.figureType);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.featuredCard,
        pressed && styles.cardPressed,
      ]}
    >
      <LinearGradient
        colors={config.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featuredCardGradient}
      >
        <View style={styles.featuredCardHeader}>
          <View style={styles.featuredIconContainer}>
            <config.icon size={24} color="white" />
          </View>
          <View style={styles.featuredStarBadge}>
            <Star size={14} color="#FCD34D" fill="#FCD34D" />
          </View>
        </View>

        <Text style={styles.featuredName} numberOfLines={1}>
          {figure.name}
        </Text>

        {figure.nation ? (
          <Text style={styles.featuredNation} numberOfLines={1}>
            {figure.nation}
          </Text>
        ) : null}

        <Text style={styles.featuredRole} numberOfLines={2}>
          {figure.role}
        </Text>

        <View style={styles.featuredFooter}>
          <Text style={styles.featuredYears}>
            {formatYearRange(figure.birthYear, figure.deathYear)}
          </Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.7)" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

interface FigureCardProps {
  figure: NotableFigureSummary;
  onPress: () => void;
}

function FigureCard({ figure, onPress }: FigureCardProps) {
  const config = getTypeConfig(figure.figureType);
  const IconComponent = config.icon;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardContent}>
        <View
          style={[styles.cardIcon, { backgroundColor: config.color + '20' }]}
        >
          <IconComponent size={24} color={config.color} />
        </View>

        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <View
              style={[styles.typeBadge, { backgroundColor: config.color + '15' }]}
            >
              <Text style={[styles.typeText, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
            {figure.isFeatured ? (
              <Star size={14} color={colors.gold} fill={colors.gold} />
            ) : null}
          </View>

          <Text style={styles.cardName} numberOfLines={1}>
            {figure.name}
          </Text>

          {figure.alternateNames ? (
            <Text style={styles.cardAltName} numberOfLines={1}>
              Also known as: {figure.alternateNames}
            </Text>
          ) : null}

          {figure.nation ? (
            <Text style={styles.cardNation} numberOfLines={1}>
              {figure.nation}
            </Text>
          ) : null}

          <Text style={styles.cardRole} numberOfLines={2}>
            {figure.role}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.cardYears}>
              {formatYearRange(figure.birthYear, figure.deathYear)}
            </Text>
            {figure.activePeriodStart && figure.activePeriodEnd ? (
              <Text style={styles.cardActivePeriod}>
                Active: {figure.activePeriodStart}-{figure.activePeriodEnd}
              </Text>
            ) : null}
          </View>
        </View>

        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </Pressable>
  );
}

export default function NotableFiguresScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedNation, setSelectedNation] = useState<string | undefined>();

  const { data: figures, isLoading, isError } = useNotableFigures({
    figureType: selectedType,
    nation: selectedNation,
  });
  const { data: featuredFigures } = useFeaturedNotableFigures();
  const { data: figureTypes } = useNotableFigureTypes();
  const { data: nations } = useNotableFigureNations();

  const navigateToDetail = (id: string) => {
    router.push(`/notable-figures/${id}` as Href);
  };

  // Filter out featured figures from main list if showing all
  const nonFeaturedFigures =
    !selectedType && !selectedNation && featuredFigures
      ? figures?.filter((f) => !f.isFeatured)
      : figures;

  const showFeaturedSection = !selectedType && !selectedNation && featuredFigures && featuredFigures.length > 0;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Notable Figures',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.filterRow}>
          <Filter size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Type:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.filterChips}
          >
            <Pressable
              style={[
                styles.filterChip,
                !selectedType && styles.filterChipActive,
              ]}
              onPress={() => setSelectedType(undefined)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedType && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {figureTypes?.map((type) => {
              const config = getTypeConfig(type);
              return (
                <Pressable
                  key={type}
                  style={[
                    styles.filterChip,
                    selectedType === type && {
                      backgroundColor: config.color,
                    },
                  ]}
                  onPress={() =>
                    setSelectedType(selectedType === type ? undefined : type)
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedType === type && styles.filterChipTextActive,
                    ]}
                  >
                    {config.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.filterRow}>
          <Users size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Nation:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.filterChips}
          >
            <Pressable
              style={[
                styles.filterChip,
                !selectedNation && styles.filterChipActive,
              ]}
              onPress={() => setSelectedNation(undefined)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedNation && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {nations?.map((nation) => (
              <Pressable
                key={nation}
                style={[
                  styles.filterChip,
                  selectedNation === nation && styles.filterChipActive,
                ]}
                onPress={() =>
                  setSelectedNation(selectedNation === nation ? undefined : nation)
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedNation === nation && styles.filterChipTextActive,
                  ]}
                >
                  {nation}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading notable figures...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load figures</Text>
        </View>
      ) : (
        <FlatList
          data={nonFeaturedFigures}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            showFeaturedSection ? (
              <View style={styles.featuredSection}>
                <Text style={styles.sectionTitle}>Featured Figures</Text>
                <Text style={styles.sectionSubtitle}>
                  Traders, guides, interpreters, Indigenous leaders, women, and others connected to Canadian history
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredScroll}
                >
                  {featuredFigures.map((figure) => (
                    <FeaturedCard
                      key={figure.id}
                      figure={figure}
                      onPress={() => navigateToDetail(figure.id)}
                    />
                  ))}
                </ScrollView>

                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                  All Figures
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <FigureCard
              figure={item}
              onPress={() => navigateToDetail(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Users size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No figures found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  filtersSection: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 8,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: colors.forestGreen,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  featuredSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  featuredScroll: {
    gap: 12,
  },
  featuredCard: {
    width: 200,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredCardGradient: {
    padding: 16,
    minHeight: 180,
  },
  featuredCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featuredIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredStarBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
  },
  featuredNation: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: 8,
  },
  featuredRole: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16,
    flex: 1,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  featuredYears: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 2,
  },
  cardAltName: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  cardNation: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  cardRole: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  cardYears: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  cardActivePeriod: {
    fontSize: 12,
    color: colors.forestGreen,
    fontWeight: '500',
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
