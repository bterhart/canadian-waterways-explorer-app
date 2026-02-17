// Teacher Portal - Deep Dives List Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BookOpen, Clock, ChevronRight, GraduationCap } from 'lucide-react-native';
import { useLessonPlans } from '@/lib/api/education-api';
import { getGradeLevelRangeColor, getGradeLevelRangeLabel } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  teacherPurple: '#7C3AED',
};

export default function TeacherDeepDivesScreen() {
  const router = useRouter();
  const { data: lessons, isLoading, isError } = useLessonPlans();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen
          options={{
            title: 'Deep Dives',
            headerStyle: { backgroundColor: colors.teacherPurple },
            headerTintColor: 'white',
          }}
        />
        <ActivityIndicator size="large" color={colors.teacherPurple} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen
          options={{
            title: 'Deep Dives',
            headerStyle: { backgroundColor: colors.teacherPurple },
            headerTintColor: 'white',
          }}
        />
        <Text style={styles.errorText}>Unable to load Deep Dives</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Deep Dives',
          headerStyle: { backgroundColor: colors.teacherPurple },
          headerTintColor: 'white',
        }}
      />

      {/* Header Info */}
      <View style={styles.headerInfo}>
        <View style={styles.headerIcon}>
          <GraduationCap size={24} color={colors.teacherPurple} />
        </View>
        <Text style={styles.headerTitle}>Teacher Deep Dive Resources</Text>
        <Text style={styles.headerDescription}>
          Access comprehensive teaching materials for each Deep Dive topic. Includes learning objectives, activities, discussion questions, and curriculum connections.
        </Text>
      </View>

      {/* Deep Dives List */}
      <View style={styles.listContainer}>
        {lessons?.map((lesson) => (
          <Pressable
            key={lesson.id}
            style={styles.card}
            onPress={() => router.push(`/teacher/deep-dive/${lesson.id}`)}
          >
            {lesson.heroImageUrl ? (
              <Image
                source={{ uri: lesson.heroImageUrl }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.cardImagePlaceholder}>
                <BookOpen size={32} color={colors.forestGreen} />
              </View>
            )}
            <View style={styles.cardContent}>
              <View style={styles.cardBadges}>
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
                    <Clock size={12} color="#6B7280" />
                    <Text style={styles.durationText}>
                      {lesson.estimatedMinutes} min
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {lesson.title}
              </Text>
              <View style={styles.topicRow}>
                <Text style={styles.topicText}>{lesson.topic}</Text>
              </View>
              {lesson.description ? (
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {lesson.description}
                </Text>
              ) : null}
              <View style={styles.cardFooter}>
                <Text style={styles.viewText}>View Teaching Resources</Text>
                <ChevronRight size={16} color={colors.teacherPurple} />
              </View>
            </View>
          </Pressable>
        ))}
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
  headerInfo: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.teacherPurple + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: colors.forestGreen + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  cardBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 6,
  },
  topicRow: {
    marginBottom: 8,
  },
  topicText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.forestGreen,
    backgroundColor: colors.forestGreen + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
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
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.teacherPurple,
  },
  bottomSpacer: {
    height: 32,
  },
});
