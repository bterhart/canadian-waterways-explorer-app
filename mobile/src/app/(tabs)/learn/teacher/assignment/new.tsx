// Create New Assignment Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import {
  ClipboardList,
  FileText,
  Calendar,
  Target,
  BookOpen,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCreateAssignment, useLessonPlans } from '@/lib/api/education-api';
import type { Teacher } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const TEACHER_SESSION_KEY = '@waterways_teacher_session';

const ASSIGNMENT_TYPES = [
  { id: 'quiz', label: 'Quiz', icon: Target, color: '#3B82F6' },
  { id: 'lesson_plan', label: 'Lesson Plan', icon: BookOpen, color: '#10B981' },
  { id: 'field_trip', label: 'Field Trip', icon: FileText, color: '#8B5CF6' },
] as const;

export default function NewAssignmentScreen() {
  const router = useRouter();
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [title, setTitle] = useState('');
  const [assignmentType, setAssignmentType] = useState('quiz');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<string | null>(null);

  const createAssignment = useCreateAssignment();
  const { data: lessonPlans } = useLessonPlans({});

  useEffect(() => {
    loadTeacher();
  }, []);

  const loadTeacher = async () => {
    try {
      const stored = await AsyncStorage.getItem(TEACHER_SESSION_KEY);
      if (stored) {
        setTeacher(JSON.parse(stored));
      } else {
        router.replace('../login');
      }
    } catch {
      router.replace('../login');
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter an assignment title.');
      return;
    }
    if (!classId) {
      Alert.alert('Error', 'Class ID is missing.');
      return;
    }

    try {
      await createAssignment.mutateAsync({
        classId,
        payload: {
          title: title.trim(),
          assignmentType: assignmentType as 'quiz' | 'lesson_plan' | 'field_trip',
          instructions: instructions.trim() || undefined,
          dueDate: dueDate.trim() || undefined,
          lessonPlanId: selectedLessonPlan || undefined,
        },
      });

      Alert.alert('Assignment Created', 'The assignment has been added to your class.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Unable to create assignment. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'New Assignment',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <ClipboardList size={40} color={colors.forestGreen} />
          </View>
          <Text style={styles.title}>Create Assignment</Text>
          <Text style={styles.subtitle}>
            Add a new assignment for your students
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Assignment Title *</Text>
            <View style={styles.inputWrapper}>
              <FileText size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Fur Trade Routes Quiz"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Assignment Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Assignment Type *</Text>
            <View style={styles.typeGrid}>
              {ASSIGNMENT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = assignmentType === type.id;
                return (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.typeButton,
                      isSelected && { borderColor: type.color, backgroundColor: type.color + '15' },
                    ]}
                    onPress={() => setAssignmentType(type.id)}
                  >
                    <Icon
                      size={24}
                      color={isSelected ? type.color : '#9CA3AF'}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        isSelected && { color: type.color },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Instructions (optional)</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Add instructions for students..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Due Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Due Date (optional)</Text>
            <View style={styles.inputWrapper}>
              <Calendar size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="e.g., 2024-12-15"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <Text style={styles.inputHint}>Format: YYYY-MM-DD</Text>
          </View>

          {/* Lesson Plan Selection (for lesson_plan type) */}
          {assignmentType === 'lesson_plan' && lessonPlans && lessonPlans.length > 0 ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Link to Lesson Plan (optional)</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
                contentContainerStyle={styles.lessonPlanList}
              >
                {lessonPlans.slice(0, 10).map((lesson) => (
                  <Pressable
                    key={lesson.id}
                    style={[
                      styles.lessonPlanChip,
                      selectedLessonPlan === lesson.id && styles.lessonPlanChipActive,
                    ]}
                    onPress={() =>
                      setSelectedLessonPlan(
                        selectedLessonPlan === lesson.id ? null : lesson.id
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.lessonPlanChipText,
                        selectedLessonPlan === lesson.id &&
                          styles.lessonPlanChipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {lesson.title}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          <Pressable
            style={[
              styles.createButton,
              createAssignment.isPending && styles.buttonDisabled,
            ]}
            onPress={handleCreate}
            disabled={createAssignment.isPending}
          >
            {createAssignment.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.createButtonText}>Create Assignment</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputGroup: {},
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#374151',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginLeft: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 8,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  lessonPlanList: {
    flexDirection: 'row',
    gap: 8,
  },
  lessonPlanChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxWidth: 150,
  },
  lessonPlanChipActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  lessonPlanChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  lessonPlanChipTextActive: {
    color: 'white',
  },
  createButton: {
    backgroundColor: colors.forestGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
