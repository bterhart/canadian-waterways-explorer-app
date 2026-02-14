// Comparison Tools List Screen
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
import { useRouter, Stack } from 'expo-router';
import { GitCompare, ChevronRight, Filter } from 'lucide-react-native';
import { useComparisons, useComparisonTypes } from '@/lib/api/education-api';
import { getGradeLevelRangeColor, getGradeLevelRangeLabel, GRADE_LEVEL_RANGES } from '@/lib/types/education';
import type { ComparisonSummary } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const comparisonTypeColors: Record<string, string> = {
  explorers: '#3B82F6',
  forts: '#EF4444',
  waterways: '#06B6D4',
  nations: '#EC4899',
  trading_companies: '#F97316',
};

export default function ComparisonsScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();

  const { data: comparisons, isLoading, isError } = useComparisons({
    type: selectedType,
    gradeLevel: selectedGrade,
  });
  const { data: comparisonTypes } = useComparisonTypes();

  const renderComparisonCard = ({ item }: { item: ComparisonSummary }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/comparisons/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor:
                (comparisonTypeColors[item.comparisonType.toLowerCase()] ||
                  '#6B7280') + '20',
            },
          ]}
        >
          <GitCompare
            size={14}
            color={
              comparisonTypeColors[item.comparisonType.toLowerCase()] ||
              '#6B7280'
            }
          />
          <Text
            style={[
              styles.typeText,
              {
                color:
                  comparisonTypeColors[item.comparisonType.toLowerCase()] ||
                  '#6B7280',
              },
            ]}
          >
            {item.comparisonType.replace('_', ' ')}
          </Text>
        </View>
        {item.gradeLevel ? (
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
        ) : null}
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.description ? (
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <View style={styles.cardFooter}>
        <Text style={styles.viewText}>View Comparison</Text>
        <ChevronRight size={18} color={colors.forestGreen} />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Comparison Tools',
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
            {comparisonTypes?.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.filterChip,
                  selectedType === type && styles.filterChipActive,
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
                  {type.replace('_', ' ')}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterRow}>
          <GitCompare size={16} color="#6B7280" />
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
          <Text style={styles.loadingText}>Loading comparisons...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load comparisons</Text>
        </View>
      ) : comparisons && comparisons.length > 0 ? (
        <FlatList
          data={comparisons}
          renderItem={renderComparisonCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <GitCompare size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No comparisons found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
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
    textTransform: 'capitalize',
  },
  filterChipTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
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
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.forestGreen,
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
