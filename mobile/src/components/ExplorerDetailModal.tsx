// Explorer Detail Modal Component
import React from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { X, BookOpen, Route } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import type { ExplorerDetail, ExplorerWaterwayDetail } from '@/lib/types/waterways';
import { ReadingGuideList } from '@/components/ReadingGuideList';
import { SourcesList } from '@/components/SourcesList';

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
  const router = useRouter();
  // Expedition route layer (roadmap item 2): open the map with this journey drawn
  const showExpeditionOnMap = (expeditionId: string) => {
    onClose();
    router.push({ pathname: '/', params: { expeditionId } });
  };
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

          {/* Expeditions (Expedition table, roadmap item 2): dated journeys drawn on the map */}
          {explorer.expeditions && explorer.expeditions.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#B45309' }]}>Expeditions</Text>
              <View style={[styles.sectionContent, { backgroundColor: '#FFF4E5' }]}>
                {explorer.expeditions.map((expedition) => (
                  <View key={expedition.id} style={styles.expeditionItem}>
                    <View style={styles.expeditionHeader}>
                      <View style={[styles.expeditionSwatch, { backgroundColor: expedition.color ?? '#B45309' }]} />
                      <Text style={styles.expeditionName}>{expedition.name}</Text>
                      <Text style={styles.expeditionYears}>
                        {expedition.endYear && expedition.endYear !== expedition.startYear ? `${expedition.startYear}-${expedition.endYear}` : expedition.startYear}
                      </Text>
                    </View>
                    <Text style={styles.expeditionSummary}>{expedition.summary}</Text>
                    <View style={styles.expeditionFooter}>
                      <Text style={styles.expeditionLegs}>{expedition.legCount} {expedition.legCount === 1 ? 'leg' : 'legs'}</Text>
                      <Pressable style={styles.showOnMapButton} onPress={() => showExpeditionOnMap(expedition.id)} accessibilityLabel={`Show ${expedition.name} on the map`}>
                        <Route size={14} color="white" />
                        <Text style={styles.showOnMapText}>Show on map</Text>
                      </Pressable>
                    </View>
                    {expedition.source ? <Text style={styles.expeditionSource}>Route ordered from: {expedition.source}</Text> : null}
                  </View>
                ))}
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

          {/* Sources (Citation table, roadmap item 14) */}
          <View style={styles.section}>
            <SourcesList targetType="explorer" targetId={explorer.id} titleColor={colors.earthBrown} linkColor={colors.waterBlue} />
          </View>

          {/* Additional Study (ReadingGuide table, decision 12) */}
          {explorer.readingGuide && explorer.readingGuide.length > 0 ? (
            <View style={styles.section}>
              <ReadingGuideList entries={explorer.readingGuide} titleColor={colors.earthBrown} linkColor={colors.waterBlue} />
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
  expeditionItem: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(180, 83, 9, 0.2)',
  },
  expeditionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  expeditionSwatch: { width: 10, height: 10, borderRadius: 5 },
  expeditionName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },
  expeditionYears: { fontSize: 13, color: '#B45309', fontWeight: '600' },
  expeditionSummary: { fontSize: 13, color: '#4B5563', lineHeight: 19 },
  expeditionFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  expeditionLegs: { fontSize: 12, color: '#6B7280' },
  showOnMapButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#B45309', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  showOnMapText: { color: 'white', fontSize: 12, fontWeight: '700' },
  expeditionSource: { fontSize: 11, color: '#9CA3AF', marginTop: 6, fontStyle: 'italic' },
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
