// Explorer Detail Modal Component
import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { X, BookOpen, Route, ChevronRight, History, FileText, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import type { ExplorerDetail, ExplorerWaterwayDetail } from '@/lib/types/waterways';
import { decadeOf } from '@/lib/types/connections';
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
  // Every link out of the modal closes it first, so the pushed screen is not hidden under it
  const go = (href: Parameters<typeof router.push>[0]) => {
    onClose();
    router.push(href);
  };
  // Expedition route layer (roadmap item 2): open the map with this journey drawn
  const showExpeditionOnMap = (expeditionId: string) => go({ pathname: '/', params: { expeditionId } });
  // Timeline and "what happened here" events in one list by year (roadmap item 1)
  const events = useMemo(
    () => [...(explorer.timelineEvents ?? []), ...(explorer.historicalEvents ?? [])].sort((a, b) => a.year - b.year),
    [explorer.timelineEvents, explorer.historicalEvents]
  );
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

          {/* Waterways Explored: the water opens on the map, the year opens its decade (roadmap item 1) */}
          {explorer.waterways && explorer.waterways.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.waterBlue }]}>
                Waterways Explored
              </Text>
              <View style={[styles.sectionContent, { backgroundColor: '#E6F3F8' }]}>
                {explorer.waterways.map((explorerWaterway: ExplorerWaterwayDetail) => (
                  <View key={explorerWaterway.id} style={styles.waterwayItem}>
                    <Pressable
                      style={({ pressed }) => [styles.waterwayHeader, pressed && { opacity: 0.7 }]}
                      onPress={() => explorerWaterway.waterway && go({ pathname: '/', params: { markerId: explorerWaterway.waterway.id, markerType: 'waterway' } })}
                      accessibilityRole="button"
                      accessibilityLabel={`Open ${explorerWaterway.waterway?.name ?? 'waterway'} on the map`}
                    >
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
                      <ChevronRight size={16} color="#9CA3AF" />
                    </Pressable>
                    {explorerWaterway.yearExplored ? (
                      <Pressable
                        onPress={() => go(`/decades/${decadeOf(explorerWaterway.yearExplored!)}`)}
                        accessibilityRole="button"
                        accessibilityLabel={`Who else was here in the ${decadeOf(explorerWaterway.yearExplored)}s`}
                        style={({ pressed }) => [styles.yearLink, pressed && { opacity: 0.7 }]}
                      >
                        <History size={12} color={colors.waterBlue} />
                        <Text style={styles.waterwayYear}>Explored {explorerWaterway.yearExplored} · who else was here in the {decadeOf(explorerWaterway.yearExplored)}s</Text>
                      </Pressable>
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

          {/* Everything about this person (roadmap item 1): the records that name the explorer */}
          {events.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#1D4ED8' }]}>Events</Text>
              <View style={[styles.sectionContent, { backgroundColor: '#EFF6FF' }]}>
                {events.map((ev) => {
                  const target = ev.location ? { type: 'location' as const, id: ev.location.id } : ev.waterway ? { type: 'waterway' as const, id: ev.waterway.id } : null;
                  return (
                    <Pressable key={ev.id} disabled={!target} style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]} onPress={() => target && go({ pathname: '/', params: { markerId: target.id, markerType: target.type } })} accessibilityRole="button">
                      <Text style={styles.linkYear}>{ev.year}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.linkTitle}>{ev.title}</Text>
                        {ev.location || ev.waterway ? <Text style={styles.linkMeta}>{ev.location ? ev.location.name : ev.waterway!.name}</Text> : null}
                      </View>
                      {target ? <MapPin size={14} color="#9CA3AF" /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {explorer.documents && explorer.documents.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#6D28D9' }]}>Documents</Text>
              <View style={[styles.sectionContent, { backgroundColor: '#F5F3FF' }]}>
                {explorer.documents.map((d) => (
                  <Pressable key={d.id} style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]} onPress={() => go(`/documents/${d.id}`)} accessibilityRole="button">
                    <FileText size={16} color="#6D28D9" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.linkTitle}>{d.title}</Text>
                      <Text style={styles.linkMeta}>{d.originalDate ?? d.originalYear ?? ''}{d.author ? ` · ${d.author}` : ''}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {explorer.notableFigures && explorer.notableFigures.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#7E22CE' }]}>People Connected</Text>
              <View style={[styles.sectionContent, { backgroundColor: '#F7F0FF' }]}>
                {explorer.notableFigures.map((f) => (
                  <Pressable key={f.id} style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]} onPress={() => go(`/notable-figures/${f.id}`)} accessibilityRole="button">
                    {f.imageUrl ? <Image source={{ uri: f.imageUrl }} style={styles.figurePortrait} /> : <View style={[styles.figurePortrait, { backgroundColor: '#A855F7', alignItems: 'center', justifyContent: 'center' }]}><Text style={{ color: 'white', fontWeight: '700' }}>{f.name.charAt(0)}</Text></View>}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.linkTitle}>{f.name}</Text>
                      <Text style={styles.linkMeta}>{f.relationship ?? f.role}{f.nation ? ` · ${f.nation}` : ''}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {explorer.maps && explorer.maps.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.earthBrown }]}>Maps</Text>
              <View style={[styles.sectionContent, { backgroundColor: '#F5ECD7' }]}>
                {explorer.maps.map((m) => (
                  <Pressable key={m.id} style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]} onPress={() => go(`/historical-maps/${m.id}`)} accessibilityRole="button">
                    <Image source={{ uri: m.imageUrl }} style={styles.mapThumb} resizeMode="cover" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.linkTitle}>{m.title}</Text>
                      <Text style={styles.linkMeta}>{m.mapmaker} · {m.yearLabel ?? m.year}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {explorer.discoveries && explorer.discoveries.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#B91C1C' }]}>Archaeological Discoveries</Text>
              <View style={[styles.sectionContent, { backgroundColor: '#FEF2F2' }]}>
                {explorer.discoveries.map((d) => (
                  <Pressable
                    key={d.id}
                    disabled={!d.waterway && d.latitude === null}
                    style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]}
                    onPress={() => d.waterway ? go({ pathname: '/', params: { markerId: d.waterway.id, markerType: 'waterway' } }) : go({ pathname: '/', params: { lat: String(d.latitude), lng: String(d.longitude) } })}
                    accessibilityRole="button"
                  >
                    <Text style={styles.linkYear}>{d.discoveryYear}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.linkTitle}>{d.name}</Text>
                      {d.waterway ? <Text style={styles.linkMeta}>{d.waterway.name}</Text> : null}
                    </View>
                    <MapPin size={14} color="#9CA3AF" />
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {explorer.lessonPlans && explorer.lessonPlans.length > 0 ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.forestGreen }]}>Deep Dives</Text>
              <View style={styles.sectionContent}>
                {explorer.lessonPlans.map((l) => (
                  <Pressable key={l.id} style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]} onPress={() => go(`/lessons/${l.id}`)} accessibilityRole="button">
                    <BookOpen size={16} color={colors.forestGreen} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.linkTitle}>{l.title}</Text>
                      <Text style={styles.linkMeta}>{[l.gradeLevel, l.topic].filter(Boolean).join(' · ')}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </Pressable>
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
  },
  yearLink: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4, alignSelf: 'flex-start' },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  linkYear: { fontSize: 12, fontWeight: '700', color: colors.earthBrown, width: 40 },
  linkTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  linkMeta: { fontSize: 12, color: '#6B7280', marginTop: 1 },
  figurePortrait: { width: 36, height: 36, borderRadius: 18 },
  mapThumb: { width: 48, height: 36, borderRadius: 6, backgroundColor: '#E7D9C4' },
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
