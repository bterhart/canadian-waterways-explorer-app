// Pronunciation Guide Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { Volume2, Filter, Play } from 'lucide-react-native';
import { Audio } from 'expo-av';
import {
  usePronunciations,
  usePronunciationTermTypes,
  usePronunciationLanguages,
} from '@/lib/api/education-api';
import type { PronunciationGuide } from '@/lib/types/education';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

const termTypeColors: Record<string, string> = {
  waterway: '#3B82F6',
  location: '#10B981',
  nation: '#EC4899',
  explorer: '#F97316',
  general: '#6B7280',
};

export default function PronunciationsScreen() {
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const { data: pronunciations, isLoading, isError } = usePronunciations({
    termType: selectedType,
    language: selectedLanguage,
  });
  const { data: termTypes } = usePronunciationTermTypes();
  const { data: languages } = usePronunciationLanguages();

  const playAudio = async (audioUrl: string, id: string) => {
    try {
      setPlayingId(id);
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingId(null);
    }
  };

  const renderPronunciationCard = ({ item }: { item: PronunciationGuide }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor:
                (termTypeColors[item.termType.toLowerCase()] || '#6B7280') + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.typeText,
              {
                color:
                  termTypeColors[item.termType.toLowerCase()] || '#6B7280',
              },
            ]}
          >
            {item.termType}
          </Text>
        </View>
        {item.language ? (
          <View style={styles.languageBadge}>
            <Text style={styles.languageText}>{item.language}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.termText}>{item.term}</Text>

      {item.phonetic ? (
        <Text style={styles.phoneticText}>/{item.phonetic}/</Text>
      ) : null}

      {item.meaning ? (
        <Text style={styles.meaningText}>{item.meaning}</Text>
      ) : null}

      {item.audioUrl ? (
        <Pressable
          style={[
            styles.playButton,
            playingId === item.id && styles.playButtonActive,
          ]}
          onPress={() => item.audioUrl && playAudio(item.audioUrl, item.id)}
          disabled={playingId === item.id}
        >
          {playingId === item.id ? (
            <Volume2 size={18} color="white" />
          ) : (
            <Play size={18} color="white" />
          )}
          <Text style={styles.playButtonText}>
            {playingId === item.id ? 'Playing...' : 'Listen'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Pronunciation Guide',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      {/* Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.filterRow}>
          <Filter size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Type:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.filterChips}
          >
            <Pressable
              style={[
                styles.filterChip,
                !selectedType && styles.filterChipActive,
              ]}
              onPress={() => setSelectedType(undefined)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedType && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {termTypes?.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.filterChip,
                  selectedType === type && styles.filterChipActive,
                ]}
                onPress={() =>
                  setSelectedType(selectedType === type ? undefined : type)
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedType === type && styles.filterChipTextActive,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {languages && languages.length > 0 ? (
          <View style={styles.filterRow}>
            <Volume2 size={16} color="#6B7280" />
            <Text style={styles.filterLabel}>Language:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
              contentContainerStyle={styles.filterChips}
            >
              <Pressable
                style={[
                  styles.filterChip,
                  !selectedLanguage && styles.filterChipActive,
                ]}
                onPress={() => setSelectedLanguage(undefined)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    !selectedLanguage && styles.filterChipTextActive,
                  ]}
                >
                  All
                </Text>
              </Pressable>
              {languages.map((lang) => (
                <Pressable
                  key={lang}
                  style={[
                    styles.filterChip,
                    selectedLanguage === lang && styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setSelectedLanguage(
                      selectedLanguage === lang ? undefined : lang
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedLanguage === lang && styles.filterChipTextActive,
                    ]}
                  >
                    {lang}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading pronunciations...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Unable to load pronunciations</Text>
        </View>
      ) : pronunciations && pronunciations.length > 0 ? (
        <FlatList
          data={pronunciations}
          renderItem={renderPronunciationCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Volume2 size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No pronunciations found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  filtersSection: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
    marginRight: 8,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: colors.forestGreen,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  filterChipTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  languageBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  termText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 4,
  },
  phoneticText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  meaningText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.forestGreen,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  playButtonActive: {
    backgroundColor: '#6B7280',
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
