// Checking the Record (roadmap item 10): the 44 passages the app once carried unchecked, since
// corrected, beside the sentences as published, sorted by the kind of difference. Grade and kind chips; the
// list honours the device's class content scope through its id.
import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FileCheck, ChevronRight } from 'lucide-react-native';
import { useSourcePairKinds, useSourcePairs } from '@/lib/api/source-pairs-api';
import { useDeviceId } from '@/lib/identity';
import { GRADE_LEVEL_RANGES, getGradeLevelRangeColor } from '@/lib/types/education';
import type { SourcePairSummary } from '@/lib/types/source-pairs';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B', darkGreen: '#1A3A24' };

export default function SourcePairsScreen() {
  const router = useRouter();
  const userId = useDeviceId() ?? undefined;
  const [kind, setKind] = useState<string | undefined>();
  const [grade, setGrade] = useState<string | undefined>();
  const { data, isLoading, isError } = useSourcePairs({ kind, gradeLevel: grade, userId });
  const { data: kinds } = useSourcePairKinds();

  const renderPair = ({ item }: { item: SourcePairSummary }) => (
    <Pressable style={styles.card} onPress={() => router.push(`/source-pairs/${item.id}`)} accessibilityRole="button">
      <View style={styles.cardTop}>
        <View style={[styles.kindBadge, item.kind === 'confirmed' ? styles.kindConfirmed : item.kind === 'unverifiable' || item.kind === 'no_such_document' ? styles.kindUnverifiable : styles.kindChanged]}>
          <Text style={styles.kindBadgeText}>{item.kindLabel}</Text>
        </View>
        {item.gradeLevel ? (
          <View style={[styles.gradeBadge, { backgroundColor: getGradeLevelRangeColor(item.gradeLevel) }]}>
            <Text style={styles.gradeBadgeText}>{item.gradeLevel}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.cardTitle}>{item.documentTitle}</Text>
      <Text style={styles.cardMeta} numberOfLines={1}>
        {[item.author, item.originalDate ?? (item.originalYear ? String(item.originalYear) : null)].filter(Boolean).join(' · ')}
      </Text>
      {item.seedTitle !== item.documentTitle ? <Text style={styles.seedTitle} numberOfLines={1}>First carried as: {item.seedTitle}</Text> : null}
      <View style={styles.cardBottom}>
        <Text style={styles.edition} numberOfLines={1}>{item.edition ? `Checked against ${item.edition.title}` : 'No published edition found'}</Text>
        <ChevronRight size={18} color="#9CA3AF" />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Checking the Record', headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />
      <View style={styles.intro}>
        <FileCheck size={20} color={colors.earthBrown} />
        <Text style={styles.introText}>
          Historical texts are often misquoted, and sometimes invented outright. Here are 44 real cases this app found in its own pages and set right against the published editions. Each shows the passage as it first read, beside the sentences as published in the edition the document now cites, with what changed. Read both. The first column is never the author's words.
        </Text>
      </View>
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Pressable style={[styles.chip, !grade && styles.chipActive]} onPress={() => setGrade(undefined)}>
            <Text style={[styles.chipText, !grade && styles.chipTextActive]}>All grades</Text>
          </Pressable>
          {GRADE_LEVEL_RANGES.filter((g) => g !== 'K-3').map((g) => (
            <Pressable key={g} style={[styles.chip, grade === g && styles.chipActive]} onPress={() => setGrade(grade === g ? undefined : g)}>
              <Text style={[styles.chipText, grade === g && styles.chipTextActive]}>{g}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Pressable style={[styles.chip, !kind && styles.chipActive]} onPress={() => setKind(undefined)}>
            <Text style={[styles.chipText, !kind && styles.chipTextActive]}>Every kind</Text>
          </Pressable>
          {(kinds ?? []).map((k) => (
            <Pressable key={k.kind} style={[styles.chip, kind === k.kind && styles.chipActive]} onPress={() => setKind(kind === k.kind ? undefined : k.kind)}>
              <Text style={[styles.chipText, kind === k.kind && styles.chipTextActive]}>{k.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.forestGreen} style={{ marginTop: 40 }} />
      ) : isError ? (
        <Text style={styles.error}>Unable to load the pairs</Text>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(p) => p.id}
          renderItem={renderPair}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.empty}>No pairs for this choice.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  intro: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 16, paddingBottom: 8 },
  introText: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 20 },
  filters: { gap: 6, paddingBottom: 6 },
  chips: { paddingHorizontal: 16, gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  chipActive: { backgroundColor: colors.forestGreen, borderColor: colors.forestGreen },
  chipText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  chipTextActive: { color: 'white' },
  list: { padding: 16, paddingTop: 8, gap: 12, paddingBottom: 40 },
  card: { backgroundColor: 'white', borderRadius: 14, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  kindBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  kindChanged: { backgroundColor: '#FEF3C7' },
  kindConfirmed: { backgroundColor: '#D1FAE5' },
  kindUnverifiable: { backgroundColor: '#E5E7EB' },
  kindBadgeText: { fontSize: 11, fontWeight: '700', color: '#374151' },
  gradeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  gradeBadgeText: { fontSize: 11, fontWeight: '700', color: 'white' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.darkGreen },
  cardMeta: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  seedTitle: { fontSize: 12, color: '#92400E', marginTop: 4, fontStyle: 'italic' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  edition: { flex: 1, fontSize: 12, color: '#3B82A3' },
  error: { textAlign: 'center', marginTop: 40, color: '#EF4444' },
  empty: { textAlign: 'center', marginTop: 40, color: '#6B7280' },
});
