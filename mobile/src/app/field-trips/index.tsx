// Virtual Field Trips List Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Map, Clock, MapPin, ChevronRight, Filter } from 'lucide-react-native';
import { useFieldTrips } from '@/lib/api/education-api';
import { getGradeLevelRangeColor, getGradeLevelRangeLabel, GRADE_LEVEL_RANGES } from '@/lib/types/education';
import type { FieldTripSummary } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

export default function FieldTripsScreen() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>();

  const { data: fieldTrips, isLoading, isError } = useFieldTrips({
    gradeLevel: selectedGrade,
    theme: selectedTheme,
  });

  const renderFieldTripCard = ({ item }: { item: FieldTripSummary }) => (
    <Pressable
      style={({ pressed }) => [styles.tripCard, pressed && styles.cardPressed]}
      onPress={() => router.push(`/field-trips/${item.id}`)}
    >
      {item.coverImageUrl ? (
        <Image
          source={{ uri: item.coverImageUrl }}
          style={styles.tripImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.tripImage, styles.tripImagePlaceholder]}>
          <Map size={40} color="#D1D5DB" />
        </View>
      )}

      <View style={styles.tripContent}>
        <View style={styles.tripHeader}>
          <View
            style={[
              styles.gradeBadge,
              { backgroundColor: getGradeLevelRangeColor(item.gradeLevel) },
            ]}
          >
            <Text style={styles.gradeBadgeText}>
              {getGradeLevelRangeLabel(item.gradeLevel)}
            </Text>
          </View>
          {item.theme ? (
            <View style={styles.themeBadge}>
              <Text style={styles.themeText}>{item.theme}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.tripTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.tripDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.tripFooter}>
          <View style={styles.tripMeta}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.tripMetaText}>
              {item.stopCount} stop{item.stopCount !== 1 ? 's' : ''}
            </Text>
          </View>
          {item.estimatedMinutes ? (
            <View style={styles.tripMeta}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.tripMetaText}>
                {item.estimatedMinutes} min
              </Text>
            </View>
          ) : null}
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Virtual Field Trips',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.filterRow}>
          <Filter size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Grade:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.filterChips}
          >
            <Pressable
              style={[
                styles.filterChip,
                !selectedGrade && styles.filterChipActive,
              ]}
              onPress={() => setSelectedGrade(undefined)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedGrade && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {GRADE_LEVEL_RANGES.map((grade) => (
              <Pressable
                key={grade}
                style={[
                  styles.filterChip,
                  selectedGrade === grade && styles.filterChipActive,
                ]}
                onPress={() =>
                  setSelectedGrade(selectedGrade === grade ? undefined : grade)
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedGrade === grade && styles.filterChipTextActive,
                  ]}
                >
                  {grade}
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
          <Text style={styles.loadingText}>Loading field trips...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load field trips</Text>
        </View>
      ) : fieldTrips && fieldTrips.length > 0 ? (
        <FlatList
          data={fieldTrips}
          renderItem={renderFieldTripCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Map size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No field trips found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your filters
          </Text>
        </View>
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
    gap: 16,
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
  },
  tripImage: {
    width: '100%',
    height: 160,
  },
  tripImagePlaceholder: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripContent: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  themeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 6,
  },
  tripDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  tripFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripMetaText: {
    fontSize: 13,
    color: '#6B7280',
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
