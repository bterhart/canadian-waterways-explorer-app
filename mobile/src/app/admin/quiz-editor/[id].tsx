import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  Save,
  Plus,
  GripVertical,
  FileEdit,
  Trash2,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import {
  useAdminQuiz,
  useUpdateQuiz,
  useDeleteQuizQuestion,
  adminQuizzesKeys,
} from '@/lib/api/waterways-api';
import type { Quiz, QuizQuestion } from '@/lib/types/waterways';
import QuestionEditorModal from '@/components/QuestionEditorModal';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray500: '#6B7280',
  gray700: '#374151',
  gray900: '#111827',
  red500: '#EF4444',
  red600: '#DC2626',
  green500: '#22C55E',
  green600: '#16A34A',
  gold: '#C9A227',
};

// Categories
const categories = [
  'Explorers',
  'Fur Trade',
  'Indigenous Heritage',
  'Geography',
  'Maritime History',
] as const;

// Grade levels
const gradeLevels = ['K-3', '4-6', '7-9', '10-12', 'All'] as const;

// Difficulties
const difficulties = ['easy', 'medium', 'hard'] as const;

// Question type badge colors
const questionTypeBadgeColors: Record<string, { bg: string; text: string }> = {
  multiple_choice: { bg: colors.waterBlue, text: colors.white },
  true_false: { bg: colors.earthBrown, text: colors.white },
};

interface PickerOption {
  label: string;
  value: string;
}

interface CustomPickerProps {
  label: string;
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
}

