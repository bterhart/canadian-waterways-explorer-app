import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  FileEdit,
  Trash2,
  Eye,
  EyeOff,
  HelpCircle,
  Users,
  ChevronRight,
} from 'lucide-react-native';
import {
  useAdminQuizzes,
  useDeleteQuiz,
  adminQuizzesKeys,
} from '@/lib/api/waterways-api';
import type { Quiz } from '@/lib/types/waterways';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray500: '#6B7280',
  gray700: '#374151',
  red500: '#EF4444',
  red600: '#DC2626',
  green500: '#22C55E',
  green600: '#16A34A',
  gold: '#C9A227',
};

// Category colors
const categoryColors: Record<string, string> = {
  'Explorers': colors.waterBlue,
  'Fur Trade': colors.earthBrown,
  'Indigenous Heritage': '#8B5CF6',
  'Geography': colors.forestGreen,
  'Maritime History': '#0EA5E9',
};

// Difficulty badge colors
const difficultyColors: Record<string, { bg: string; text: string }> = {
  easy: { bg: colors.green500, text: colors.white },
  medium: { bg: colors.gold, text: colors.white },
  hard: { bg: colors.red500, text: colors.white },
};

interface QuizCardProps {
  quiz: Quiz;
  onEdit: () => void;
  onDelete: () => void;
}

function QuizCard({ quiz, onEdit, onDelete }: QuizCardProps) {
  const categoryColor = categoryColors[quiz.category] ?? colors.forestGreen;
  const difficultyStyle = difficultyColors[quiz.difficulty] ?? difficultyColors.medium;

  return (
    <View style={styles.quizCard}>
      {/* Category stripe */}
      <View style={[styles.categoryStripe, { backgroundColor: categoryColor }]} />

      <View style={styles.cardContent}>
        {/* Status and badges row */}
        <View style={styles.badgesRow}>
          {/* Published status */}
          <View style={[
            styles.statusBadge,
            quiz.isPublished ? styles.publishedBadge : styles.draftBadge
          ]}>
            {quiz.isPublished ? (
              <Eye size={12} color={colors.green600} />
            ) : (
              <EyeOff size={12} color={colors.gray500} />
            )}
            <Text style={[
              styles.statusText,
              { color: quiz.isPublished ? colors.green600 : colors.gray500 }
            ]}>
              {quiz.isPublished ? 'Published' : 'Draft'}
            </Text>
          </View>

          {/* Category badge */}
          <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {quiz.category}
            </Text>
          </View>

          {/* Difficulty badge */}
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyStyle.bg }]}>
            <Text style={[styles.difficultyText, { color: difficultyStyle.text }]}>
              {quiz.difficulty}
            </Text>
          </View>
        </View>

        {/* Title and description */}
        <Text style={styles.quizTitle} numberOfLines={2}>
          {quiz.title}
        </Text>
        {quiz.description ? (
          <Text style={styles.quizDescription} numberOfLines={2}>
            {quiz.description}
          </Text>
        ) : null}

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <HelpCircle size={16} color={colors.gray500} />
            <Text style={styles.statText}>
              {quiz.questionCount ?? 0} questions
            </Text>
          </View>
          {quiz.gradeLevel ? (
            <View style={styles.statItem}>
              <Users size={16} color={colors.gray500} />
              <Text style={styles.statText}>
                Grade {quiz.gradeLevel}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Actions row */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.editButton} onPress={onEdit}>
            <FileEdit size={18} color={colors.forestGreen} />
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Trash2 size={18} color={colors.red600} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function AdminQuizzesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: quizzes, isLoading, error, refetch } = useAdminQuizzes();
  const deleteMutation = useDeleteQuiz();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateQuiz = () => {
    router.push('/admin/quiz-editor/new');
  };

  const handleEditQuiz = (quizId: string) => {
    router.push(`/admin/quiz-editor/${quizId}`);
  };

  const handleDeleteQuiz = (quiz: Quiz) => {
    Alert.alert(
      'Delete Quiz',
      `Are you sure you want to delete "${quiz.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(quiz.id);
            try {
              await deleteMutation.mutateAsync(quiz.id);
              queryClient.invalidateQueries({ queryKey: adminQuizzesKeys.list() });
            } catch (err) {
              Alert.alert('Error', 'Failed to delete quiz. Please try again.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Manage Quizzes',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading quizzes...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Manage Quizzes',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Quizzes</Text>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'An error occurred'}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Manage Quizzes',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Create button */}
      <View style={styles.headerSection}>
        <Pressable style={styles.createButton} onPress={handleCreateQuiz}>
          <Plus size={20} color={colors.white} />
          <Text style={styles.createButtonText}>Create New Quiz</Text>
        </Pressable>
        <Text style={styles.quizCount}>
          {quizzes?.length ?? 0} quiz{(quizzes?.length ?? 0) !== 1 ? 'zes' : ''} total
        </Text>
      </View>

      {/* Quiz list */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {quizzes && quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <View key={quiz.id} style={deletingId === quiz.id ? styles.deletingCard : undefined}>
              {deletingId === quiz.id ? (
                <View style={styles.deletingOverlay}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.deletingText}>Deleting...</Text>
                </View>
              ) : null}
              <QuizCard
                quiz={quiz}
                onEdit={() => handleEditQuiz(quiz.id)}
                onDelete={() => handleDeleteQuiz(quiz)}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <HelpCircle size={48} color={colors.gray200} />
            <Text style={styles.emptyTitle}>No Quizzes Yet</Text>
            <Text style={styles.emptyText}>
              Create your first quiz to get started
            </Text>
            <Pressable style={styles.createEmptyButton} onPress={handleCreateQuiz}>
              <Plus size={18} color={colors.white} />
              <Text style={styles.createEmptyButtonText}>Create Quiz</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },

  // Header section
  headerSection: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.forestGreen,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  quizCount: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 12,
    textAlign: 'center',
  },

  // Loading state
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

  // Error state
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
  retryButton: {
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Quiz card
  quizCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryStripe: {
    height: 4,
  },
  cardContent: {
    padding: 16,
  },

  // Badges row
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  publishedBadge: {
    backgroundColor: '#D1FAE5',
  },
  draftBadge: {
    backgroundColor: colors.gray100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // Quiz info
  quizTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 6,
  },
  quizDescription: {
    fontSize: 14,
    color: colors.gray500,
    lineHeight: 20,
    marginBottom: 12,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: colors.gray500,
  },

  // Actions row
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: `${colors.forestGreen}10`,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: `${colors.red600}10`,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.red600,
  },

  // Deleting state
  deletingCard: {
    opacity: 0.5,
    position: 'relative',
  },
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  deletingText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: 24,
  },
  createEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createEmptyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
