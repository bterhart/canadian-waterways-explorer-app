// Explorer Detail Modal Component
import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { X, BookOpen } from 'lucide-react-native';
import type { ExplorerDetail, ExplorerWaterwayDetail } from '@/lib/types/waterways';

// Reading Guide Entry type
interface ReadingGuideEntry {
  authorSource?: string;
  title: string;
  publisher?: string;
  year?: string;
  url?: string;
  description?: string;
}

// Reading guide data mapped by explorer ID (test entry only)
const readingGuideData: Record<string, ReadingGuideEntry[]> = {
  'cmlijaif2000om22ru83xdxmj': [
    {
      authorSource: 'Franklin John',
      title: 'Narrative of a Journey to the Shores of the Polar Sea in the Years 1819 20 21 and 22',
      publisher: 'John Murray',
      year: '1823',
      description: "Primary account of Franklin's Coppermine River expedition highlighting Akaitcho's essential guidance and leadership among the Yellowknives Dene.",
    },
    {
      authorSource: 'Piper Liza',
      title: 'When Disease Came to This Country: Epidemics and Colonialism in Northern North America',
      publisher: 'Cambridge University Press',
      year: '2023',
      description: "Examines Akaitcho's role in Dene history peace negotiations and early colonial encounters in the Northwest Territories.",
    },
    {
      authorSource: 'Coulthard Glen Sean',
      title: 'Red Skin White Masks: Rejecting the Colonial Politics of Recognition',
      publisher: 'University of Minnesota Press',
      year: '2014',
      description: 'Scholarly work by a Yellowknives Dene author providing context on Dene resistance and historical figures like Akaitcho in colonial frameworks.',
    },
    {
      authorSource: 'Helm June',
      title: "The People of Denendeh: Ethnohistory of the Indians of Canada's Northwest Territories",
      publisher: "McGill-Queen's University Press",
      year: '2000',
      description: "Ethnohistorical analysis of Dene peoples including Akaitcho's leadership and interactions with European explorers.",
    },
    {
      authorSource: 'Blondin George',
      title: 'When the World Was New: Stories of the Sahtú Dene',
      publisher: 'Outcrop',
      year: '1990',
      description: 'Collection of Dene oral histories that reference traditional leaders like Akaitcho and their roles in northern exploration.',
    },
    {
      authorSource: 'Yellowknives Dene First Nation',
      title: 'Our History',
      url: 'https://ykdene.com/about-us/our-history/',
      description: "Community-sourced overview of Akaitcho's legacy and Yellowknives Dene heritage.",
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Akaitcho',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/akaitcho',
      description: "Biographical entry on Akaitcho's contributions to exploration and treaties.",
    },
    {
      authorSource: 'Wikipedia',
      title: 'Akaitcho',
      url: 'https://en.wikipedia.org/wiki/Akaitcho',
      description: 'Starting point for his expeditions with Franklin and Dene diplomacy.',
    },
  ],
};

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  gold: '#C9A227',
};

interface ExplorerDetailModalProps {
  explorer: ExplorerDetail;
  onClose: () => void;
}

