import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Save, ChevronDown, Check } from 'lucide-react-native';
import { useCreateQuiz, adminQuizzesKeys } from '@/lib/api/waterways-api';

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

export default function NewQuizScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMutation = useCreateQuiz();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Explorers');
  const [gradeLevel, setGradeLevel] = useState<string>('All');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [isPublished, setIsPublished] = useState(false);

  // Feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        gradeLevel: gradeLevel === 'All' ? undefined : gradeLevel,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        isPublished,
      });

      // Invalidate quiz list
      queryClient.invalidateQueries({ queryKey: adminQuizzesKeys.list() });

      // Navigate to the edit screen for the new quiz
      router.replace(`/admin/quiz-editor/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
      setIsSaving(false);
    }
  };

  const categoryOptions: PickerOption[] = categories.map(c => ({ label: c, value: c }));
  const gradeLevelOptions: PickerOption[] = gradeLevels.map(g => ({ label: g === 'All' ? 'All Grades' : `Grades ${g}`, value: g }));
  const difficultyOptions: PickerOption[] = difficulties.map(d => ({ label: d.charAt(0).toUpperCase() + d.slice(1), value: d }));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Create New Quiz',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Error banner */}
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Fill in the quiz details below. After creating the quiz, you will be able to add questions.
          </Text>
        </View>

        {/* Form Section */}
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
                Make this quiz visible to students immediately
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
            style={[styles.createButton, isSaving && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <Save size={18} color={colors.white} />
                <Text style={styles.createButtonText}>Create Quiz</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
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

  // Scroll view
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Info card
  infoCard: {
    backgroundColor: `${colors.waterBlue}15`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${colors.waterBlue}30`,
  },
  infoText: {
    fontSize: 14,
    color: colors.waterBlue,
    lineHeight: 20,
  },

  // Section
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 16,
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

  // Create button
  createButton: {
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
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
