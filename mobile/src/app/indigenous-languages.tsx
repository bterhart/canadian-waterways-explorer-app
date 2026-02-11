// Indigenous Language Learning Screen
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  Volume2,
  GraduationCap,
  Feather,
  Languages,
} from 'lucide-react-native';
import {
  useWordOfTheDay,
  useIndigenousLanguages,
  useIndigenousWords,
  useVocabularyQuizzes,
  useIndigenousStories,
} from '@/lib/api/education-api';
import type {
  IndigenousWord,
  VocabularyQuizSummary,
  IndigenousStorySummary,
} from '@/lib/types/education';

const { width } = Dimensions.get('window');

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  gold: '#C9A962',
  warmBrown: '#8B4513',
  skyBlue: '#4A90D9',
};

// Language colors for visual distinction
const languageColors: Record<string, { primary: string; secondary: string }> = {
  Cree: { primary: '#2D5A3D', secondary: '#1A3A24' },
  Ojibwe: { primary: '#3B82F6', secondary: '#1D4ED8' },
  Inuktitut: { primary: '#8B5CF6', secondary: '#6D28D9' },
  "Mi'kmaq": { primary: '#EC4899', secondary: '#BE185D' },
  Dene: { primary: '#F97316', secondary: '#C2410C' },
  Multiple: { primary: '#10B981', secondary: '#047857' },
};

const getLanguageColor = (language: string) =>
  languageColors[language] || { primary: '#6B7280', secondary: '#4B5563' };

