// My Class — the student's classes with the assignments their teacher set.
// Keyed by the anonymous device identity (lib/identity.ts).
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Users,
  GraduationCap,
  Target,
  BookOpen,
  FileText,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react-native';
import { useMyClasses } from '@/lib/api/education-api';
import { useDeviceId } from '@/lib/identity';
import type { StudentAssignment } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const TYPE_META: Record<StudentAssignment['assignmentType'], { label: string; icon: typeof Target; color: string }> = {
  quiz: { label: 'Quiz', icon: Target, color: '#3B82F6' },
  lesson_plan: { label: 'Lesson', icon: BookOpen, color: '#10B981' },
  field_trip: { label: 'Field Trip', icon: FileText, color: '#8B5CF6' },
};

function assignmentRoute(a: StudentAssignment): string | null {
  if (a.assignmentType === 'quiz' && a.quizId) return `/quiz/${a.quizId}`;
  if (a.assignmentType === 'lesson_plan' && a.lessonPlanId) return `/lessons/${a.lessonPlanId}`;
  if (a.assignmentType === 'field_trip' && a.fieldTripId) return `/field-trips/${a.fieldTripId}`;
  return null;
}

function formatDue(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyClassScreen() {
  const router = useRouter();
  const userId = useDeviceId();
  const { data: memberships, isLoading, isError, refetch } = useMyClasses(userId);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const screenOptions = {
    title: 'My Class',
    headerStyle: { backgroundColor: colors.forestGreen },
    headerTintColor: 'white',
  };

  if (!userId || isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={screenOptions} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={screenOptions} />
        <Text style={styles.errorText}>Unable to load your classes</Text>
        <Pressable style={styles.secondaryButton} onPress={() => refetch()}>
          <Text style={styles.secondaryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  if (!memberships || memberships.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={screenOptions} />
        <View style={styles.iconContainer}>
          <Users size={48} color={colors.forestGreen} />
        </View>
        <Text style={styles.emptyTitle}>You haven't joined a class yet</Text>
        <Text style={styles.emptySubtitle}>
          Ask your teacher for a class code to see your assignments here.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/join-class')}>
          <Plus size={18} color="white" />
          <Text style={styles.primaryButtonText}>Join a Class</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.forestGreen} />}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={screenOptions} />

      {memberships.map((m) => (
        <View key={m.student.id} style={styles.classCard}>
          <View style={styles.classHeader}>
            <View style={styles.classIcon}>
              <GraduationCap size={22} color={colors.forestGreen} />
            </View>
            <View style={styles.classText}>
              <Text style={styles.className}>{m.class.name}</Text>
              <Text style={styles.classMeta}>
                {m.class.teacherName} · Grades {m.class.gradeLevel}
                {m.class.schoolYear ? ` · ${m.class.schoolYear}` : ''}
              </Text>
              <Text style={styles.classMeta}>You are signed in as {m.student.displayName}</Text>
              {/* Class content scope (spec 10.27): say what this class limits, so a missing item is not a mystery */}
              {m.class.scopeMode === 'bands' ? (
                <Text style={styles.scopeNote}>Your teacher has set this class to show grade {m.class.contentBands.join(', ')} lessons, quizzes, documents and activities.</Text>
              ) : m.class.scopeMode === 'assigned' ? (
                <Text style={styles.scopeNote}>Your teacher has set this class to show assigned work only, with grade {m.class.contentBands.join(', ')} documents and activities.</Text>
              ) : null}
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Assignments ({m.assignments.length})
          </Text>
          {m.assignments.length === 0 ? (
            <Text style={styles.noAssignments}>No assignments yet — check back later.</Text>
          ) : (
            m.assignments.map((a) => {
              const meta = TYPE_META[a.assignmentType] ?? TYPE_META.lesson_plan;
              const Icon = meta.icon;
              const route = assignmentRoute(a);
              const done = a.progress?.status === 'completed';
              const started = a.progress?.status === 'in_progress';
              return (
                <Pressable
                  key={a.id}
                  style={({ pressed }) => [styles.assignment, pressed && route && styles.assignmentPressed]}
                  onPress={() => route && router.push(route)}
                  disabled={!route}
                >
                  <View style={[styles.typeIcon, { backgroundColor: meta.color + '20' }]}>
                    <Icon size={20} color={meta.color} />
                  </View>
                  <View style={styles.assignmentText}>
                    <Text style={styles.assignmentTitle} numberOfLines={2}>{a.title}</Text>
                    <View style={styles.assignmentMetaRow}>
                      <Text style={[styles.typeLabel, { color: meta.color }]}>{meta.label}</Text>
                      {a.dueDate ? (
                        <View style={styles.dueRow}>
                          <Calendar size={12} color="#6B7280" />
                          <Text style={styles.dueText}>Due {formatDue(a.dueDate)}</Text>
                        </View>
                      ) : null}
                    </View>
                    {a.instructions ? (
                      <Text style={styles.instructions} numberOfLines={2}>{a.instructions}</Text>
                    ) : null}
                  </View>
                  <View style={styles.statusCol}>
                    {done ? (
                      <CheckCircle2 size={22} color="#10B981" />
                    ) : started ? (
                      <Clock size={22} color="#F59E0B" />
                    ) : route ? (
                      <ChevronRight size={20} color="#9CA3AF" />
                    ) : null}
                    {done && a.progress?.score !== null && a.progress?.maxScore ? (
                      <Text style={styles.scoreText}>
                        {a.progress.score}/{a.progress.maxScore}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      ))}

      <Pressable style={styles.secondaryButton} onPress={() => router.push('/join-class')}>
        <Plus size={16} color={colors.forestGreen} />
        <Text style={styles.secondaryButtonText}>Join another class</Text>
      </Pressable>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  content: { padding: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.creamWhite,
    padding: 24,
  },
  errorText: { fontSize: 16, color: '#EF4444', marginBottom: 16 },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.darkGreen, marginBottom: 8, textAlign: 'center' },
  emptySubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: 'white' },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen + '12',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'center',
  },
  secondaryButtonText: { fontSize: 15, fontWeight: '600', color: colors.forestGreen },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  classHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  classIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  classText: { flex: 1 },
  className: { fontSize: 18, fontWeight: '800', color: colors.darkGreen, marginBottom: 2 },
  classMeta: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  scopeNote: { fontSize: 12, color: '#4B5563', marginTop: 6, lineHeight: 17, fontStyle: 'italic' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.darkGreen, marginBottom: 10 },
  noAssignments: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic' },
  assignment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  assignmentPressed: { opacity: 0.6 },
  typeIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  assignmentText: { flex: 1 },
  assignmentTitle: { fontSize: 15, fontWeight: '600', color: '#374151' },
  assignmentMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 3 },
  typeLabel: { fontSize: 12, fontWeight: '600' },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dueText: { fontSize: 12, color: '#6B7280' },
  instructions: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  statusCol: { alignItems: 'center', minWidth: 36 },
  scoreText: { fontSize: 11, color: '#6B7280', marginTop: 2 },
});
