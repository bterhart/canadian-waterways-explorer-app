// Create New Assignment Screen
//
// Entry points:
//   /teacher/assignment/new?classId=…   (from a class page)
//   /teacher/assignment/new?lessonId=…  (from a deep-dive page — class chosen here)
//
// Backend contract (backend/src/routes/classes.ts createAssignmentSchema):
//   assignmentType 'quiz' | 'lesson_plan' | 'field_trip'
//   quizId / lessonPlanId / fieldTripId — required for the matching type
//   dueDate — optional ISO 8601 datetime string (z.string().datetime())
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  ClipboardList,
  FileText,
  Calendar,
  Target,
  BookOpen,
  Users,
  Search,
  Check,
  X,
} from 'lucide-react-native';
import {
  useCreateAssignment,
  useLessonPlans,
  useQuizzes,
  useFieldTrips,
  useTeacherClasses,
} from '@/lib/api/education-api';
import { loadSession } from '@/lib/api/api';
import type { Teacher } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

type AssignmentType = 'quiz' | 'lesson_plan' | 'field_trip';

const ASSIGNMENT_TYPES: { id: AssignmentType; label: string; icon: typeof Target; color: string }[] = [
  { id: 'quiz', label: 'Quiz', icon: Target, color: '#3B82F6' },
  { id: 'lesson_plan', label: 'Lesson Plan', icon: BookOpen, color: '#10B981' },
  { id: 'field_trip', label: 'Field Trip', icon: FileText, color: '#8B5CF6' },
];

interface PickerItem {
  id: string;
  title: string;
  subtitle?: string | null;
}

