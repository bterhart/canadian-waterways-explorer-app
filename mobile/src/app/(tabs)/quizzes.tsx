import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Clock, HelpCircle, ChevronRight, AlertCircle } from 'lucide-react-native';
import { cn } from '@/lib/cn';
import { useQuizzes } from '@/lib/api/education-api';
import type { QuizSummary } from '@/lib/types/education';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  gold: '#C9A227',
};

// Quiz categories - these may come from backend in future
const categories = ['All', 'Explorers', 'Fur Trade', 'Indigenous Heritage', 'Geography', 'Maritime History'] as const;
type Category = typeof categories[number];

// Grade levels
const gradeLevels = ['All', 'K-3', '4-6', '7-9', '10-12'] as const;
type GradeLevel = typeof gradeLevels[number];

// Difficulty types
type Difficulty = 'easy' | 'medium' | 'hard';

// Difficulty badge colors
const difficultyColors: Record<Difficulty, { bg: string; text: string }> = {
  easy: { bg: '#22C55E', text: '#FFFFFF' },
  medium: { bg: colors.gold, text: '#FFFFFF' },
  hard: { bg: '#EF4444', text: '#FFFFFF' },
};

// Category colors for badges
const categoryColors: Record<string, string> = {
  'Explorers': colors.waterBlue,
  'Fur Trade': colors.earthBrown,
  'Indigenous Heritage': '#8B5CF6',
  'Geography': colors.forestGreen,
  'Maritime History': '#0EA5E9',
};