export default function IndigenousLanguagesScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();

  const { data: wordOfDay, isLoading: loadingWordOfDay } = useWordOfTheDay();
  const { data: languages, isLoading: loadingLanguages } = useIndigenousLanguages();
  const { data: words, isLoading: loadingWords } = useIndigenousWords({
    language: selectedLanguage,
  });
  const { data: quizzes } = useVocabularyQuizzes();
  const { data: stories } = useIndigenousStories();

  const renderWordOfDayCard = () => {
    if (loadingWordOfDay) {
      return (
        <View style={styles.wordOfDayContainer}>
          <ActivityIndicator size="small" color="white" />
        </View>
      );
    }

    if (!wordOfDay) return null;

    const langColor = getLanguageColor(wordOfDay.word.language);

    return (
      <LinearGradient
        colors={[langColor.primary, langColor.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.wordOfDayContainer}
      >
        <View style={styles.wordOfDayHeader}>
          <View style={styles.wordOfDayBadge}>
            <Sparkles size={14} color={langColor.primary} />
            <Text style={[styles.wordOfDayBadgeText, { color: langColor.primary }]}>
              Word of the Day
            </Text>
          </View>
          <Text style={styles.wordOfDayLanguage}>{wordOfDay.word.language}</Text>
        </View>

        <Text style={styles.wordOfDayWord}>{wordOfDay.word.word}</Text>
        {wordOfDay.word.phonetic ? (
          <Text style={styles.wordOfDayPhonetic}>/{wordOfDay.word.phonetic}/</Text>
        ) : null}
        <Text style={styles.wordOfDayTranslation}>{wordOfDay.word.translation}</Text>

        {wordOfDay.word.culturalContext ? (
          <Text style={styles.wordOfDayCulturalContext} numberOfLines={3}>
            {wordOfDay.word.culturalContext}
          </Text>
        ) : null}
      </LinearGradient>
    );
  };

  const renderLanguageTabs = () => {
    if (loadingLanguages || !languages) {
      return (
        <View style={styles.languageTabsContainer}>
          <ActivityIndicator size="small" color={colors.forestGreen} />
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.languageTabsContent}
      >
        <Pressable
          style={[
            styles.languageTab,
            !selectedLanguage && styles.languageTabActive,
          ]}
          onPress={() => setSelectedLanguage(undefined)}
        >
          <Text
            style={[
              styles.languageTabText,
              !selectedLanguage && styles.languageTabTextActive,
            ]}
          >
            All
          </Text>
        </Pressable>
        {languages.map((lang) => {
          const isSelected = selectedLanguage === lang.name;
          return (
            <Pressable
              key={lang.name}
              style={[styles.languageTab, isSelected && styles.languageTabActive]}
              onPress={() =>
                setSelectedLanguage(isSelected ? undefined : lang.name)
              }
            >
              <Text
                style={[
                  styles.languageTabText,
                  isSelected && styles.languageTabTextActive,
                ]}
              >
                {lang.name}
              </Text>
              <Text
                style={[
                  styles.languageTabCount,
                  isSelected && styles.languageTabCountActive,
                ]}
              >
                {lang.wordCount}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    );
  };

  const renderWordCard = useCallback(
    ({ item }: { item: IndigenousWord }) => {
      const langColor = getLanguageColor(item.language);
      return (
        <View style={styles.wordCard}>
          <View style={styles.wordCardHeader}>
            <View
              style={[
                styles.wordLanguageBadge,
                { backgroundColor: langColor.primary + '20' },
              ]}
            >
              <Text style={[styles.wordLanguageBadgeText, { color: langColor.primary }]}>
                {item.language}
              </Text>
            </View>
            {item.category ? (
              <View style={styles.wordCategoryBadge}>
                <Text style={styles.wordCategoryText}>{item.category}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.wordText}>{item.word}</Text>
          {item.phonetic ? (
            <Text style={styles.wordPhonetic}>/{item.phonetic}/</Text>
          ) : null}
          <Text style={styles.wordTranslation}>{item.translation}</Text>

          {item.culturalContext ? (
            <Text style={styles.wordCulturalContext} numberOfLines={2}>
              {item.culturalContext}
            </Text>
          ) : null}
        </View>
      );
    },
    []
  );

  const renderQuizCard = ({ item }: { item: VocabularyQuizSummary }) => {
    const langColor = getLanguageColor(item.language);
    return (
      <View style={styles.quizCard}>
        <LinearGradient
          colors={[langColor.primary, langColor.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quizCardGradient}
        >
          <GraduationCap size={24} color="white" />
          <Text style={styles.quizCardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.quizCardMeta}>
            <Text style={styles.quizCardLanguage}>{item.language}</Text>
            <View style={styles.quizCardDifficulty}>
              <Text style={styles.quizCardDifficultyText}>{item.difficulty}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderStoryCard = ({ item }: { item: IndigenousStorySummary }) => {
    const langColor = getLanguageColor(item.nation);
    return (
      <View style={styles.storyCard}>
        <View style={styles.storyCardContent}>
          <View
            style={[
              styles.storyIconContainer,
              { backgroundColor: langColor.primary + '15' },
            ]}
          >
            <Feather size={24} color={langColor.primary} />
          </View>
          <View style={styles.storyCardText}>
            <Text style={styles.storyCardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.storyCardNation}>{item.nation}</Text>
            {item.summary ? (
              <Text style={styles.storyCardSummary} numberOfLines={2}>
                {item.summary}
              </Text>
            ) : null}
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Indigenous Languages',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Word of the Day */}
        {renderWordOfDayCard()}

        {/* Language Tabs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Languages size={20} color={colors.darkGreen} />
            <Text style={styles.sectionTitle}>Browse by Language</Text>
          </View>
          {renderLanguageTabs()}
        </View>

        {/* Word List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={colors.darkGreen} />
            <Text style={styles.sectionTitle}>
              {selectedLanguage ? `${selectedLanguage} Words` : 'All Words'}
            </Text>
          </View>

          {loadingWords ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.forestGreen} />
            </View>
          ) : words && words.length > 0 ? (
            <FlatList
              data={words}
              renderItem={renderWordCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
              style={{ flexGrow: 0 }}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No words found</Text>
            </View>
          )}
        </View>

        {/* Vocabulary Quizzes */}
        {quizzes && quizzes.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <GraduationCap size={20} color={colors.darkGreen} />
              <Text style={styles.sectionTitle}>Vocabulary Quizzes</Text>
            </View>
            <FlatList
              data={quizzes}
              renderItem={renderQuizCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
              style={{ flexGrow: 0 }}
            />
          </View>
        ) : null}

        {/* Indigenous Stories */}
        {stories && stories.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather size={20} color={colors.darkGreen} />
              <Text style={styles.sectionTitle}>Traditional Stories</Text>
            </View>
            <View style={styles.storiesContainer}>
              {stories.map((story) => (
                <View key={story.id}>{renderStoryCard({ item: story })}</View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Attribution */}
        <View style={styles.attributionSection}>
          <Text style={styles.attributionTitle}>Respecting Indigenous Knowledge</Text>
          <Text style={styles.attributionText}>
            These words and stories are shared with respect for the Indigenous nations
            who have stewarded this knowledge for thousands of years. Language
            preservation is vital to cultural continuity.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  wordOfDayContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    minHeight: 180,
  },
  wordOfDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordOfDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  wordOfDayBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  wordOfDayLanguage: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  wordOfDayWord: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  wordOfDayPhonetic: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  wordOfDayTranslation: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 12,
  },
  wordOfDayCulturalContext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGreen,
  },
  languageTabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  languageTabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  languageTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  languageTabActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  languageTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  languageTabTextActive: {
    color: 'white',
  },
  languageTabCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  languageTabCountActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.9)',
  },
  horizontalListContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  wordCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: width * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  wordCardHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  wordLanguageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  wordLanguageBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  wordCategoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  wordCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  wordText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 2,
  },
  wordPhonetic: {
    fontSize: 14,
    color: '#8B5CF6',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  wordTranslation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  wordCulturalContext: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  quizCard: {
    width: 160,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizCardGradient: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  quizCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    lineHeight: 18,
  },
  quizCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizCardLanguage: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  quizCardDifficulty: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  quizCardDifficultyText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  storiesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  storyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  storyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  storyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyCardText: {
    flex: 1,
  },
  storyCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 2,
  },
  storyCardNation: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  storyCardSummary: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 17,
  },
  attributionSection: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.forestGreen + '10',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.forestGreen,
  },
  attributionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  attributionText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
  bottomSpacer: {
    height: 24,
  },
});
