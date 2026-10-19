// Who Was Here When (roadmap item 1, 2026-10-19): every decade the database dates something to,
// with what it holds. Each row opens that decade.
import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { History, ChevronRight } from 'lucide-react-native';
import { useDecades } from '@/lib/api/connections-api';
import type { DecadeSummary } from '@/lib/types/connections';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B' };

const centuryLabel = (decade: number) => {
  const n = Math.floor(decade / 100) + 1;
  const suffix = n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th';
  return `${n}${suffix} century`;
};

const summaryLine = (d: DecadeSummary) => {
  const parts: string[] = [];
  if (d.explorers) parts.push(`${d.explorers} ${d.explorers === 1 ? 'explorer' : 'explorers'} on ${d.visits} ${d.visits === 1 ? 'water' : 'waters'}`);
  if (d.expeditions) parts.push(`${d.expeditions} ${d.expeditions === 1 ? 'journey' : 'journeys'}`);
  if (d.locations) parts.push(`${d.locations} ${d.locations === 1 ? 'post founded' : 'posts founded'}`);
  if (d.events) parts.push(`${d.events} ${d.events === 1 ? 'event' : 'events'}`);
  if (d.documents) parts.push(`${d.documents} ${d.documents === 1 ? 'document' : 'documents'}`);
  return parts.join(' · ');
};

export default function DecadesScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useDecades();

  const renderRow = ({ item, index }: { item: DecadeSummary; index: number }) => {
    const newCentury = index === 0 || Math.floor(item.decade / 100) !== Math.floor((data![index - 1]!.decade) / 100);
    const weight = Math.min(1, (item.visits + item.events + item.locations) / 60);
    return (
      <View>
        {newCentury ? <Text style={styles.century}>{centuryLabel(item.decade)}</Text> : null}
        <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]} onPress={() => router.push(`/decades/${item.decade}`)} accessibilityRole="button">
          <View style={styles.decadeBadge}>
            <Text style={styles.decadeText}>{item.decade}s</Text>
            <View style={styles.bar}><View style={[styles.barFill, { width: `${Math.max(6, Math.round(weight * 100))}%` }]} /></View>
          </View>
          <Text style={styles.summary}>{summaryLine(item)}</Text>
          <ChevronRight size={18} color="#9CA3AF" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Who Was Here When', headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />
      <View style={styles.intro}>
        <History size={18} color={colors.earthBrown} />
        <Text style={styles.introText}>Pick a decade to see who was on which waters, the journeys underway, the posts that went up, what happened and what was written. Every year comes from the record it belongs to.</Text>
      </View>
      {isLoading ? <ActivityIndicator style={{ marginTop: 40 }} color={colors.forestGreen} /> : null}
      {isError ? <Text style={styles.empty}>The decades could not be loaded. Check your connection and try again.</Text> : null}
      {data ? <FlatList data={data} keyExtractor={(d) => String(d.decade)} renderItem={renderRow} contentContainerStyle={styles.list} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  intro: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 8, alignItems: 'flex-start' },
  introText: { flex: 1, fontSize: 13, color: '#4B5563', lineHeight: 19 },
  list: { padding: 12, paddingBottom: 32 },
  century: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 12, marginBottom: 6, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'white', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  rowPressed: { opacity: 0.85 },
  decadeBadge: { width: 64 },
  decadeText: { fontSize: 16, fontWeight: '800', color: colors.earthBrown },
  bar: { height: 4, backgroundColor: '#F3E8D8', borderRadius: 2, marginTop: 4, overflow: 'hidden' },
  barFill: { height: 4, backgroundColor: colors.earthBrown, borderRadius: 2 },
  summary: { flex: 1, fontSize: 12, color: '#4B5563', lineHeight: 17 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40, paddingHorizontal: 24 },
});
