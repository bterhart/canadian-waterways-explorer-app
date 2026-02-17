// Deep Dives Screen - Educational content for general users
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
import { BookOpen, Clock, ChevronRight, Filter } from 'lucide-react-native';
import { useLessonPlans } from '@/lib/api/education-api';
import { getGradeLevelRangeColor, getGradeLevelRangeLabel, GRADE_LEVEL_RANGES } from '@/lib/types/education';
import type { LessonPlanSummary } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

// Topics that exist in the database
const TOPICS = [
  'Fur Trade',
  'Geography',
  'Indigenous Routes',
  'Maritime Discovery',
  'Metis History',
  'Women in History',
  'Cartography',
  'Early Explorers',
];

export default function DeepDivesScreen() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();

  const { data: lessonPlans, isLoading, isError } = useLessonPlans({
    gradeLevel: selectedGrade,
    topic: selectedTopic,
  });

  const renderLessonCard = ({ item }: { item: LessonPlanSummary }) => (
    <Pressable
      style={({ pressed }) => [styles.lessonCard, pressed && styles.cardPressed]}
      onPress={() => router.push(`/lessons/${item.id}`)}
    >
      <View style={styles.cardHeader}>
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
        {item.estimatedMinutes ? (
          <View style={styles.durationBadge}>
            <Clock size={12} color="#6B7280" />
            <Text style={styles.durationText}>{item.estimatedMinutes} min</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.lessonTitle}>{item.title}</Text>
      {item.description ? (
        <Text style={styles.lessonDescription} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <View style={styles.cardFooter}>
        <View style={styles.topicBadge}>
          <Text style={styles.topicText}>{item.topic}</Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Deep Dives',
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

        <View style={styles.filterRow}>
          <BookOpen size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Topic:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.filterChips}
          >
            <Pressable
              style={[
                styles.filterChip,
                !selectedTopic && styles.filterChipActive,
              ]}
              onPress={() => setSelectedTopic(undefined)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedTopic && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {TOPICS.map((topic) => (
              <Pressable
                key={topic}
                style={[
                  styles.filterChip,
                  selectedTopic === topic && styles.filterChipActive,
                ]}
                onPress={() =>
                  setSelectedTopic(selectedTopic === topic ? undefined : topic)
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedTopic === topic && styles.filterChipTextActive,
                  ]}
                >
                  {topic}
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
          <Text style={styles.loadingText}>Loading deep dives...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load deep dives</Text>
        </View>
      ) : lessonPlans && lessonPlans.length > 0 ? (
        <FlatList
          data={lessonPlans}
          renderItem={renderLessonCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <BookOpen size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No deep dives found</Text>
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
    gap: 12,
  },
  lessonCard: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 6,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topicText: {
    fontSize: 12,
    fontWeight: '500',
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