function CustomPicker({ label, value, options, onChange }: CustomPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable
        style={styles.pickerButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.pickerButtonText}>
          {selectedOption?.label ?? 'Select...'}
        </Text>
        <ChevronDown size={20} color={colors.gray500} />
      </Pressable>
      {isOpen ? (
        <View style={styles.pickerDropdown}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.pickerOption,
                option.value === value && styles.pickerOptionSelected,
              ]}
              onPress={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <Text style={[
                styles.pickerOptionText,
                option.value === value && styles.pickerOptionTextSelected,
              ]}>
                {option.label}
              </Text>
              {option.value === value ? (
                <Check size={18} color={colors.forestGreen} />
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

function QuestionCard({ question, index, onEdit, onDelete }: QuestionCardProps) {
  const typeStyle = questionTypeBadgeColors[question.questionType] ?? questionTypeBadgeColors.multiple_choice;

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View style={styles.dragHandle}>
          <GripVertical size={20} color={colors.gray300} />
        </View>
        <View style={styles.questionInfo}>
          <View style={styles.questionBadges}>
            <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
              <Text style={[styles.typeBadgeText, { color: typeStyle.text }]}>
                {question.questionType === 'multiple_choice' ? 'Multiple Choice' : 'True/False'}
              </Text>
            </View>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsBadgeText}>
                {question.points} pt{question.points !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <Text style={styles.questionText} numberOfLines={2}>
            {index + 1}. {question.questionText}
          </Text>
        </View>
      </View>
      <View style={styles.questionActions}>
        <Pressable style={styles.questionActionButton} onPress={onEdit}>
          <FileEdit size={16} color={colors.forestGreen} />
          <Text style={styles.questionActionText}>Edit</Text>
        </Pressable>
        <Pressable style={styles.questionActionButton} onPress={onDelete}>
          <Trash2 size={16} color={colors.red600} />
          <Text style={[styles.questionActionText, { color: colors.red600 }]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function QuizEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch quiz data
  const { data: quiz, isLoading, error } = useAdminQuiz(id ?? null);
  const updateMutation = useUpdateQuiz();
  const deleteQuestionMutation = useDeleteQuizQuestion();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Explorers');
  const [gradeLevel, setGradeLevel] = useState<string>('All');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [isPublished, setIsPublished] = useState(false);

  // Modal state
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // Feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Populate form when quiz loads
  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title);
      setDescription(quiz.description ?? '');
      setCategory(quiz.category);
      setGradeLevel(quiz.gradeLevel ?? 'All');
      setDifficulty(quiz.difficulty);
      setIsPublished(quiz.isPublished);
    }
  }, [quiz]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedbackMessage({ type, message });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showFeedback('error', 'Title is required');
      return;
    }

    if (!id) return;

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        gradeLevel: gradeLevel === 'All' ? undefined : gradeLevel,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        isPublished,
      });

      queryClient.invalidateQueries({ queryKey: adminQuizzesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminQuizzesKeys.list() });
      showFeedback('success', 'Quiz saved successfully');
    } catch (err) {
      showFeedback('error', 'Failed to save quiz');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsQuestionModalVisible(true);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setIsQuestionModalVisible(true);
  };

  const handleDeleteQuestion = (question: QuizQuestion) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            try {
              await deleteQuestionMutation.mutateAsync({
                quizId: id,
                questionId: question.id,
              });
              queryClient.invalidateQueries({ queryKey: adminQuizzesKeys.detail(id) });
              showFeedback('success', 'Question deleted');
            } catch (err) {
              showFeedback('error', 'Failed to delete question');
            }
          },
        },
      ]
    );
  };

  const handleQuestionSaved = () => {
    setIsQuestionModalVisible(false);
    setEditingQuestion(null);
    if (id) {
      queryClient.invalidateQueries({ queryKey: adminQuizzesKeys.detail(id) });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Edit Quiz',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading quiz...</Text>
        </View>
      </View>
    );
  }

  if (error || !quiz) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Edit Quiz',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Quiz Not Found</Text>
          <Text style={styles.errorText}>
            The quiz you are looking for does not exist or could not be loaded.
          </Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const categoryOptions: PickerOption[] = categories.map(c => ({ label: c, value: c }));
  const gradeLevelOptions: PickerOption[] = gradeLevels.map(g => ({ label: g === 'All' ? 'All Grades' : `Grades ${g}`, value: g }));
  const difficultyOptions: PickerOption[] = difficulties.map(d => ({ label: d.charAt(0).toUpperCase() + d.slice(1), value: d }));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Edit Quiz',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Feedback banner */}
      {feedbackMessage ? (
        <View style={[
          styles.feedbackBanner,
          feedbackMessage.type === 'success' ? styles.feedbackSuccess : styles.feedbackError
        ]}>
          <Text style={styles.feedbackText}>{feedbackMessage.message}</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quiz Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiz Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter quiz title"
              placeholderTextColor={colors.gray500}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter quiz description"
              placeholderTextColor={colors.gray500}
              multiline
              numberOfLines={3}
            />
          </View>

          <CustomPicker
            label="Category"
            value={category}
            options={categoryOptions}
            onChange={setCategory}
          />

          <CustomPicker
            label="Grade Level"
            value={gradeLevel}
            options={gradeLevelOptions}
            onChange={setGradeLevel}
          />

          <CustomPicker
            label="Difficulty"
            value={difficulty}
            options={difficultyOptions}
            onChange={setDifficulty}
          />

          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Published</Text>
              <Text style={styles.switchDescription}>
                Make this quiz visible to students
              </Text>
            </View>
            <Switch
              value={isPublished}
              onValueChange={setIsPublished}
              trackColor={{ false: colors.gray200, true: `${colors.forestGreen}80` }}
              thumbColor={isPublished ? colors.forestGreen : colors.gray500}
            />
          </View>

          <Pressable
            style={[styles.saveButton, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <Save size={18} color={colors.white} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Questions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Questions</Text>
            <Text style={styles.questionCount}>
              {quiz.questions?.length ?? 0} question{(quiz.questions?.length ?? 0) !== 1 ? 's' : ''}
            </Text>
          </View>

          <Pressable style={styles.addQuestionButton} onPress={handleAddQuestion}>
            <Plus size={18} color={colors.forestGreen} />
            <Text style={styles.addQuestionButtonText}>Add Question</Text>
          </Pressable>

          {quiz.questions && quiz.questions.length > 0 ? (
            <View style={styles.questionsList}>
              {quiz.questions
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    onEdit={() => handleEditQuestion(question)}
                    onDelete={() => handleDeleteQuestion(question)}
                  />
                ))}
            </View>
          ) : (
            <View style={styles.emptyQuestions}>
              <Text style={styles.emptyQuestionsText}>
                No questions yet. Add your first question to get started.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Question Editor Modal */}
      <QuestionEditorModal
        visible={isQuestionModalVisible}
        quizId={id ?? ''}
        question={editingQuestion}
        onClose={() => {
          setIsQuestionModalVisible(false);
          setEditingQuestion(null);
        }}
        onSaved={handleQuestionSaved}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },

  // Loading/Error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Feedback
  feedbackBanner: {
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  feedbackSuccess: {
    backgroundColor: '#D1FAE5',
  },
  feedbackError: {
    backgroundColor: '#FEE2E2',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.gray700,
  },

  // Scroll view
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Section
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 16,
  },
  questionCount: {
    fontSize: 13,
    color: colors.gray500,
  },

  // Input styles
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.gray100,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: colors.gray700,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Picker styles
  pickerContainer: {
    marginBottom: 16,
    zIndex: 1,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray100,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.gray700,
  },
  pickerDropdown: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  pickerOptionSelected: {
    backgroundColor: `${colors.forestGreen}10`,
  },
  pickerOptionText: {
    fontSize: 16,
    color: colors.gray700,
  },
  pickerOptionTextSelected: {
    color: colors.forestGreen,
    fontWeight: '600',
  },

  // Switch styles
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 8,
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 13,
    color: colors.gray500,
  },

  // Save button
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.forestGreen,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  // Add question button
  addQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.forestGreen}10`,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.forestGreen,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  addQuestionButtonText: {
    color: colors.forestGreen,
    fontSize: 14,
    fontWeight: '600',
  },

  // Questions list
  questionsList: {
    gap: 12,
  },
  questionCard: {
    backgroundColor: colors.gray100,
    borderRadius: 10,
    padding: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dragHandle: {
    paddingRight: 8,
    paddingTop: 2,
  },
  questionInfo: {
    flex: 1,
  },
  questionBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  pointsBadge: {
    backgroundColor: colors.gray200,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pointsBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray700,
  },
  questionText: {
    fontSize: 14,
    color: colors.gray700,
    lineHeight: 20,
  },
  questionActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: 12,
  },
  questionActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  questionActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.forestGreen,
  },

  // Empty questions
  emptyQuestions: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyQuestionsText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
  },
});
