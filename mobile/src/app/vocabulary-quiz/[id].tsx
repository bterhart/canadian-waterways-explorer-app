// Vocabulary quiz player (decision 10, 2026-10-16). Each question shows a word in an
// Indigenous language and four translations; the server grades the whole attempt at
// POST /api/indigenous-language/vocabulary-quizzes/:id/submit. No points are awarded.
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { GraduationCap, CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react-native';
import { useVocabularyQuiz, useSubmitVocabularyQuiz } from '@/lib/api/education-api';
import type { VocabularyQuizResult } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  correct: '#10B981',
  wrong: '#EF4444',
};

export default function VocabularyQuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: quiz, isLoading, isError } = useVocabularyQuiz(id ?? null);
  const submit = useSubmitVocabularyQuiz();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<VocabularyQuizResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }

  if (isError || !quiz || quiz.questions.length === 0) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Vocabulary Quiz' }} />
        <Text style={styles.errorText}>Unable to load this quiz</Text>
      </View>
    );
  }

  const questions = quiz.questions;
  const question = questions[index]!;
  const isLast = index === questions.length - 1;

  const handleNext = async () => {
    if (!selected || !id) return;
    const nextAnswers = { ...answers, [question.id]: selected };
    setAnswers(nextAnswers);
    setSelected(null);
    if (!isLast) {
      setIndex(index + 1);
      return;
    }
    try {
      setSubmitError(null);
      const graded = await submit.mutateAsync({
        quizId: id,
        payload: {
          answers: Object.entries(nextAnswers).map(([questionId, selectedAnswer]) => ({ questionId, selectedAnswer })),
        },
      });
      setResult(graded);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit your answers');
    }
  };

  const handleRetry = () => {
    setIndex(0);
    setAnswers({});
    setSelected(null);
    setResult(null);
    setSubmitError(null);
  };

  if (result) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Stack.Screen
          options={{ title: quiz.title, headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }}
        />
        <View style={styles.resultHeader}>
          <GraduationCap size={40} color={result.score >= 60 ? colors.correct : colors.forestGreen} />
          <Text style={styles.resultScore}>{result.score}%</Text>
          <Text style={styles.resultLine}>
            {result.correctCount} of {result.totalQuestions} correct
          </Text>
        </View>
        {result.results.map((r) => (
          <View key={r.questionId} style={styles.resultRow}>
            {r.isCorrect ? <CheckCircle2 size={20} color={colors.correct} /> : <XCircle size={20} color={colors.wrong} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.resultWord}>{r.word}</Text>
              <Text style={styles.resultAnswer}>
                {r.isCorrect ? r.correctAnswer : `You chose "${r.selectedAnswer}". Correct: ${r.correctAnswer}`}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.actions}>
          <Pressable style={styles.secondaryButton} onPress={handleRetry}>
            <RotateCcw size={18} color={colors.forestGreen} />
            <Text style={styles.secondaryButtonText}>Try again</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonText}>Done</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: quiz.title, headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }}
      />
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((index + 1) / questions.length) * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.counter}>
          Word {index + 1} of {questions.length} · {quiz.language}
        </Text>
        <View style={styles.wordCard}>
          <Text style={styles.prompt}>What does this word mean?</Text>
          <Text style={styles.word}>{question.word}</Text>
        </View>
        {question.options.map((option) => (
          <Pressable
            key={option}
            style={[styles.option, selected === option && styles.optionSelected]}
            onPress={() => setSelected(option)}
          >
            <Text style={[styles.optionText, selected === option && styles.optionTextSelected]}>{option}</Text>
          </Pressable>
        ))}
        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
        <Pressable
          style={[styles.primaryButton, (!selected || submit.isPending) && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selected || submit.isPending}
        >
          {submit.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>{isLast ? 'Finish' : 'Next'}</Text>
              <ChevronRight size={18} color="white" />
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.creamWhite },
  errorText: { fontSize: 15, color: colors.wrong, marginTop: 8 },
  progressBar: { height: 4, backgroundColor: '#E5E7EB' },
  progressFill: { height: 4, backgroundColor: colors.forestGreen },
  counter: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  wordCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E4D8',
  },
  prompt: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  word: { fontSize: 32, fontWeight: '700', color: colors.darkGreen, textAlign: 'center' },
  option: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionSelected: { borderColor: colors.forestGreen, backgroundColor: '#E8F5E9' },
  optionText: { fontSize: 16, color: '#1F2937' },
  optionTextSelected: { color: colors.darkGreen, fontWeight: '600' },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.forestGreen,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 12,
    flex: 1,
  },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: '700' },
  buttonDisabled: { opacity: 0.5 },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 12,
    borderWidth: 2,
    borderColor: colors.forestGreen,
    flex: 1,
  },
  secondaryButtonText: { color: colors.forestGreen, fontSize: 16, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  resultHeader: { alignItems: 'center', marginBottom: 20 },
  resultScore: { fontSize: 40, fontWeight: '800', color: colors.darkGreen, marginTop: 8 },
  resultLine: { fontSize: 15, color: '#6B7280' },
  resultRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8E4D8',
  },
  resultWord: { fontSize: 16, fontWeight: '700', color: colors.darkGreen },
  resultAnswer: { fontSize: 14, color: '#4B5563', marginTop: 2 },
});
