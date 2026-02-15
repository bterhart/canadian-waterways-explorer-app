// Teacher Portal - Deep Dive Detail Screen
// Shows full pedagogical content: objectives, materials, activities, discussion questions
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  Dimensions,
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
  Users,
  Lightbulb,
  GraduationCap,
} from 'lucide-react-native';
import { useLessonPlan } from '@/lib/api/education-api';
import { getGradeLevelRangeColor, getGradeLevelRangeLabel, LessonPlanActivity } from '@/lib/types/education';
import { MarkdownContent } from '@/components/MarkdownContent';

const { width: screenWidth } = Dimensions.get('window');

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  teacherPurple: '#7C3AED',
  gold: '#C9A227',
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  teacherOnly?: boolean;
}

function Section({ title, icon, children, teacherOnly }: SectionProps) {
  return (
    <View style={[styles.section, teacherOnly && styles.teacherSection]}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
        {teacherOnly ? (
          <View style={styles.teacherBadge}>
            <GraduationCap size={12} color="white" />
            <Text style={styles.teacherBadgeText}>Teacher</Text>
          </View>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export default function TeacherDeepDiveDetailScreen() {
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
        <Text style={styles.errorText}>Unable to load content</Text>
      </View>
    );
  }

  // Combine base objectives with teacher-only objectives
  const allObjectives = [
    ...(lesson.objectives || []),
    ...(lesson.teacherObjectives || []),
  ];

  // Combine base activities with teacher-only activities
  const allActivities = [
    ...(lesson.activities || []),
    ...(lesson.teacherActivities || []),
  ];

  // Combine base questions with teacher-only questions
  const allQuestions = [
    ...(lesson.discussionQuestions || []),
    ...(lesson.teacherQuestions || []),
  ];

  const renderActivity = (activity: LessonPlanActivity | string, index: number) => {
    if (typeof activity === 'string') {
      return (
        <View key={index} style={styles.listItem}>
          <View style={styles.bulletPoint} />
          <Text style={styles.listItemText}>{activity}</Text>
        </View>
      );
    }
    return (
      <View key={index} style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityNumber}>{index + 1}</Text>
          <View style={styles.activityTitleRow}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityDuration}>{activity.duration}</Text>
          </View>
        </View>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        {activity.materials && activity.materials.length > 0 ? (
          <View style={styles.activityMaterials}>
            <Text style={styles.activityMaterialsLabel}>Materials:</Text>
            <Text style={styles.activityMaterialsText}>
              {activity.materials.join(', ')}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Deep Dive - Teacher',
          headerStyle: { backgroundColor: colors.teacherPurple },
          headerTintColor: 'white',
        }}
      />

      {/* Hero Image */}
      {lesson.heroImageUrl ? (
        <Image
          source={{ uri: lesson.heroImageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : null}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.teacherIndicator}>
            <GraduationCap size={16} color="white" />
            <Text style={styles.teacherIndicatorText}>Teacher Resources</Text>
          </View>
        </View>
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
                {lesson.estimatedMinutes} min lesson
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

      {/* Teacher Notes */}
      {lesson.teacherNotes ? (
        <Section
          title="Teacher Notes"
          icon={<Lightbulb size={20} color={colors.teacherPurple} />}
          teacherOnly
        >
          <MarkdownContent
            content={lesson.teacherNotes}
            accentColor={colors.teacherPurple}
          />
        </Section>
      ) : null}

      {/* Learning Objectives */}
      {allObjectives.length > 0 ? (
        <Section
          title="Learning Objectives"
          icon={<Target size={20} color={colors.forestGreen} />}
        >
          {allObjectives.map((objective, index) => (
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
      {allActivities.length > 0 ? (
        <Section
          title="Activities"
          icon={<Play size={20} color={colors.forestGreen} />}
        >
          {allActivities.map(renderActivity)}
        </Section>
      ) : null}

      {/* Discussion Questions */}
      {allQuestions.length > 0 ? (
        <Section
          title="Discussion Questions"
          icon={<MessageCircle size={20} color={colors.forestGreen} />}
        >
          {allQuestions.map((question, index) => (
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
          <MarkdownContent
            content={lesson.assessmentSuggestions}
            accentColor={colors.forestGreen}
          />
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
              {connection.expectations?.map((exp, expIndex) => (
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

      {/* Assign to Class */}
      <View style={styles.assignSection}>
        <Pressable
          style={styles.assignButton}
          onPress={() => router.push(`/teacher/assignment/new?lessonId=${id}`)}
        >
          <Users size={20} color="white" />
          <Text style={styles.assignButtonText}>Assign to Class</Text>
        </Pressable>
      </View>

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
  heroImage: {
    width: screenWidth,
    height: 180,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    marginBottom: 12,
  },
  teacherIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.teacherPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  teacherIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
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
  teacherSection: {
    backgroundColor: colors.teacherPurple + '08',
    borderLeftWidth: 4,
    borderLeftColor: colors.teacherPurple,
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
    flex: 1,
  },
  teacherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.teacherPurple,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  teacherBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
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
    overflow: 'hidden',
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
  assignSection: {
    padding: 20,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teacherPurple,
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  bottomSpacer: {
    height: 32,
  },
});
