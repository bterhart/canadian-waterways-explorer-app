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
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import {
  useClass,
  useRegenerateClassCode,
  useRemoveStudent,
} from '@/lib/api/education-api';
import type { ClassStudent, ClassAssignment } from '@/lib/types/education';

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
                    {assignment.assignmentType.replace('_', ' ')}
                  </Text>
                </View>
                <View style={styles.assignmentInfo}>
                  <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                  {assignment.dueDate ? (
                    <Text style={styles.assignmentDue}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </Text>
                  ) : null}
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
});
