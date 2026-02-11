import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Check, ChevronDown } from 'lucide-react-native';
import {
  useAddQuizQuestion,
  useUpdateQuizQuestion,
  useExplorers,
  useWaterways,
  useLocations,
} from '@/lib/api/waterways-api';
import type { QuizQuestion, QuizOption } from '@/lib/types/waterways';

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
};

// Question types
const questionTypes = [
  { label: 'Multiple Choice', value: 'multiple_choice' },
  { label: 'True/False', value: 'true_false' },
] as const;

// Source types
const sourceTypes = [
  { label: 'None', value: '' },
  { label: 'Explorer', value: 'explorer' },
  { label: 'Waterway', value: 'waterway' },
  { label: 'Location', value: 'location' },
] as const;

interface QuestionEditorModalProps {
  visible: boolean;
  quizId: string;
  question: QuizQuestion | null;
  onClose: () => void;
  onSaved: () => void;
}

interface PickerOption {
  label: string;
  value: string;
}

interface CustomPickerProps {
  label: string;
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

function CustomPicker({ label, value, options, onChange, placeholder }: CustomPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable
        style={styles.pickerButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[
          styles.pickerButtonText,
          !selectedOption && styles.pickerPlaceholder,
        ]}>
          {selectedOption?.label ?? placeholder ?? 'Select...'}
        </Text>
        <ChevronDown size={20} color={colors.gray500} />
      </Pressable>
      {isOpen ? (
        <View style={styles.pickerDropdown}>
          <ScrollView style={styles.pickerScrollView} nestedScrollEnabled>
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
                ]} numberOfLines={1}>
                  {option.label}
                </Text>
                {option.value === value ? (
                  <Check size={18} color={colors.forestGreen} />
                ) : null}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function generateOptionId(): string {
  return `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function QuestionEditorModal({
  visible,
  quizId,
  question,
  onClose,
  onSaved,
}: QuestionEditorModalProps) {
  const addMutation = useAddQuizQuestion();
  const updateMutation = useUpdateQuizQuestion();

  // Fetch sources for dropdowns
  const { data: explorers } = useExplorers();
  const { data: waterways } = useWaterways();
  const { data: locations } = useLocations();

  // Form state
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'true_false'>('multiple_choice');
  const [options, setOptions] = useState<QuizOption[]>([
    { id: generateOptionId(), text: '' },
    { id: generateOptionId(), text: '' },
    { id: generateOptionId(), text: '' },
    { id: generateOptionId(), text: '' },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [explanation, setExplanation] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [points, setPoints] = useState('1');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // True/False options
  const trueFalseOptions: QuizOption[] = [
    { id: 'true', text: 'True' },
    { id: 'false', text: 'False' },
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      if (question) {
        // Editing existing question
        setQuestionText(question.questionText);
        setQuestionType(question.questionType);
        if (question.questionType === 'true_false') {
          setOptions(trueFalseOptions);
        } else {
          setOptions(question.options.length > 0 ? question.options : [
            { id: generateOptionId(), text: '' },
            { id: generateOptionId(), text: '' },
            { id: generateOptionId(), text: '' },
            { id: generateOptionId(), text: '' },
          ]);
        }
        setCorrectAnswer(question.correctAnswer ?? '');
        setExplanation(question.explanation ?? '');
        setSourceType(question.sourceType ?? '');
        setSourceId(question.sourceId ?? '');
        setPoints(String(question.points));
      } else {
        // Creating new question
        setQuestionText('');
        setQuestionType('multiple_choice');
        setOptions([
          { id: generateOptionId(), text: '' },
          { id: generateOptionId(), text: '' },
          { id: generateOptionId(), text: '' },
          { id: generateOptionId(), text: '' },
        ]);
        setCorrectAnswer('');
        setExplanation('');
        setSourceType('');
        setSourceId('');
        setPoints('1');
      }
      setError(null);
    }
  }, [visible, question]);

  // Handle question type change
  useEffect(() => {
    if (questionType === 'true_false') {
      setOptions(trueFalseOptions);
      if (correctAnswer && correctAnswer !== 'true' && correctAnswer !== 'false') {
        setCorrectAnswer('');
      }
    } else if (questionType === 'multiple_choice' && options.length === 2 && options[0].id === 'true') {
      // Switching from true/false to multiple choice
      setOptions([
        { id: generateOptionId(), text: '' },
        { id: generateOptionId(), text: '' },
        { id: generateOptionId(), text: '' },
        { id: generateOptionId(), text: '' },
      ]);
      setCorrectAnswer('');
    }
  }, [questionType]);

  // Reset source ID when source type changes
  useEffect(() => {
    setSourceId('');
  }, [sourceType]);

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    setOptions(newOptions);
  };

  const validateForm = (): boolean => {
    if (!questionText.trim()) {
      setError('Question text is required');
      return false;
    }

    if (questionType === 'multiple_choice') {
      const filledOptions = options.filter(opt => opt.text.trim());
      if (filledOptions.length < 2) {
        setError('At least 2 options are required');
        return false;
      }
    }

    if (!correctAnswer) {
      setError('Please select the correct answer');
      return false;
    }

    const parsedPoints = parseInt(points, 10);
    if (isNaN(parsedPoints) || parsedPoints < 1) {
      setError('Points must be at least 1');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setError(null);

    try {
      const finalOptions = questionType === 'true_false'
        ? trueFalseOptions
        : options.filter(opt => opt.text.trim());

      const payload = {
        questionText: questionText.trim(),
        questionType,
        options: finalOptions,
        correctAnswer,
        explanation: explanation.trim() || undefined,
        sourceType: sourceType || undefined,
        sourceId: sourceId || undefined,
        points: parseInt(points, 10),
      };

      if (question) {
        // Update existing question
        await updateMutation.mutateAsync({
          quizId,
          questionId: question.id,
          ...payload,
        });
      } else {
        // Add new question
        await addMutation.mutateAsync({
          quizId,
          ...payload,
        });
      }

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save question');
    } finally {
      setIsSaving(false);
    }
  };

  // Build source options based on source type
  const getSourceOptions = (): PickerOption[] => {
    switch (sourceType) {
      case 'explorer':
        return explorers?.map(e => ({ label: e.name, value: e.id })) ?? [];
      case 'waterway':
        return waterways?.map(w => ({ label: w.name, value: w.id })) ?? [];
      case 'location':
        return locations?.map(l => ({ label: l.name, value: l.id })) ?? [];
      default:
        return [];
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];
  const currentOptions = questionType === 'true_false' ? trueFalseOptions : options;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        {/* Header */}
        <View style={styles.modalHeader}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.gray700} />
          </Pressable>
          <Text style={styles.modalTitle}>
            {question ? 'Edit Question' : 'Add Question'}
          </Text>
          <Pressable
            style={[styles.saveModalButton, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.saveModalButtonText}>Save</Text>
            )}
          </Pressable>
        </View>

        {/* Error banner */}
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        ) : null}

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Question text */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Question Text *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={questionText}
              onChangeText={setQuestionText}
              placeholder="Enter your question"
              placeholderTextColor={colors.gray500}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Question type */}
          <CustomPicker
            label="Question Type"
            value={questionType}
            options={questionTypes.map(t => ({ label: t.label, value: t.value }))}
            onChange={(value) => setQuestionType(value as 'multiple_choice' | 'true_false')}
          />

          {/* Options */}
          <View style={styles.optionsSection}>
            <Text style={styles.inputLabel}>
              {questionType === 'true_false' ? 'Options' : 'Answer Options *'}
            </Text>
            {currentOptions.map((option, index) => (
              <View key={option.id} style={styles.optionRow}>
                <Pressable
                  style={[
                    styles.radioButton,
                    correctAnswer === option.id && styles.radioButtonSelected,
                  ]}
                  onPress={() => setCorrectAnswer(option.id)}
                >
                  {correctAnswer === option.id ? (
                    <Check size={14} color={colors.white} />
                  ) : null}
                </Pressable>
                {questionType === 'true_false' ? (
                  <Text style={styles.optionLabel}>{option.text}</Text>
                ) : (
                  <>
                    <Text style={styles.optionLetter}>{optionLabels[index]}</Text>
                    <TextInput
                      style={styles.optionInput}
                      value={option.text}
                      onChangeText={(text) => handleOptionChange(index, text)}
                      placeholder={`Option ${optionLabels[index]}`}
                      placeholderTextColor={colors.gray500}
                    />
                  </>
                )}
              </View>
            ))}
            <Text style={styles.helperText}>
              Tap the circle to mark the correct answer
            </Text>
          </View>

          {/* Explanation */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Explanation</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={explanation}
              onChangeText={setExplanation}
              placeholder="Explain why this answer is correct (shown after quiz)"
              placeholderTextColor={colors.gray500}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Source type */}
          <CustomPicker
            label="Related Content (Optional)"
            value={sourceType}
            options={sourceTypes.map(t => ({ label: t.label, value: t.value }))}
            onChange={setSourceType}
          />

          {/* Source ID */}
          {sourceType ? (
            <CustomPicker
              label={`Select ${sourceType.charAt(0).toUpperCase() + sourceType.slice(1)}`}
              value={sourceId}
              options={getSourceOptions()}
              onChange={setSourceId}
              placeholder={`Select a ${sourceType}...`}
            />
          ) : null}

          {/* Points */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Points</Text>
            <TextInput
              style={[styles.textInput, styles.pointsInput]}
              value={points}
              onChangeText={setPoints}
              placeholder="1"
              placeholderTextColor={colors.gray500}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },

  // Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray700,
  },
  saveModalButton: {
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveModalButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Error banner
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  errorBannerText: {
    color: colors.red600,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Scroll
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 16,
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
    backgroundColor: colors.white,
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
  pointsInput: {
    width: 80,
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
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.gray700,
  },
  pickerPlaceholder: {
    color: colors.gray500,
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
    maxHeight: 200,
  },
  pickerScrollView: {
    maxHeight: 200,
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
    flex: 1,
    marginRight: 8,
  },
  pickerOptionTextSelected: {
    color: colors.forestGreen,
    fontWeight: '600',
  },

  // Options section
  optionsSection: {
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray300,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray700,
    marginRight: 12,
    width: 16,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.gray700,
    flex: 1,
  },
  optionInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.gray700,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  helperText: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 4,
    fontStyle: 'italic',
  },

  bottomPadding: {
    height: 40,
  },
});
