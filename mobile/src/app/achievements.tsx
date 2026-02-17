// Achievements & Progress Screen - Gamification UI
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Trophy,
  Flame,
  Star,
  Award,
  ChevronRight,
  CheckCircle,
  XCircle,
  Compass,
  BookOpen,
  Map,
  Anchor,
  Ship,
  Mountain,
  Tent,
  Feather,
  ScrollText,
  Languages,
  Clock,
  X,
  Sparkles,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  FadeIn,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import {
  useUserProgress,
  useAchievements,
  useUserAchievements,
  useDailyChallenge,
  useSubmitDailyChallenge,
  useRanks,
} from '@/lib/api/education-api';
import type { Achievement, UserAchievement, RankInfo } from '@/lib/types/education';
import { useTranslation } from '@/lib/i18n';

const { width } = Dimensions.get('window');

// Mock user ID for demo purposes - in production this would come from auth
const DEMO_USER_ID = 'demo-user-001';

// Theme colors matching the app style
const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  gold: '#C9A962',
  lightGreen: '#E8F5E9',
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  platinum: '#E5E4E2',
};

// Icon mapping for achievement categories
const getCategoryIcon = (category: string, size: number, color: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    explorer: <Compass size={size} color={color} />,
    scholar: <BookOpen size={size} color={color} />,
    voyageur: <Ship size={size} color={color} />,
    scribe: <ScrollText size={size} color={color} />,
    linguist: <Languages size={size} color={color} />,
    historian: <Clock size={size} color={color} />,
    mapmaker: <Map size={size} color={color} />,
    trapper: <Tent size={size} color={color} />,
    navigator: <Anchor size={size} color={color} />,
    mountaineer: <Mountain size={size} color={color} />,
    storyteller: <Feather size={size} color={color} />,
    default: <Award size={size} color={color} />,
  };
  return iconMap[category] || iconMap.default;
};

// Rank icon and color mapping
const getRankDetails = (rank: string) => {
  const rankMap: Record<string, { color: string; gradient: readonly [string, string] }> = {
    'Apprentice Voyageur': { color: colors.bronze, gradient: ['#CD7F32', '#8B5A2B'] as const },
    'Junior Explorer': { color: '#3B82F6', gradient: ['#3B82F6', '#1D4ED8'] as const },
    'Fur Trade Clerk': { color: '#10B981', gradient: ['#10B981', '#047857'] as const },
    'Seasoned Voyageur': { color: colors.silver, gradient: ['#9CA3AF', '#6B7280'] as const },
    'Fort Factor': { color: '#8B5CF6', gradient: ['#8B5CF6', '#6D28D9'] as const },
    'Chief Trader': { color: colors.gold, gradient: ['#C9A962', '#8B7355'] as const },
    'Master Explorer': { color: colors.platinum, gradient: ['#E5E4E2', '#9CA3AF'] as const },
  };
  return rankMap[rank] || { color: colors.forestGreen, gradient: ['#2D5A3D', '#1A3A24'] as const };
};

// Stats card component
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <View style={styles.statTextContainer}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

// Achievement badge component
interface AchievementBadgeProps {
  achievement: Achievement;
  earned: boolean;
  earnedAt?: string;
  onPress: () => void;
}

