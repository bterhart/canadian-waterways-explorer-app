// Teacher Portal - Lesson Plans List Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { BookOpen, Clock, ChevronRight, Filter, MapPin, Search } from 'lucide-react-native';
import { useLessonPlans, useCurriculumSummary, useCurriculumOutcomes } from '@/lib/api/education-api';
import { getGradeLevelRangeColor, getGradeLevelRangeLabel, GRADE_LEVEL_RANGES } from '@/lib/types/education';
import type { LessonPlanSummary, CurriculumOutcome } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

// Topics that match actual database values
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

export default function TeacherLessonPlansScreen() {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  // Curriculum alignment (roadmap item 9): a province chip narrows to lessons meeting that
  // province's outcomes; a code or keyword finds outcomes, and choosing one narrows to its lessons.
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
  const [outcomeQuery, setOutcomeQuery] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<CurriculumOutcome | undefined>();
  const { data: curriculum } = useCurriculumSummary();
  const { data: outcomeMatches } = useCurriculumOutcomes(
    { province: selectedProvince, q: outcomeQuery.trim() },
    outcomeQuery.trim().length >= 2 && !selectedOutcome
  );

  const { data: lessonPlans, isLoading, isError } = useLessonPlans({
    gradeLevel: selectedGrade,
    topic: selectedTopic,
    province: selectedProvince,
    outcome: selectedOutcome?.id,
  });

  const renderLessonCard = ({ item }: { item: LessonPlanSummary }) => (
    <Pressable
      style={styles.lessonCard}
      onPress={() => router.push(`/teacher/lesson-plan/${item.id}`)}
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
          title: 'Lesson Plans',
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

        {/* Curriculum (item 9): province chips, then an outcome by code or keyword */}
        {curriculum && curriculum.length > 0 ? (
          <View style={styles.filterRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.filterLabel}>Province:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={styles.filterChips}>
              <Pressable style={[styles.filterChip, !selectedProvince && styles.filterChipActive]} onPress={() => { setSelectedProvince(undefined); setSelectedOutcome(undefined); }}>
                <Text style={[styles.filterChipText, !selectedProvince && styles.filterChipTextActive]}>All</Text>
              </Pressable>
              {curriculum.map((p) => (
                <Pressable
                  key={p.province}
                  style={[styles.filterChip, selectedProvince === p.province && styles.filterChipActive]}
                  onPress={() => { setSelectedProvince(selectedProvince === p.province ? undefined : p.province); setSelectedOutcome(undefined); }}
                >
                  <Text style={[styles.filterChipText, selectedProvince === p.province && styles.filterChipTextActive]}>{p.provinceName}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
        {curriculum && curriculum.length > 0 ? (
          <View style={styles.outcomeSearch}>
            <View style={styles.outcomeInputRow}>
              <Search size={16} color="#6B7280" />
              <TextInput
                style={styles.outcomeInput}
                placeholder="Outcome code or keyword (e.g. A3.1, fur trade)"
                placeholderTextColor="#9CA3AF"
                value={selectedOutcome ? `${selectedOutcome.code ? selectedOutcome.code + ' · ' : ''}${selectedOutcome.provinceName} ${selectedOutcome.grade}` : outcomeQuery}
                onChangeText={(v) => { setSelectedOutcome(undefined); setOutcomeQuery(v); }}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
              {selectedOutcome ? (
                <Pressable onPress={() => { setSelectedOutcome(undefined); setOutcomeQuery(''); }} hitSlop={8}>
                  <Text style={styles.outcomeClear}>Clear</Text>
                </Pressable>
              ) : null}
            </View>
            {!selectedOutcome && outcomeMatches && outcomeMatches.length > 0 ? (
              <View style={styles.outcomeMatches}>
                {outcomeMatches.slice(0, 6).map((o) => (
                  <Pressable key={o.id} style={styles.outcomeMatch} onPress={() => setSelectedOutcome(o)}>
                    <Text style={styles.outcomeMatchHead}>
                      {o.provinceName} · {o.grade}{o.code ? ` · ${o.code}` : ''}{o.lessonCount ? ` · ${o.lessonCount} lesson${o.lessonCount === 1 ? '' : 's'}` : ''}
                    </Text>
                    <Text style={styles.outcomeMatchText} numberOfLines={2}>{o.text}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            {selectedOutcome ? (
              <Text style={styles.outcomeSelectedText} numberOfLines={3}>{selectedOutcome.text}</Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading lesson plans...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load lesson plans</Text>
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
          <Text style={styles.emptyText}>No lesson plans found</Text>
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
  outcomeSearch: { paddingHorizontal: 16, paddingTop: 8 },
  outcomeInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#F9FAFB' },
  outcomeInput: { flex: 1, fontSize: 14, color: '#1F2937', paddingVertical: 2 },
  outcomeClear: { fontSize: 13, fontWeight: '600', color: colors.forestGreen },
  outcomeMatches: { marginTop: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, backgroundColor: 'white', overflow: 'hidden' },
  outcomeMatch: { paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  outcomeMatchHead: { fontSize: 11, fontWeight: '800', color: colors.forestGreen, letterSpacing: 0.3 },
  outcomeMatchText: { fontSize: 13, color: '#374151', marginTop: 2, lineHeight: 18 },
  outcomeSelectedText: { fontSize: 12, color: '#4B5563', marginTop: 6, lineHeight: 17, fontStyle: 'italic' },
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
