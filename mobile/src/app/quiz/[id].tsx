import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Check, X, Trophy, ChevronRight, RotateCcw, AlertCircle } from 'lucide-react-native';
import { cn } from '@/lib/cn';
import { useQuiz, useSubmitQuizAttempt } from '@/lib/api/education-api';
import type { QuizQuestion, QuizOption, QuizAttemptResult } from '@/lib/types/education';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  gold: '#C9A227',
};

type QuizState = 'taking' | 'submitting' | 'results';

interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100;
  return (
    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <View
        className="h-full rounded-full"
        style={{ width: `${progress}%`, backgroundColor: colors.forestGreen }}
      />
    </View>
  );
}

function OptionCard({
  option,
  index,
  isSelected,
  onSelect,
  disabled,
}: {
  option: QuizOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  return (
    <Pressable
      onPress={onSelect}
      disabled={disabled}
      className={cn(
        'flex-row items-center p-4 mb-3 rounded-xl border-2',
        isSelected
          ? 'border-[#2D5A3D] bg-[#2D5A3D]/10'
          : 'border-gray-200 bg-white'
      )}
    >
      <View
        className={cn(
          'w-10 h-10 rounded-full items-center justify-center mr-3',
          isSelected ? 'bg-[#2D5A3D]' : 'bg-gray-100'
        )}
      >
        <Text
          className={cn(
            'text-lg font-bold',
            isSelected ? 'text-white' : 'text-gray-600'
          )}
        >
          {letters[index] || (index + 1).toString()}
        </Text>
      </View>
      <Text
        className={cn(
          'flex-1 text-base',
          isSelected ? 'text-[#2D5A3D] font-semibold' : 'text-gray-700'
        )}
      >
        {option.text}
      </Text>
      {isSelected ? (
        <View className="w-6 h-6 rounded-full bg-[#2D5A3D] items-center justify-center">
          <Check size={16} color="white" strokeWidth={3} />
        </View>
      ) : null}
    </Pressable>
  );
}

function ResultCard({
  result,
  question,
  index,
}: {
  result: QuizAttemptResult;
  question: QuizQuestion;
  index: number;
}) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const isCorrect = result.isCorrect;

  // Find option texts for display
  const selectedOption = question.options.find(o => o.id === result.selectedAnswer);
  const correctOption = question.options.find(o => o.id === result.correctAnswer);
  const selectedIndex = question.options.findIndex(o => o.id === result.selectedAnswer);
  const correctIndex = question.options.findIndex(o => o.id === result.correctAnswer);

  return (
    <View className="bg-white rounded-xl mb-4 p-4 shadow-sm">
      {/* Question header */}
      <View className="flex-row items-start mb-3">
        <View
          className={cn(
            'w-8 h-8 rounded-full items-center justify-center mr-3',
            isCorrect ? 'bg-green-500' : 'bg-red-500'
          )}
        >
          {isCorrect ? (
            <Check size={18} color="white" strokeWidth={3} />
          ) : (
            <X size={18} color="white" strokeWidth={3} />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-sm text-gray-500 mb-1">Question {index + 1}</Text>
          <Text className="text-base font-semibold text-gray-900">
            {question.questionText}
          </Text>
        </View>
      </View>

      {/* Answer info */}
      <View className="ml-11 mb-3">
        <Text className="text-sm text-gray-600 mb-1">
          Your answer:{' '}
          <Text className={isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {selectedIndex >= 0 ? `${letters[selectedIndex]}. ` : null}{selectedOption?.text ?? 'No answer'}
          </Text>
        </Text>
        {!isCorrect && correctOption ? (
          <Text className="text-sm text-gray-600">
            Correct answer:{' '}
            <Text className="text-green-600 font-semibold">
              {correctIndex >= 0 ? `${letters[correctIndex]}. ` : null}{correctOption.text}
            </Text>
          </Text>
        ) : null}
      </View>

      {/* Explanation */}
      {result.explanation ? (
        <View className="ml-11 bg-blue-50 rounded-lg p-3">
          <Text className="text-sm text-blue-800">{result.explanation}</Text>
        </View>
      ) : null}
    </View>
  );
}

function getScoreMessage(percentage: number): { message: string } {
  if (percentage === 100) return { message: 'Perfect Score! Outstanding!' };
  if (percentage >= 80) return { message: 'Excellent Work! Great job!' };
  if (percentage >= 60) return { message: 'Good Effort! Keep learning!' };
  if (percentage >= 40) return { message: 'Nice Try! Review and try again!' };
  return { message: 'Keep Practicing! You can do it!' };
}

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [quizState, setQuizState] = useState<QuizState>('taking');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [attemptResults, setAttemptResults] = useState<QuizAttemptResult[]>([]);
  const [totalScore, setTotalScore] = useState({ correct: 0, total: 0, percentage: 0 });

  // Fetch quiz from backend
  const { data: quiz, isLoading, isError, error } = useQuiz(id ?? null);
  const submitAttemptMutation = useSubmitQuizAttempt();

  // Handle quiz submission
  const handleSubmitQuiz = async () => {
    if (!quiz || !id) return;

    setQuizState('submitting');

    try {
      const response = await submitAttemptMutation.mutateAsync({
        quizId: id,
        payload: {
          answers: userAnswers.map(a => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedOptionId,
          })),
        },
      });

      setAttemptResults(response.results);
      setTotalScore({
        correct: response.score,
        total: response.totalQuestions,
        percentage: response.percentageScore,
      });
      setQuizState('results');
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      // Still show results locally even if submission failed
      const correctCount = userAnswers.filter((a, i) => {
        const question = quiz.questions[i];
        // Find the correct answer - we don't have it client-side, so we'll just show what was selected
        return false; // Can't determine without server
      }).length;

      setQuizState('results');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFFEF7]">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
        <Text className="mt-4 text-base text-gray-600">Loading quiz...</Text>
      </View>
    );
  }

  // Error state
  if (isError || !quiz) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFFEF7] px-6">
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Quiz',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
          }}
        />
        <AlertCircle size={48} color="#EF4444" />
        <Text className="mt-4 text-lg font-semibold text-gray-900 text-center">
          Quiz Not Found
        </Text>
        <Text className="mt-2 text-base text-gray-600 text-center">
          {error instanceof Error ? error.message : 'This quiz may no longer be available.'}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 rounded-xl"
          style={{ backgroundColor: colors.forestGreen }}
        >
          <Text className="text-white font-semibold">Back to Quizzes</Text>
        </Pressable>
      </View>
    );
  }

  // No questions
  if (quiz.questions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFFEF7] px-6">
        <Stack.Screen
          options={{
            headerShown: true,
            title: quiz.title,
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
          }}
        />
        <AlertCircle size={48} color={colors.gold} />
        <Text className="mt-4 text-lg font-semibold text-gray-900 text-center">
          No Questions Available
        </Text>
        <Text className="mt-2 text-base text-gray-600 text-center">
          This quiz does not have any questions yet.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 rounded-xl"
          style={{ backgroundColor: colors.forestGreen }}
        >
          <Text className="text-white font-semibold">Back to Quizzes</Text>
        </Pressable>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const canProceed = selectedOptionId !== null;

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleNext = () => {
    if (selectedOptionId === null || !currentQuestion) return;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId,
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Submit the quiz
      setUserAnswers(updatedAnswers);
      // Need to use the updated answers directly since state won't update in time
      handleSubmitWithAnswers(updatedAnswers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
    }
  };

  const handleSubmitWithAnswers = async (answers: UserAnswer[]) => {
    if (!quiz || !id) return;

    setQuizState('submitting');

    try {
      const response = await submitAttemptMutation.mutateAsync({
        quizId: id,
        payload: {
          answers: answers.map(a => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedOptionId,
          })),
        },
      });

      setAttemptResults(response.results);
      setTotalScore({
        correct: response.score,
        total: response.totalQuestions,
        percentage: response.percentageScore,
      });
      setQuizState('results');
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setQuizState('results');
    }
  };

  const handleRetakeQuiz = () => {
    setQuizState('taking');
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setUserAnswers([]);
    setAttemptResults([]);
    setTotalScore({ correct: 0, total: 0, percentage: 0 });
  };

  const handleBackToQuizzes = () => {
    router.back();
  };

  // Submitting state
  if (quizState === 'submitting') {
    return (
      <View className="flex-1 items-center justify-center bg-[#FFFEF7]">
        <Stack.Screen
          options={{
            headerShown: true,
            title: quiz.title,
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 16 },
          }}
        />
        <ActivityIndicator size="large" color={colors.forestGreen} />
        <Text className="mt-4 text-base text-gray-600">Submitting your answers...</Text>
      </View>
    );
  }

  // Results Screen
  if (quizState === 'results') {
    const scoreInfo = getScoreMessage(totalScore.percentage);

    return (
      <View className="flex-1 bg-[#FFFEF7]">
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Quiz Results',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
            headerTitleStyle: { fontWeight: 'bold' },
            headerLeft: () => (
              <Pressable onPress={handleBackToQuizzes} className="mr-4">
                <ArrowLeft size={24} color="white" />
              </Pressable>
            ),
          }}
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Score card */}
          <View className="mx-4 mt-4 bg-white rounded-2xl p-6 shadow-sm items-center">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: totalScore.percentage >= 60 ? '#22C55E' : colors.gold }}
            >
              <Trophy size={40} color="white" />
            </View>

            <Text className="text-4xl font-bold text-gray-900 mb-2">
              {totalScore.correct}/{totalScore.total}
            </Text>
            <Text className="text-xl text-gray-600 mb-2">
              {Math.round(totalScore.percentage)}% Correct
            </Text>
            <Text className="text-lg font-semibold text-center" style={{ color: colors.forestGreen }}>
              {scoreInfo.message}
            </Text>
          </View>

          {/* Action buttons */}
          <View className="flex-row px-4 mt-4 mb-4">
            <Pressable
              onPress={handleRetakeQuiz}
              className="flex-1 flex-row items-center justify-center py-3 rounded-xl mr-2 border-2"
              style={{ borderColor: colors.forestGreen }}
            >
              <RotateCcw size={20} color={colors.forestGreen} />
              <Text className="ml-2 font-semibold" style={{ color: colors.forestGreen }}>
                Retake Quiz
              </Text>
            </Pressable>
            <Pressable
              onPress={handleBackToQuizzes}
              className="flex-1 flex-row items-center justify-center py-3 rounded-xl ml-2"
              style={{ backgroundColor: colors.forestGreen }}
            >
              <Text className="font-semibold text-white">Back to Quizzes</Text>
            </Pressable>
          </View>

          {/* Review section */}
          {attemptResults.length > 0 ? (
            <>
              <View className="px-4 mb-2">
                <Text className="text-lg font-bold text-gray-900 mb-3">
                  Review Your Answers
                </Text>
              </View>

              {/* Question results */}
              <View className="px-4">
                {quiz.questions.map((question, index) => {
                  const result = attemptResults.find(r => r.questionId === question.id);
                  if (!result) return null;
                  return (
                    <ResultCard
                      key={question.id}
                      result={result}
                      question={question}
                      index={index}
                    />
                  );
                })}
              </View>
            </>
          ) : null}

          <View className="h-8" />
        </ScrollView>
      </View>
    );
  }

  // Quiz Taking Screen
  return (
    <View className="flex-1 bg-[#FFFEF7]">
      <Stack.Screen
        options={{
          headerShown: true,
          title: quiz.title,
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 16 },
          headerLeft: () => (
            <Pressable onPress={handleBackToQuizzes} className="mr-4">
              <ArrowLeft size={24} color="white" />
            </Pressable>
          ),
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Progress section */}
        <View className="px-4 pt-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-semibold text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Text>
            <Text className="text-sm font-semibold" style={{ color: colors.forestGreen }}>
              {Math.round(((currentQuestionIndex) / quiz.questions.length) * 100)}% Complete
            </Text>
          </View>
          <ProgressBar current={currentQuestionIndex} total={quiz.questions.length} />
        </View>

        {/* Question card */}
        <View className="mx-4 mt-6 bg-white rounded-2xl p-5 shadow-sm">
          <View
            className="w-12 h-12 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: `${colors.waterBlue}20` }}
          >
            <Text className="text-xl font-bold" style={{ color: colors.waterBlue }}>
              {currentQuestionIndex + 1}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-900 leading-7">
            {currentQuestion.questionText}
          </Text>
        </View>

        {/* Options */}
        <View className="px-4 mt-6">
          <Text className="text-sm font-semibold text-gray-600 mb-3">
            Select your answer:
          </Text>
          {currentQuestion.options.map((option, index) => (
            <OptionCard
              key={option.id}
              option={option}
              index={index}
              isSelected={selectedOptionId === option.id}
              onSelect={() => handleSelectOption(option.id)}
              disabled={false}
            />
          ))}
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Bottom action button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 pb-8">
        <Pressable
          onPress={handleNext}
          disabled={!canProceed}
          className={cn(
            'flex-row items-center justify-center py-4 rounded-xl',
            canProceed ? 'bg-[#2D5A3D]' : 'bg-gray-300'
          )}
        >
          <Text className="text-lg font-semibold text-white mr-2">
            {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
          </Text>
          <ChevronRight size={22} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