function AchievementBadge({ achievement, earned, earnedAt, onPress }: AchievementBadgeProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.achievementBadge,
          !earned && styles.achievementBadgeUnearned,
        ]}
      >
        <View
          style={[
            styles.badgeIconContainer,
            earned
              ? { backgroundColor: colors.gold + '30' }
              : { backgroundColor: '#E5E7EB' },
          ]}
        >
          {getCategoryIcon(
            achievement.category,
            28,
            earned ? colors.gold : '#9CA3AF'
          )}
        </View>
        <Text
          style={[
            styles.badgeName,
            !earned && styles.badgeNameUnearned,
          ]}
          numberOfLines={2}
        >
          {achievement.name}
        </Text>
        {earned ? (
          <View style={styles.earnedBadge}>
            <CheckCircle size={14} color={colors.forestGreen} />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

// Daily Challenge Card
interface DailyChallengeCardProps {
  challenge: {
    id: string;
    question: string;
    options: { id: string; text: string }[];
    pointsReward: number;
    hasAttempted: boolean;
    userAttempt: {
      answer: string;
      isCorrect: boolean;
    } | null;
    correctAnswer?: string;
    explanation?: string;
  };
  onSubmit: (answer: string) => void;
  isSubmitting: boolean;
}

function DailyChallengeCard({ challenge, onSubmit, isSubmitting }: DailyChallengeCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { t } = useTranslation();

  if (challenge.hasAttempted && challenge.userAttempt) {
    return (
      <Animated.View entering={FadeInDown.delay(200)}>
        <View style={styles.challengeCard}>
          <LinearGradient
            colors={
              challenge.userAttempt.isCorrect
                ? ['#10B981', '#047857'] as const
                : ['#EF4444', '#B91C1C'] as const
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.challengeHeader}
          >
            <View style={styles.challengeHeaderContent}>
              {challenge.userAttempt.isCorrect ? (
                <CheckCircle size={24} color="white" />
              ) : (
                <XCircle size={24} color="white" />
              )}
              <Text style={styles.challengeHeaderText}>
                {challenge.userAttempt.isCorrect ? 'Correct!' : 'Not quite!'}
              </Text>
              {challenge.userAttempt.isCorrect ? (
                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsBadgeText}>+{challenge.pointsReward}</Text>
                </View>
              ) : null}
            </View>
          </LinearGradient>
          <View style={styles.challengeContent}>
            <Text style={styles.challengeQuestion}>{challenge.question}</Text>
            {challenge.explanation ? (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationText}>{challenge.explanation}</Text>
              </View>
            ) : null}
            <View style={styles.comeBackContainer}>
              <Sparkles size={18} color={colors.gold} />
              <Text style={styles.comeBackText}>Come back tomorrow for a new challenge!</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.delay(200)}>
      <View style={styles.challengeCard}>
        <LinearGradient
          colors={['#F97316', '#C2410C'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.challengeHeader}
        >
          <View style={styles.challengeHeaderContent}>
            <Star size={24} color="white" />
            <Text style={styles.challengeHeaderText}>{t('dailyChallenge')}</Text>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsBadgeText}>+{challenge.pointsReward} pts</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.challengeContent}>
          <Text style={styles.challengeQuestion}>{challenge.question}</Text>
          <View style={styles.optionsContainer}>
            {challenge.options.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => setSelectedAnswer(option.id)}
                style={[
                  styles.optionButton,
                  selectedAnswer === option.id && styles.optionButtonSelected,
                ]}
              >
                <View
                  style={[
                    styles.optionRadio,
                    selectedAnswer === option.id && styles.optionRadioSelected,
                  ]}
                >
                  {selectedAnswer === option.id && (
                    <View style={styles.optionRadioInner} />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.text}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => selectedAnswer && onSubmit(selectedAnswer)}
            disabled={!selectedAnswer || isSubmitting}
            style={[
              styles.submitButton,
              (!selectedAnswer || isSubmitting) && styles.submitButtonDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>{t('submitAnswer')}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

// Achievement Detail Modal
interface AchievementModalProps {
  achievement: Achievement | null;
  earned: boolean;
  earnedAt?: string;
  visible: boolean;
  onClose: () => void;
}

function AchievementModal({ achievement, earned, earnedAt, visible, onClose }: AchievementModalProps) {
  if (!achievement) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Animated.View entering={ZoomIn} style={styles.modalContent}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.modalIconContainer,
                  earned
                    ? { backgroundColor: colors.gold + '30' }
                    : { backgroundColor: '#E5E7EB' },
                ]}
              >
                {getCategoryIcon(
                  achievement.category,
                  48,
                  earned ? colors.gold : '#9CA3AF'
                )}
              </View>
              <Pressable onPress={onClose} style={styles.modalCloseButton}>
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>
            <Text style={styles.modalTitle}>{achievement.name}</Text>
            <Text style={styles.modalCategory}>{achievement.category}</Text>
            <Text style={styles.modalDescription}>{achievement.description}</Text>
            {earned ? (
              <View style={styles.earnedInfoBox}>
                <CheckCircle size={18} color={colors.forestGreen} />
                <Text style={styles.earnedInfoText}>
                  Earned {earnedAt ? new Date(earnedAt).toLocaleDateString() : 'recently'}
                </Text>
              </View>
            ) : (
              <View style={styles.notEarnedInfoBox}>
                <Text style={styles.notEarnedInfoText}>Keep exploring to unlock this achievement!</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export default function AchievementsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<{
    achievement: Achievement;
    earned: boolean;
    earnedAt?: string;
  } | null>(null);

  // Fetch data
  const { data: progress, isLoading: progressLoading, refetch: refetchProgress } = useUserProgress(DEMO_USER_ID);
  const { data: achievements, isLoading: achievementsLoading, refetch: refetchAchievements } = useAchievements();
  const { data: userAchievements, refetch: refetchUserAchievements } = useUserAchievements(DEMO_USER_ID);
  const { data: dailyChallenge, isLoading: challengeLoading, refetch: refetchChallenge } = useDailyChallenge(DEMO_USER_ID);
  const { data: ranks } = useRanks();

  const submitChallenge = useSubmitDailyChallenge();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchProgress(),
      refetchAchievements(),
      refetchUserAchievements(),
      refetchChallenge(),
    ]);
    setRefreshing(false);
  }, [refetchProgress, refetchAchievements, refetchUserAchievements, refetchChallenge]);

  const handleSubmitChallenge = useCallback((answer: string) => {
    if (!dailyChallenge) return;
    submitChallenge.mutate({
      userId: DEMO_USER_ID,
      challengeId: dailyChallenge.id,
      answer,
    });
  }, [dailyChallenge, submitChallenge]);

  // Combine achievements with earned status
  const achievementsWithStatus = useMemo(() => {
    if (!achievements) return [];
    const earnedIds = new Set(userAchievements?.map((ua) => ua.id) || []);
    return achievements.map((a) => ({
      achievement: a,
      earned: earnedIds.has(a.id),
      earnedAt: userAchievements?.find((ua) => ua.id === a.id)?.earnedAt,
    }));
  }, [achievements, userAchievements]);

  // Group achievements by category
  const achievementsByCategory = useMemo(() => {
    const groups: Record<string, typeof achievementsWithStatus> = {};
    achievementsWithStatus.forEach((item) => {
      const cat = item.achievement.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [achievementsWithStatus]);

  // Calculate progress to next rank
  const progressPercent = progress?.progressToNextRank ?? 0;
  const rankDetails = getRankDetails(progress?.explorerRank ?? 'Apprentice Voyageur');

  const isLoading = progressLoading || achievementsLoading;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'My Progress', headerTintColor: colors.forestGreen }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'My Progress', headerTintColor: colors.forestGreen }} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.forestGreen} />
        }
      >
        {/* User Stats Card */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <LinearGradient
            colors={rankDetails.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsCard}
          >
            <View style={styles.rankHeader}>
              <View style={styles.rankIconContainer}>
                <Trophy size={32} color="white" />
              </View>
              <View style={styles.rankInfo}>
                <Text style={styles.rankLabel}>{t('yourRank')}</Text>
                <Text style={styles.rankName}>{progress?.explorerRank ?? 'Apprentice Voyageur'}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statItemValue}>{progress?.totalPoints ?? 0}</Text>
                <Text style={styles.statItemLabel}>{t('points')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.streakContainer}>
                  <Flame size={20} color="#FCD34D" />
                  <Text style={styles.statItemValue}>{progress?.streaks?.dailyStreak ?? 0}</Text>
                </View>
                <Text style={styles.statItemLabel}>{t('streak')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statItemValue}>
                  {userAchievements?.length ?? 0}/{achievements?.length ?? 0}
                </Text>
                <Text style={styles.statItemLabel}>{t('achievements')}</Text>
              </View>
            </View>

            {/* Progress to next rank */}
            {progress?.nextRank ? (
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Next: {progress.nextRank}</Text>
                  <Text style={styles.progressPoints}>
                    {progress.pointsToNextRank} pts to go
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(progressPercent, 100)}%` },
                    ]}
                  />
                </View>
              </View>
            ) : null}
          </LinearGradient>
        </Animated.View>

        {/* Daily Challenge */}
        {!challengeLoading && dailyChallenge ? (
          <DailyChallengeCard
            challenge={dailyChallenge}
            onSubmit={handleSubmitChallenge}
            isSubmitting={submitChallenge.isPending}
          />
        ) : null}

        {/* Activity Stats */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="Waterways Explored"
              value={progress?.stats?.waterwaysExplored ?? 0}
              icon={<Map size={20} color="#3B82F6" />}
              color="#3B82F6"
            />
            <StatCard
              label="Quizzes Completed"
              value={progress?.stats?.quizzesTaken ?? 0}
              icon={<BookOpen size={20} color="#10B981" />}
              color="#10B981"
            />
            <StatCard
              label="Field Trips"
              value={progress?.stats?.fieldTripsCompleted ?? 0}
              icon={<Compass size={20} color="#8B5CF6" />}
              color="#8B5CF6"
            />
            <StatCard
              label="Journal Entries"
              value={progress?.stats?.journalEntriesWritten ?? 0}
              icon={<ScrollText size={20} color="#F97316" />}
              color="#F97316"
            />
            <StatCard
              label="Pronunciations"
              value={progress?.stats?.pronunciationsLearned ?? 0}
              icon={<Languages size={20} color="#EC4899" />}
              color="#EC4899"
            />
            <StatCard
              label="Documents Read"
              value={progress?.stats?.documentsRead ?? 0}
              icon={<Feather size={20} color="#6B7280" />}
              color="#6B7280"
            />
          </View>
        </Animated.View>

        {/* Achievements by Category */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <Text style={styles.sectionTitle}>{t('achievements')}</Text>
          {Object.entries(achievementsByCategory).map(([category, items]) => (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                {getCategoryIcon(category, 20, colors.forestGreen)}
                <Text style={styles.categoryTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <Text style={styles.categoryCount}>
                  {items.filter((i) => i.earned).length}/{items.length}
                </Text>
              </View>
              <View style={styles.badgesGrid}>
                {items.map((item) => (
                  <AchievementBadge
                    key={item.achievement.id}
                    achievement={item.achievement}
                    earned={item.earned}
                    earnedAt={item.earnedAt}
                    onPress={() => setSelectedAchievement(item)}
                  />
                ))}
              </View>
            </View>
          ))}
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Achievement Detail Modal */}
      <AchievementModal
        achievement={selectedAchievement?.achievement ?? null}
        earned={selectedAchievement?.earned ?? false}
        earnedAt={selectedAchievement?.earnedAt}
        visible={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.creamWhite,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rankIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankInfo: {
    marginLeft: 16,
    flex: 1,
  },
  rankLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  rankName: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statItemValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  statItemLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  progressPoints: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  challengeCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeHeader: {
    padding: 16,
  },
  challengeHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  challengeHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
  },
  pointsBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  challengeContent: {
    padding: 16,
  },
  challengeQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGreen,
    lineHeight: 24,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  optionButtonSelected: {
    borderColor: colors.forestGreen,
    backgroundColor: colors.lightGreen,
  },
  optionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    borderColor: colors.forestGreen,
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.forestGreen,
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  optionTextSelected: {
    color: colors.darkGreen,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: colors.forestGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  explanationBox: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  explanationText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  comeBackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  comeBackText: {
    fontSize: 14,
    color: colors.gold,
    fontWeight: '600',
  },
  statsGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: (width - 42) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  categorySection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.forestGreen,
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementBadge: {
    width: (width - 52) / 3,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementBadgeUnearned: {
    opacity: 0.6,
  },
  badgeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkGreen,
    textAlign: 'center',
  },
  badgeNameUnearned: {
    color: '#9CA3AF',
  },
  earnedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  bottomSpacer: {
    height: 32,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkGreen,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalCategory: {
    fontSize: 14,
    color: colors.forestGreen,
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  earnedInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGreen,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  earnedInfoText: {
    fontSize: 14,
    color: colors.forestGreen,
    fontWeight: '600',
  },
  notEarnedInfoBox: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
  },
  notEarnedInfoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