export default function ExplorerDetailModal({ explorer, onClose }: ExplorerDetailModalProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={24} color={colors.forestGreen} />
        </Pressable>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Explorer Header */}
          <View style={styles.header}>
            {explorer.imageUrl ? (
              <Image source={{ uri: explorer.imageUrl }} style={styles.portrait} />
            ) : (
              <View style={styles.portraitPlaceholder}>
                <Text style={styles.portraitInitial}>{explorer.name.charAt(0)}</Text>
              </View>
            )}
            <Text style={styles.name}>{explorer.name}</Text>
            <Text style={styles.nationality}>{explorer.nationality}</Text>
            {explorer.birthYear && explorer.deathYear ? (
              <Text style={styles.years}>
                {explorer.birthYear} - {explorer.deathYear}
              </Text>
            ) : null}
          </View>

          {/* Biography */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biography</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.biography}>{explorer.biography}</Text>
            </View>
          </View>

          {/* Notable Achievements */}
          {explorer.notableAchievements ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.gold }]}>Notable Achievements</Text>
              <View style={[styles.sectionContent, { backgroundColor: '#FFF8E7' }]}>
                <Text style={styles.achievementText}>{explorer.notableAchievements}</Text>
              </View>
            </View>
          ) : null}

          {/* Waterways Explored */}
          {explorer.waterways && explorer.waterways.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.waterBlue }]}>
                Waterways Explored
              </Text>
              <View style={[styles.sectionContent, { backgroundColor: '#E6F3F8' }]}>
                {explorer.waterways.map((explorerWaterway: ExplorerWaterwayDetail) => (
                  <View key={explorerWaterway.id} style={styles.waterwayItem}>
                    <View style={styles.waterwayHeader}>
                      <Text style={styles.waterwayName}>{explorerWaterway.waterway?.name || 'Unknown'}</Text>
                      <View
                        style={[
                          styles.typeBadge,
                          {
                            backgroundColor:
                              explorerWaterway.waterway?.type?.name === 'River'
                                ? '#3B82F6'
                                : explorerWaterway.waterway?.type?.name === 'Lake'
                                ? '#06B6D4'
                                : '#10B981',
                          },
                        ]}
                      >
                        <Text style={styles.typeBadgeText}>
                          {explorerWaterway.waterway?.type?.name || 'Waterway'}
                        </Text>
                      </View>
                    </View>
                    {explorerWaterway.yearExplored ? (
                      <Text style={styles.waterwayYear}>
                        Explored: {explorerWaterway.yearExplored}
                      </Text>
                    ) : null}
                    {explorerWaterway.expeditionNotes ? (
                      <Text style={styles.waterwayDescription}>
                        {explorerWaterway.expeditionNotes}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* Additional Study and Reading Guide */}
          {readingGuideData[explorer.id] && readingGuideData[explorer.id].length > 0 ? (
            <View style={styles.section}>
              <View style={styles.readingGuideHeader}>
                <BookOpen size={20} color={colors.earthBrown} />
                <Text style={[styles.sectionTitle, styles.readingGuideTitle]}>
                  Additional Study and Reading Guide
                </Text>
              </View>
              <View style={styles.readingGuideContainer}>
                {readingGuideData[explorer.id].map((entry, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.readingEntry,
                        { backgroundColor: isEven ? '#FAF5EF' : '#F5EDE3' },
                      ]}
                    >
                      {entry.title ? (
                        <Text style={[styles.readingTitle, { color: isEven ? '#333' : '#2A2520' }]}>
                          {entry.title}
                        </Text>
                      ) : null}
                      {entry.authorSource ? (
                        <Text style={[styles.readingAuthor, { color: isEven ? colors.earthBrown : '#6B4423' }]}>
                          {entry.authorSource}
                        </Text>
                      ) : null}
                      <View style={styles.readingMeta}>
                        {entry.publisher ? (
                          <Text style={styles.readingPublisher}>{entry.publisher}</Text>
                        ) : null}
                        {entry.publisher && entry.year ? (
                          <Text style={styles.readingMetaSeparator}> · </Text>
                        ) : null}
                        {entry.year ? (
                          <Text style={styles.readingYear}>{entry.year}</Text>
                        ) : null}
                      </View>
                      {entry.description ? (
                        <Text style={styles.readingDescription}>{entry.description}</Text>
                      ) : null}
                      {entry.url ? (
                        <Pressable
                          onPress={() => Linking.openURL(entry.url!)}
                          style={styles.readingLink}
                        >
                          <Text style={styles.readingLinkText}>View Resource</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: colors.creamWhite,
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  portrait: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: colors.forestGreen,
  },
  portraitPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: colors.forestGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portraitInitial: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.forestGreen,
    textAlign: 'center',
    marginBottom: 4,
  },
  nationality: {
    fontSize: 16,
    color: colors.earthBrown,
    marginBottom: 4,
  },
  years: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.forestGreen,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#F5F5DC',
    borderRadius: 12,
    padding: 16,
  },
  biography: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
  },
  achievementText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  waterwayItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 163, 0.2)',
  },
  waterwayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  waterwayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  waterwayYear: {
    fontSize: 13,
    color: colors.waterBlue,
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  waterwayIndigenous: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#8B4513',
    marginBottom: 4,
  },
  waterwayDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  readingGuideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  readingGuideTitle: {
    marginBottom: 0,
    color: colors.earthBrown,
  },
  readingGuideContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  readingEntry: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  readingTitle: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#333',
    lineHeight: 22,
    marginBottom: 4,
  },
  readingAuthor: {
    fontSize: 14,
    color: colors.earthBrown,
    fontWeight: '500',
    marginBottom: 4,
  },
  readingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  readingPublisher: {
    fontSize: 13,
    color: '#666',
  },
  readingMetaSeparator: {
    fontSize: 13,
    color: '#999',
  },
  readingYear: {
    fontSize: 13,
    color: '#666',
  },
  readingDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  readingLink: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  readingLinkText: {
    fontSize: 13,
    color: colors.waterBlue,
    textDecorationLine: 'underline',
  },
});