// Due dates are stored as the end of the chosen day, in the teacher's local time.
function endOfDayIso(date: Date): string {
  const d = new Date(date);
  d.setHours(23, 59, 59, 0);
  return d.toISOString();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function NewAssignmentScreen() {
  const router = useRouter();
  const { classId: classIdParam, lessonId: lessonIdParam } = useLocalSearchParams<{
    classId?: string;
    lessonId?: string;
  }>();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classIdParam ?? null);
  const [title, setTitle] = useState('');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>(
    lessonIdParam ? 'lesson_plan' : 'quiz'
  );
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [selectedLessonPlanId, setSelectedLessonPlanId] = useState<string | null>(
    lessonIdParam ?? null
  );
  const [selectedFieldTripId, setSelectedFieldTripId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const createAssignment = useCreateAssignment();
  const { data: classes, isLoading: classesLoading } = useTeacherClasses(teacher?.id ?? null);
  const { data: lessonPlans } = useLessonPlans({});
  const { data: quizzes } = useQuizzes();
  const { data: fieldTrips } = useFieldTrips();

  useEffect(() => {
    loadTeacher();
  }, []);

  const loadTeacher = async () => {
    const session = await loadSession();
    if (session?.kind === 'teacher') {
      setTeacher(session.profile as Teacher);
    } else {
      router.replace('/teacher/login');
    }
  };

  // Items for the resource picker, by type
  const pickerItems: PickerItem[] = useMemo(() => {
    if (assignmentType === 'quiz') {
      return (quizzes ?? []).map((q) => ({
        id: q.id,
        title: q.title,
        subtitle: [q.category, q.gradeLevel ? `Grades ${q.gradeLevel}` : null, `${q.questionCount} questions`]
          .filter(Boolean)
          .join(' · '),
      }));
    }
    if (assignmentType === 'field_trip') {
      return (fieldTrips ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        subtitle: [t.theme, t.gradeLevel ? `Grades ${t.gradeLevel}` : null].filter(Boolean).join(' · '),
      }));
    }
    return (lessonPlans ?? []).map((l) => ({
      id: l.id,
      title: l.title,
      subtitle: [l.topic, l.gradeLevel ? `Grades ${l.gradeLevel}` : null].filter(Boolean).join(' · '),
    }));
  }, [assignmentType, quizzes, fieldTrips, lessonPlans]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pickerItems;
    return pickerItems.filter((item) => item.title.toLowerCase().includes(q));
  }, [pickerItems, search]);

  const selectedResourceId =
    assignmentType === 'quiz'
      ? selectedQuizId
      : assignmentType === 'field_trip'
        ? selectedFieldTripId
        : selectedLessonPlanId;

  const selectResource = (item: PickerItem) => {
    const next = selectedResourceId === item.id ? null : item.id;
    if (assignmentType === 'quiz') setSelectedQuizId(next);
    else if (assignmentType === 'field_trip') setSelectedFieldTripId(next);
    else setSelectedLessonPlanId(next);
    // Convenience: default the assignment title to the resource title.
    if (next && !title.trim()) setTitle(item.title);
  };

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== 'ios') setShowDatePicker(false);
    if (event.type === 'dismissed') return;
    if (selected) setDueDate(selected);
  };

  const typeLabel = ASSIGNMENT_TYPES.find((t) => t.id === assignmentType)?.label ?? 'resource';

  const handleCreate = async () => {
    if (!selectedClassId) {
      Alert.alert('Class Required', 'Choose the class this assignment is for.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter an assignment title.');
      return;
    }
    if (!selectedResourceId) {
      Alert.alert(`${typeLabel} Required`, `Choose the ${typeLabel.toLowerCase()} students should complete.`);
      return;
    }

    try {
      await createAssignment.mutateAsync({
        classId: selectedClassId,
        payload: {
          title: title.trim(),
          assignmentType,
          instructions: instructions.trim() || undefined,
          dueDate: dueDate ? endOfDayIso(dueDate) : undefined,
          quizId: assignmentType === 'quiz' ? selectedResourceId : undefined,
          lessonPlanId: assignmentType === 'lesson_plan' ? selectedResourceId : undefined,
          fieldTripId: assignmentType === 'field_trip' ? selectedResourceId : undefined,
        },
      });

      Alert.alert('Assignment Created', 'The assignment has been added to your class.', [
        {
          text: 'OK',
          onPress: () => router.replace(`/teacher/class/${selectedClassId}`),
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create assignment. Please try again.';
      Alert.alert('Unable to Create Assignment', message);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
          {/* Class (only when not arriving from a class page) */}
          {!classIdParam ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Class *</Text>
              {classesLoading ? (
                <ActivityIndicator size="small" color={colors.forestGreen} />
              ) : classes && classes.length > 0 ? (
                <View style={styles.chipRow}>
                  {classes.map((cls) => {
                    const active = selectedClassId === cls.id;
                    return (
                      <Pressable
                        key={cls.id}
                        style={[styles.chip, active && styles.chipActive]}
                        onPress={() => setSelectedClassId(active ? null : cls.id)}
                      >
                        <Users size={14} color={active ? 'white' : '#6B7280'} />
                        <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
                          {cls.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.inputHint}>
                  You have no classes yet. Create a class first from the Teacher Dashboard.
                </Text>
              )}
            </View>
          ) : null}

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
                    onPress={() => {
                      setAssignmentType(type.id);
                      setSearch('');
                    }}
                  >
                    <Icon size={24} color={isSelected ? type.color : '#9CA3AF'} />
                    <Text style={[styles.typeButtonText, isSelected && { color: type.color }]}>
                      {type.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Resource picker (required for every type) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{typeLabel} *</Text>
            <View style={styles.searchWrapper}>
              <Search size={16} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder={`Search ${typeLabel.toLowerCase()}s…`}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {search ? (
                <Pressable onPress={() => setSearch('')} hitSlop={8}>
                  <X size={16} color="#9CA3AF" />
                </Pressable>
              ) : null}
            </View>
            <View style={styles.pickerBox}>
              {pickerItems.length === 0 ? (
                <View style={styles.pickerEmpty}>
                  <ActivityIndicator size="small" color={colors.forestGreen} />
                </View>
              ) : filteredItems.length === 0 ? (
                <View style={styles.pickerEmpty}>
                  <Text style={styles.inputHint}>No matches</Text>
                </View>
              ) : (
                <ScrollView style={styles.pickerList} nestedScrollEnabled showsVerticalScrollIndicator>
                  {filteredItems.map((item) => {
                    const active = selectedResourceId === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        style={[styles.pickerRow, active && styles.pickerRowActive]}
                        onPress={() => selectResource(item)}
                      >
                        <View style={styles.pickerRowText}>
                          <Text style={[styles.pickerTitle, active && styles.pickerTitleActive]} numberOfLines={2}>
                            {item.title}
                          </Text>
                          {item.subtitle ? (
                            <Text style={styles.pickerSubtitle} numberOfLines={1}>
                              {item.subtitle}
                            </Text>
                          ) : null}
                        </View>
                        {active ? <Check size={18} color={colors.forestGreen} /> : null}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </View>

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
            <View style={styles.dateRow}>
              <Pressable
                style={[styles.inputWrapper, styles.dateButton]}
                onPress={() => setShowDatePicker((v) => !v)}
              >
                <Calendar size={20} color="#9CA3AF" style={styles.inputIcon} />
                <Text style={[styles.dateText, !dueDate && styles.datePlaceholder]}>
                  {dueDate ? formatDate(dueDate) : 'No due date'}
                </Text>
              </Pressable>
              {dueDate ? (
                <Pressable style={styles.clearDate} onPress={() => setDueDate(null)} hitSlop={8}>
                  <X size={18} color="#6B7280" />
                </Pressable>
              ) : null}
            </View>
            {showDatePicker ? (
              <View style={styles.datePickerWrap}>
                <DateTimePicker
                  value={dueDate ?? new Date()}
                  mode="date"
                  minimumDate={new Date()}
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={onDateChange}
                />
                {Platform.OS === 'ios' ? (
                  <Pressable style={styles.doneButton} onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.doneButtonText}>Done</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}
            <Text style={styles.inputHint}>Due at the end of the chosen day.</Text>
          </View>

          <Pressable
            style={[styles.createButton, createAssignment.isPending && styles.buttonDisabled]}
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxWidth: '100%',
  },
  chipActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  chipTextActive: {
    color: 'white',
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    padding: 0,
  },
  pickerBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  pickerList: {
    maxHeight: 260,
  },
  pickerEmpty: {
    padding: 20,
    alignItems: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerRowActive: {
    backgroundColor: colors.forestGreen + '12',
  },
  pickerRowText: {
    flex: 1,
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  pickerTitleActive: {
    color: colors.darkGreen,
    fontWeight: '700',
  },
  pickerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 14,
  },
  dateText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#374151',
  },
  datePlaceholder: {
    color: '#9CA3AF',
  },
  clearDate: {
    padding: 10,
  },
  datePickerWrap: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  doneButton: {
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.forestGreen,
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
