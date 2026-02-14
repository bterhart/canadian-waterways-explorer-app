// Teacher Portal - Lesson Plan Detail Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import {
  BookOpen,
  Clock,
  Target,
  Package,
  MessageCircle,
  Award,
  Play,
  ChevronRight,
} from 'lucide-react-native';
import { useLessonPlan } from '@/lib/api/education-api';
import { getGradeLevelRangeColor, getGradeLevelRangeLabel } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function TeacherLessonPlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: lesson, isLoading, isError } = useLessonPlan(id ?? null);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  if (isError || !lesson) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Unable to load lesson plan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Lesson Plan',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadges}>
          <View
            style={[
              styles.gradeBadge,
              { backgroundColor: getGradeLevelRangeColor(lesson.gradeLevel) },
            ]}
          >
            <Text style={styles.gradeBadgeText}>
              {getGradeLevelRangeLabel(lesson.gradeLevel)}
            </Text>
          </View>
          {lesson.estimatedMinutes ? (
            <View style={styles.durationBadge}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.durationText}>
                {lesson.estimatedMinutes} minutes
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title}>{lesson.title}</Text>
        {lesson.description ? (
          <Text style={styles.description}>{lesson.description}</Text>
        ) : null}
        <View style={styles.topicBadge}>
          <Text style={styles.topicText}>{lesson.topic}</Text>
        </View>
      </View>

      {/* Learning Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 ? (
        <Section
          title="Learning Objectives"
          icon={<Target size={20} color={colors.forestGreen} />}
        >
          {lesson.objectives.map((objective, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.listItemText}>{objective}</Text>
            </View>
          ))}
        </Section>
      ) : null}

      {/* Materials Needed */}
      {lesson.materials && lesson.materials.length > 0 ? (
        <Section
          title="Materials Needed"
          icon={<Package size={20} color={colors.forestGreen} />}
        >
          {lesson.materials.map((material, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.listItemText}>{material}</Text>
            </View>
          ))}
        </Section>
      ) : null}

      {/* Activities */}
      {lesson.activities && lesson.activities.length > 0 ? (
        <Section
          title="Activities"
          icon={<Play size={20} color={colors.forestGreen} />}
        >
          {lesson.activities.map((activity, index) => (
            <View key={index} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityNumber}>{index + 1}</Text>
                <View style={styles.activityTitleRow}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDuration}>{activity.duration}</Text>
                </View>
              </View>
              <Text style={styles.activityDescription}>
                {activity.description}
              </Text>
              {activity.materials && activity.materials.length > 0 ? (
                <View style={styles.activityMaterials}>
                  <Text style={styles.activityMaterialsLabel}>Materials:</Text>
                  <Text style={styles.activityMaterialsText}>
                    {activity.materials.join(', ')}
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </Section>
      ) : null}

      {/* Discussion Questions */}
      {lesson.discussionQuestions && lesson.discussionQuestions.length > 0 ? (
        <Section
          title="Discussion Questions"
          icon={<MessageCircle size={20} color={colors.forestGreen} />}
        >
          {lesson.discussionQuestions.map((question, index) => (
            <View key={index} style={styles.questionCard}>
              <Text style={styles.questionNumber}>Q{index + 1}</Text>
              <Text style={styles.questionText}>{question}</Text>
            </View>
          ))}
        </Section>
      ) : null}

      {/* Assessment */}
      {lesson.assessmentSuggestions ? (
        <Section
          title="Assessment Suggestions"
          icon={<Award size={20} color={colors.forestGreen} />}
        >
          <Text style={styles.assessmentText}>
            {lesson.assessmentSuggestions}
          </Text>
        </Section>
      ) : null}

      {/* Curriculum Connections */}
      {lesson.curriculumConnections && lesson.curriculumConnections.length > 0 ? (
        <Section
          title="Curriculum Connections"
          icon={<BookOpen size={20} color={colors.forestGreen} />}
        >
          {lesson.curriculumConnections.map((connection, index) => (
            <View key={index} style={styles.curriculumCard}>
              <Text style={styles.curriculumProvince}>
                {connection.province} - {connection.subject} ({connection.grade})
              </Text>
              {connection.expectations.map((exp, expIndex) => (
                <View key={expIndex} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listItemText}>{exp}</Text>
                </View>
              ))}
            </View>
          ))}
        </Section>
      ) : null}

      {/* Related Quizzes */}
      {lesson.relatedQuizIds && lesson.relatedQuizIds.length > 0 ? (
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Quizzes</Text>
          <Pressable
            style={styles.relatedButton}
            onPress={() => router.push('/(tabs)/quizzes')}
          >
            <Text style={styles.relatedButtonText}>
              View {lesson.relatedQuizIds.length} related quiz
              {lesson.relatedQuizIds.length > 1 ? 'zes' : ''}
            </Text>
            <ChevronRight size={18} color={colors.forestGreen} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.bottomSpacer} />
    </ScrollView>
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
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  gradeBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 12,
  },
  topicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.forestGreen + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  topicText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.forestGreen,
    marginTop: 7,
    marginRight: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  activityCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  activityNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.forestGreen,
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  activityTitleRow: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  activityDuration: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
    marginLeft: 40,
  },
  activityMaterials: {
    flexDirection: 'row',
    marginLeft: 40,
    marginTop: 8,
  },
  activityMaterialsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activityMaterialsText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.forestGreen,
    marginRight: 10,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  assessmentText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  curriculumCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  curriculumProvince: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 10,
  },
  relatedSection: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 12,
  },
  relatedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.forestGreen + '10',
    padding: 14,
    borderRadius: 12,
  },
  relatedButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  bottomSpacer: {
    height: 32,
  },
});