function FilterChip({
  label,
  isSelected,
  onPress
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'px-4 py-2 rounded-full mr-2 mb-2',
        isSelected ? 'bg-[#2D5A3D]' : 'bg-white border border-gray-300'
      )}
    >
      <Text
        className={cn(
          'text-sm font-semibold',
          isSelected ? 'text-white' : 'text-gray-700'
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function QuizCard({ quiz, onPress }: { quiz: QuizSummary; onPress: () => void }) {
  const difficulty = (quiz.difficulty?.toLowerCase() || 'medium') as Difficulty;
  const difficultyStyle = difficultyColors[difficulty] || difficultyColors.medium;
  const category = quiz.category || 'General';
  const categoryColor = categoryColors[category] || colors.forestGreen;

  // Estimate time based on question count (roughly 1 min per question)
  const estimatedMinutes = quiz.questionCount || 5;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl mb-4 mx-4 shadow-sm overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Category stripe at top */}
      <View style={{ backgroundColor: categoryColor, height: 4 }} />

      <View className="p-4">
        {/* Badges row */}
        <View className="flex-row flex-wrap items-center mb-3">
          {/* Category badge */}
          {category ? (
            <View
              className="px-3 py-1 rounded-full mr-2 mb-1"
              style={{ backgroundColor: `${categoryColor}20` }}
            >
              <Text style={{ color: categoryColor }} className="text-xs font-semibold">
                {category}
              </Text>
            </View>
          ) : null}

          {/* Difficulty badge */}
          {quiz.difficulty ? (
            <View
              className="px-3 py-1 rounded-full mr-2 mb-1"
              style={{ backgroundColor: difficultyStyle.bg }}
            >
              <Text style={{ color: difficultyStyle.text }} className="text-xs font-semibold capitalize">
                {quiz.difficulty}
              </Text>
            </View>
          ) : null}

          {/* Grade level badge */}
          {quiz.gradeLevel ? (
            <View className="px-3 py-1 rounded-full bg-gray-100 mb-1">
              <Text className="text-xs font-semibold text-gray-600">
                Grade {quiz.gradeLevel}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Title and description */}
        <Text className="text-lg font-bold text-gray-900 mb-2">
          {quiz.title}
        </Text>
        {quiz.description ? (
          <Text className="text-sm text-gray-600 mb-3 leading-5" numberOfLines={2}>
            {quiz.description}
          </Text>
        ) : null}

        {/* Footer with stats */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <HelpCircle size={16} color="#6B7280" />
              <Text className="text-sm text-gray-500 ml-1">
                {quiz.questionCount} question{quiz.questionCount !== 1 ? 's' : ''}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={16} color="#6B7280" />
              <Text className="text-sm text-gray-500 ml-1">
                ~{estimatedMinutes} min
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm font-semibold" style={{ color: colors.forestGreen }}>
              Start Quiz
            </Text>
            <ChevronRight size={18} color={colors.forestGreen} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function QuizzesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<GradeLevel>('All');

  // Build filter params for API
  const filterParams: { category?: string; gradeLevel?: string } = {};
  if (selectedCategory !== 'All') {
    filterParams.category = selectedCategory;
  }
  if (selectedGradeLevel !== 'All') {
    filterParams.gradeLevel = selectedGradeLevel;
  }

  // Fetch quizzes from backend
  const { data: quizzes, isLoading, isError, error, refetch } = useQuizzes(
    Object.keys(filterParams).length > 0 ? filterParams : undefined
  );

  // Filter quizzes client-side for category if backend doesn't support it fully
  const filteredQuizzes = React.useMemo(() => {
    if (!quizzes) return [];

    return quizzes.filter(quiz => {
      // Filter by category if selected
      if (selectedCategory !== 'All') {
        const quizCategory = quiz.category || '';
        if (!quizCategory.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }
      // Filter by grade level if selected - database stores ranges like 'K-3', '4-6', etc.
      if (selectedGradeLevel !== 'All') {
        const gradeLevel = quiz.gradeLevel || '';
        if (gradeLevel !== selectedGradeLevel) {
          return false;
        }
      }
      return true;
    });
  }, [quizzes, selectedCategory, selectedGradeLevel]);

  const handleQuizPress = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFFEF7]">
        <ActivityIndicator size="large" color={colors.forestGreen} />
        <Text className="mt-4 text-base font-medium" style={{ color: colors.forestGreen }}>
          Loading quizzes...
        </Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFFEF7] px-6">
        <AlertCircle size={48} color="#EF4444" />
        <Text className="mt-4 text-lg font-semibold text-gray-900 text-center">
          Unable to Load Quizzes
        </Text>
        <Text className="mt-2 text-base text-gray-600 text-center">
          {error instanceof Error ? error.message : 'Please check your connection and try again.'}
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="mt-6 px-6 py-3 rounded-xl"
          style={{ backgroundColor: colors.forestGreen }}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FFFEF7]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header section */}
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center mb-2">
            <BookOpen size={28} color={colors.forestGreen} />
            <Text className="text-2xl font-bold ml-2" style={{ color: colors.forestGreen }}>
              Discover Quizzes
            </Text>
          </View>
          <Text className="text-sm text-gray-600 mb-4">
            Test your knowledge about Canadian history, geography, and heritage
          </Text>
        </View>

        {/* Category filters */}
        <View className="px-4 mb-2">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
          >
            <View className="flex-row">
              {categories.map(category => (
                <FilterChip
                  key={category}
                  label={category}
                  isSelected={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Grade level filters */}
        <View className="px-4 mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Grade Level
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
          >
            <View className="flex-row">
              {gradeLevels.map(level => (
                <FilterChip
                  key={level}
                  label={level === 'All' ? 'All Grades' : `Grades ${level}`}
                  isSelected={selectedGradeLevel === level}
                  onPress={() => setSelectedGradeLevel(level)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Results count */}
        <View className="px-4 mb-3">
          <Text className="text-sm text-gray-500">
            {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''} available
          </Text>
        </View>

        {/* Quiz cards */}
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map(quiz => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onPress={() => handleQuizPress(quiz.id)}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-16 px-8">
            <BookOpen size={48} color="#D1D5DB" />
            <Text className="text-lg font-semibold text-gray-400 mt-4 text-center">
              No quizzes found
            </Text>
            <Text className="text-sm text-gray-400 mt-2 text-center">
              Try adjusting your filters to find more quizzes
            </Text>
          </View>
        )}

        {/* Bottom padding */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
