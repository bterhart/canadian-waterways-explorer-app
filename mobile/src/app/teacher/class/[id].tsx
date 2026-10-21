// Class Detail Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  Users,
  ClipboardList,
  Plus,
  Copy,
  RefreshCw,
  Trash2,
  User,
  Eye,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import {
  useClass,
  useRegenerateClassCode,
  useRemoveStudent,
  useUpdateClass,
} from '@/lib/api/education-api';
import type { ClassStudent, ClassAssignment, ContentScopeMode } from '@/lib/types/education';
import { GRADE_LEVEL_RANGES } from '@/lib/types/education';

// Class content scope (spec 10.27): what the class's students see.
const SCOPE_OPTIONS: { mode: ContentScopeMode; label: string; detail: string }[] = [
  { mode: 'all', label: 'Everything', detail: 'Students see every lesson, quiz, document and activity in the app.' },
  { mode: 'bands', label: 'Only these grades', detail: 'Students see lessons, quizzes, documents and activities for the grade bands chosen below. The map, waterways, explorers and people are always shown.' },
  { mode: 'assigned', label: 'Assigned work only', detail: 'Students see only the lessons, quizzes and field trips you assign; documents and other activities follow the grade bands below. The map, waterways, explorers and people are always shown.' },
];

function parseBands(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((b): b is string => typeof b === 'string') : [];
  } catch {
    return [];
  }
}

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: classData, isLoading, refetch } = useClass(id ?? null);
  const regenerateCode = useRegenerateClassCode();
  const removeStudent = useRemoveStudent();
  const updateClass = useUpdateClass();

  const scopeMode: ContentScopeMode = classData?.scopeMode ?? 'all';
  const chosenBands = parseBands(classData?.contentBands ?? null);

  const setScopeMode = async (mode: ContentScopeMode) => {
    if (!id || mode === scopeMode) return;
    try {
      await updateClass.mutateAsync({ id, payload: { scopeMode: mode } });
    } catch {
      Alert.alert('Not saved', 'The setting could not be saved. Try again.');
    }
  };

  const toggleBand = async (band: string) => {
    if (!id) return;
    const next = chosenBands.includes(band) ? chosenBands.filter((b) => b !== band) : [...chosenBands, band];
    try {
      await updateClass.mutateAsync({ id, payload: { contentBands: next.length > 0 ? next : null } });
    } catch {
      Alert.alert('Not saved', 'The setting could not be saved. Try again.');
    }
  };

  const handleCopyCode = async () => {
    if (classData?.joinCode) {
      await Clipboard.setStringAsync(classData.joinCode);
      Alert.alert('Copied', 'Join code copied to clipboard');
    }
  };

  const handleRegenerateCode = () => {
    if (!id) return;
    Alert.alert(
      'Regenerate Code',
      'This will create a new join code. The old code will no longer work.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          onPress: async () => {
            await regenerateCode.mutateAsync(id);
            refetch();
          },
        },
      ]
    );
  };

  const handleRemoveStudent = (student: ClassStudent) => {
    if (!id) return;
    Alert.alert(
      'Remove Student',
      `Remove ${student.displayName} from this class?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeStudent.mutateAsync({
              classId: id,
              studentId: student.id,
            });
            refetch();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  if (!classData) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Class not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: classData.name,
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Class Header */}
      <View style={styles.header}>
        <Text style={styles.className}>{classData.name}</Text>
        <Text style={styles.classGrade}>Grade {classData.gradeLevel}</Text>
        {classData.schoolYear ? (
          <Text style={styles.classYear}>{classData.schoolYear}</Text>
        ) : null}

        {/* Join Code Section */}
        <View style={styles.joinCodeSection}>
          <Text style={styles.joinCodeLabel}>Student Join Code</Text>
          <View style={styles.joinCodeRow}>
            <Text style={styles.joinCode}>{classData.joinCode}</Text>
            <Pressable style={styles.codeButton} onPress={handleCopyCode}>
              <Copy size={18} color={colors.forestGreen} />
            </Pressable>
            <Pressable
              style={styles.codeButton}
              onPress={handleRegenerateCode}
              disabled={regenerateCode.isPending}
            >
              {regenerateCode.isPending ? (
                <ActivityIndicator size="small" color={colors.forestGreen} />
              ) : (
                <RefreshCw size={18} color={colors.forestGreen} />
              )}
            </Pressable>
          </View>
        </View>
      </View>

      {/* What students see (class content scope, spec 10.27) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Eye size={20} color={colors.forestGreen} />
          <Text style={styles.sectionTitle}>What students see</Text>
          {updateClass.isPending ? <ActivityIndicator size="small" color={colors.forestGreen} /> : null}
        </View>
        {SCOPE_OPTIONS.map((opt) => (
          <Pressable
            key={opt.mode}
            style={[styles.scopeOption, scopeMode === opt.mode && styles.scopeOptionActive]}
            onPress={() => setScopeMode(opt.mode)}
            disabled={updateClass.isPending}
          >
            <View style={[styles.scopeRadio, scopeMode === opt.mode && styles.scopeRadioActive]} />
            <View style={styles.scopeText}>
              <Text style={[styles.scopeLabel, scopeMode === opt.mode && styles.scopeLabelActive]}>{opt.label}</Text>
              <Text style={styles.scopeDetail}>{opt.detail}</Text>
            </View>
          </Pressable>
        ))}
        {scopeMode !== 'all' ? (
          <View style={styles.bandsBlock}>
            <Text style={styles.bandsLabel}>
              Grade bands shown{chosenBands.length === 0 ? ` (none chosen: the class's own grade, ${classData.gradeLevel})` : ''}
            </Text>
            <View style={styles.bandsRow}>
              {GRADE_LEVEL_RANGES.map((band) => {
                const on = chosenBands.includes(band);
                return (
                  <Pressable
                    key={band}
                    style={[styles.bandChip, on && styles.bandChipActive]}
                    onPress={() => toggleBand(band)}
                    disabled={updateClass.isPending}
                  >
                    <Text style={[styles.bandChipText, on && styles.bandChipTextActive]}>{band}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>

      {/* Students Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={20} color={colors.forestGreen} />
          <Text style={styles.sectionTitle}>
            Students ({classData.students?.length || 0})
          </Text>
        </View>

        {classData.students && classData.students.length > 0 ? (
          <View style={styles.studentsList}>
            {classData.students.map((student) => (
              <View key={student.id} style={styles.studentItem}>
                <View style={styles.studentAvatar}>
                  <User size={16} color="white" />
                </View>
                <Text style={styles.studentName}>{student.displayName}</Text>
                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleRemoveStudent(student)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No students yet</Text>
            <Text style={styles.emptySubtext}>
              Share the join code with your students
            </Text>
          </View>
        )}
      </View>

      {/* Assignments Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ClipboardList size={20} color={colors.forestGreen} />
          <Text style={styles.sectionTitle}>
            Assignments ({classData.assignments?.length || 0})
          </Text>
          <Pressable
            style={styles.addAssignmentButton}
            onPress={() => router.push(`/teacher/assignment/new?classId=${id}`)}
          >
            <Plus size={16} color="white" />
            <Text style={styles.addAssignmentText}>Add</Text>
          </Pressable>
        </View>

        {classData.assignments && classData.assignments.length > 0 ? (
          <View style={styles.assignmentsList}>
            {classData.assignments.map((assignment) => (
              <View key={assignment.id} style={styles.assignmentItem}>
                <View
                  style={[
                    styles.assignmentType,
                    {
                      backgroundColor:
                        assignment.assignmentType === 'quiz'
                          ? '#3B82F6'
                          : assignment.assignmentType === 'lesson_plan'
                          ? '#10B981'
                          : '#8B5CF6',
                    },
                  ]}
                >
                  <Text style={styles.assignmentTypeText}>
                    {assignment.assignmentType.replace(/_/g, ' ')}
                  </Text>
                </View>
                <View style={styles.assignmentInfo}>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                  {assignment.dueDate ? (
                    <Text style={styles.assignmentDue}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </Text>
                  ) : null}
                  <Text style={styles.assignmentDue}>
                    {(assignment.progress ?? []).filter((p) => p.status === 'completed').length} of{' '}
                    {classData.students?.length ?? 0} students completed
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No assignments yet</Text>
            <Text style={styles.emptySubtext}>
              Create assignments for your students
            </Text>
          </View>
        )}
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
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  className: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 4,
  },
  classGrade: {
    fontSize: 16,
    color: '#6B7280',
  },
  classYear: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  joinCodeSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.forestGreen + '10',
    borderRadius: 12,
  },
  joinCodeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  joinCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  joinCode: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: colors.forestGreen,
    letterSpacing: 2,
  },
  codeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  addAssignmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addAssignmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  studentsList: {
    gap: 8,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
  },
  studentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.forestGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  removeButton: {
    padding: 8,
  },
  assignmentsList: {
    gap: 10,
  },
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  assignmentType: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  assignmentTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.darkGreen,
  },
  assignmentDue: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  bottomSpacer: {
    height: 32,
  },
  // What students see (spec 10.27)
  scopeOption: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 10, backgroundColor: '#F9FAFB', marginBottom: 8 },
  scopeOptionActive: { backgroundColor: colors.forestGreen + '12', borderWidth: 1, borderColor: colors.forestGreen + '55' },
  scopeRadio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#9CA3AF', marginTop: 2 },
  scopeRadioActive: { borderColor: colors.forestGreen, backgroundColor: colors.forestGreen },
  scopeText: { flex: 1 },
  scopeLabel: { fontSize: 15, fontWeight: '600', color: colors.darkGreen },
  scopeLabelActive: { color: colors.forestGreen },
  scopeDetail: { fontSize: 13, color: '#6B7280', marginTop: 2, lineHeight: 18 },
  bandsBlock: { marginTop: 4 },
  bandsLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
  bandsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bandChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  bandChipActive: { backgroundColor: colors.forestGreen, borderColor: colors.forestGreen },
  bandChipText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  bandChipTextActive: { color: 'white' },
});
