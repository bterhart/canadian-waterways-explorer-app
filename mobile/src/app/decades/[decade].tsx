// One decade (roadmap item 1, 2026-10-19): who was on the water, the journeys underway, the posts
// founded, the events and the documents written, every one a link into the record itself.
// GET /api/decades/:decade. "Show this decade on the map" draws the visited waters (`/?decade=`).
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Map as MapIcon, Route, FileText, Landmark, Calendar, Droplets, MapPin } from 'lucide-react-native';
import { useDecade, useDecades } from '@/lib/api/connections-api';
import { useExplorerDetail } from '@/lib/api/waterways-api';
import ExplorerDetailModal from '@/components/ExplorerDetailModal';
import { openOnMap } from '@/components/RelatedLinks';
import { decadeLabel } from '@/lib/types/connections';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B', waterBlue: '#3B82A3', gold: '#C9A227' };

export default function DecadeScreen() {
  const router = useRouter();
  const { decade: param } = useLocalSearchParams<{ decade: string }>();
  const decade = Number(param);
  const valid = Number.isInteger(decade) && decade % 10 === 0;
  const { data, isLoading, isError } = useDecade(valid ? decade : null);
  const { data: decades } = useDecades();
  const [selectedExplorerId, setSelectedExplorerId] = useState<string | null>(null);
  const { data: selectedExplorer } = useExplorerDetail(selectedExplorerId);

  // Neighbouring decades that hold something, for the arrows and the strip
  const index = useMemo(() => (decades ?? []).findIndex((d) => d.decade === decade), [decades, decade]);
  const prev = index > 0 ? decades![index - 1]!.decade : null;
  const next = index >= 0 && index < (decades?.length ?? 0) - 1 ? decades![index + 1]!.decade : null;
  const go = (d: number) => router.replace(`/decades/${d}`);

  const title = valid ? `The ${decadeLabel(decade)}` : 'Decade';
  const waterCount = data?.waterwayIds.length ?? 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title, headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />

      {/* Decade strip: arrows and chips for every decade that holds something */}
      <View style={styles.stripRow}>
        <Pressable disabled={prev === null} onPress={() => prev !== null && go(prev)} style={[styles.arrow, prev === null && { opacity: 0.3 }]} accessibilityLabel="Previous decade">
          <ChevronLeft size={20} color={colors.forestGreen} />
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipRow}>
          {(decades ?? []).map((d) => (
            <Pressable key={d.decade} onPress={() => go(d.decade)} style={[styles.chip, d.decade === decade && styles.chipActive]}>
              <Text style={[styles.chipText, d.decade === decade && styles.chipTextActive]}>{d.decade}s</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable disabled={next === null} onPress={() => next !== null && go(next)} style={[styles.arrow, next === null && { opacity: 0.3 }]} accessibilityLabel="Next decade">
          <ChevronRight size={20} color={colors.forestGreen} />
        </Pressable>
      </View>

      {!valid ? <Text style={styles.empty}>That is not a decade.</Text> : null}
      {isLoading ? <ActivityIndicator style={{ marginTop: 40 }} color={colors.forestGreen} /> : null}
      {isError ? <Text style={styles.empty}>This decade could not be loaded. Check your connection and try again.</Text> : null}

      {data ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {waterCount > 0 ? (
            <Pressable style={styles.mapButton} onPress={() => router.push({ pathname: '/', params: { decade: String(decade) } })} accessibilityRole="button">
              <MapIcon size={16} color="white" />
              <Text style={styles.mapButtonText}>Show this decade on the map · {waterCount} {waterCount === 1 ? 'water' : 'waters'}</Text>
            </Pressable>
          ) : null}

          {/* On the water: explorers with the waters and years, each explorer opening the person view */}
          {data.explorers.length > 0 ? (
            <Section title="On the water" icon={<Droplets size={16} color={colors.waterBlue} />} color={colors.waterBlue}>
              {data.explorers.map((group) => (
                <View key={group.explorer.id} style={styles.explorerBlock}>
                  <Pressable style={styles.explorerRow} onPress={() => setSelectedExplorerId(group.explorer.id)} accessibilityRole="button" accessibilityLabel={`Everything about ${group.explorer.name}`}>
                    {group.explorer.imageUrl ? (
                      <Image source={{ uri: group.explorer.imageUrl }} style={styles.portrait} />
                    ) : (
                      <View style={[styles.portrait, styles.portraitPlaceholder]}><Text style={styles.portraitInitial}>{group.explorer.name.charAt(0)}</Text></View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.explorerName}>{group.explorer.name}</Text>
                      <Text style={styles.explorerMeta}>
                        {group.explorer.nationality ?? ''}
                        {group.explorer.birthYear && group.explorer.deathYear ? ` · ${group.explorer.birthYear}-${group.explorer.deathYear}` : ''}
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </Pressable>
                  <View style={styles.visitChips}>
                    {group.visits.map((v) => (
                      <Pressable key={`${v.waterway.id}-${v.year}`} style={styles.visitChip} onPress={() => openOnMap(router, 'waterway', v.waterway.id)} accessibilityRole="button" accessibilityLabel={`Open ${v.waterway.name} on the map`}>
                        <Text style={styles.visitYear}>{v.year}</Text>
                        <Text style={styles.visitName} numberOfLines={1}>{v.waterway.name}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </Section>
          ) : null}

          {data.expeditions.length > 0 ? (
            <Section title="Journeys underway" icon={<Route size={16} color="#B45309" />} color="#B45309">
              {data.expeditions.map((e) => (
                <Pressable key={e.id} style={styles.lineRow} onPress={() => router.push({ pathname: '/', params: { expeditionId: e.id } })} accessibilityRole="button" accessibilityLabel={`Show ${e.name} on the map`}>
                  <View style={[styles.swatch, { backgroundColor: e.color ?? '#B45309' }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lineTitle}>{e.name}</Text>
                    <Text style={styles.lineMeta}>{e.explorer.name} · {e.endYear && e.endYear !== e.startYear ? `${e.startYear}-${e.endYear}` : e.startYear} · {e.legCount} {e.legCount === 1 ? 'leg' : 'legs'}</Text>
                  </View>
                  <Text style={styles.linkText}>Show on map</Text>
                </Pressable>
              ))}
            </Section>
          ) : null}

          {data.locations.length > 0 ? (
            <Section title="Posts and places founded" icon={<Landmark size={16} color="#EF4444" />} color="#EF4444">
              {data.locations.map((l) => (
                <Pressable key={l.id} style={styles.lineRow} onPress={() => openOnMap(router, 'location', l.id)} accessibilityRole="button" accessibilityLabel={`Open ${l.name} on the map`}>
                  <Text style={styles.yearBadge}>{l.yearEstablished}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lineTitle}>{l.name}</Text>
                    <Text style={styles.lineMeta}>{l.locationType} · {l.waterway.name}</Text>
                  </View>
                  <MapPin size={14} color="#9CA3AF" />
                </Pressable>
              ))}
            </Section>
          ) : null}

          {data.events.length > 0 ? (
            <Section title="What happened" icon={<Calendar size={16} color="#1D4ED8" />} color="#1D4ED8">
              {data.events.map((ev) => {
                const target = ev.location ? { type: 'location' as const, id: ev.location.id } : ev.waterway ? { type: 'waterway' as const, id: ev.waterway.id } : null;
                return (
                  <Pressable key={ev.id} disabled={!target} style={styles.lineRow} onPress={() => target && openOnMap(router, target.type, target.id)} accessibilityRole="button">
                    <Text style={styles.yearBadge}>{ev.year}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.lineTitle}>{ev.title}</Text>
                      <Text style={styles.lineMeta}>
                        {ev.theme.replace(/_/g, ' ')}
                        {ev.explorer ? ` · ${ev.explorer.name}` : ''}
                        {ev.location ? ` · ${ev.location.name}` : ev.waterway ? ` · ${ev.waterway.name}` : ''}
                      </Text>
                    </View>
                    {target ? <MapPin size={14} color="#9CA3AF" /> : null}
                  </Pressable>
                );
              })}
            </Section>
          ) : null}

          {data.documents.length > 0 ? (
            <Section title="Written in this decade" icon={<FileText size={16} color="#6D28D9" />} color="#6D28D9">
              {data.documents.map((d) => (
                <Pressable key={d.id} style={styles.lineRow} onPress={() => router.push(`/documents/${d.id}`)} accessibilityRole="button">
                  <Text style={styles.yearBadge}>{d.originalYear}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lineTitle}>{d.title}</Text>
                    <Text style={styles.lineMeta}>{d.author ?? d.documentType}</Text>
                  </View>
                  <ChevronRight size={16} color="#9CA3AF" />
                </Pressable>
              ))}
            </Section>
          ) : null}

          {data.explorers.length + data.expeditions.length + data.locations.length + data.events.length + data.documents.length === 0 ? (
            <Text style={styles.empty}>Nothing in the database is dated to this decade.</Text>
          ) : null}
        </ScrollView>
      ) : null}

      <Modal visible={!!selectedExplorerId && !!selectedExplorer} transparent animationType="fade" onRequestClose={() => setSelectedExplorerId(null)}>
        {selectedExplorer ? <ExplorerDetailModal explorer={selectedExplorer} onClose={() => setSelectedExplorerId(null)} /> : null}
      </Modal>
    </View>
  );
}

function Section({ title, icon, color, children }: { title: string; icon: React.ReactNode; color: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  stripRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 6 },
  arrow: { paddingHorizontal: 10, paddingVertical: 6 },
  chipRow: { flex: 1, height: 36 },
  chips: { gap: 8, paddingHorizontal: 4, alignItems: 'center' },
  chip: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'white' },
  chipActive: { backgroundColor: colors.forestGreen, borderColor: colors.forestGreen },
  chipText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  chipTextActive: { color: 'white' },
  content: { padding: 16, paddingBottom: 40 },
  mapButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.forestGreen, borderRadius: 12, paddingVertical: 12, marginBottom: 16 },
  mapButtonText: { color: 'white', fontSize: 14, fontWeight: '700' },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  sectionBody: { backgroundColor: 'white', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  explorerBlock: { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  explorerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  portrait: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.forestGreen },
  portraitPlaceholder: { backgroundColor: colors.forestGreen, alignItems: 'center', justifyContent: 'center' },
  portraitInitial: { color: 'white', fontWeight: '700', fontSize: 16 },
  explorerName: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  explorerMeta: { fontSize: 12, color: '#6B7280' },
  visitChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8, marginLeft: 50 },
  visitChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E6F3F8', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, maxWidth: '100%' },
  visitYear: { fontSize: 11, fontWeight: '700', color: colors.waterBlue },
  visitName: { fontSize: 12, color: '#1F2937', flexShrink: 1 },
  lineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  lineTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  lineMeta: { fontSize: 12, color: '#6B7280', marginTop: 1 },
  linkText: { fontSize: 12, color: colors.waterBlue, fontWeight: '600' },
  yearBadge: { fontSize: 12, fontWeight: '700', color: colors.earthBrown, width: 40 },
  swatch: { width: 10, height: 10, borderRadius: 5 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40, paddingHorizontal: 24 },
});
