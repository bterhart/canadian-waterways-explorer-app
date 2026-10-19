// Historic Maps gallery (roadmap item 15, 2026-10-19): the maps that made the country, oldest
// first, filtered by century and region. Each card opens the map's page.
import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, ActivityIndicator, ScrollView, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Map as MapIcon, Layers } from 'lucide-react-native';
import { useHistoricalMaps } from '@/lib/api/historical-maps-api';
import type { HistoricalMapSummary } from '@/lib/types/historical-maps';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B', parchment: '#F5ECD7' };

const centuryOf = (year: number) => `${Math.floor((year - 1) / 100) + 1}th century`.replace(/^(\d+)th/, (m, n) => `${n}${n.endsWith('1') && n !== '11' ? 'st' : n.endsWith('2') && n !== '12' ? 'nd' : n.endsWith('3') && n !== '13' ? 'rd' : 'th'}`);

export default function HistoricalMapsScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useHistoricalMaps();
  const [century, setCentury] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  // Two columns sized from the window: with `flex: 1` alone the cards came out at four-fifths of
  // the screen each and the second column sat off the right edge.
  const { width } = useWindowDimensions();
  const cardWidth = Math.floor((width - 12 * 3) / 2);

  const centuries = useMemo(() => [...new Set((data ?? []).map((m) => centuryOf(m.year)))], [data]);
  const regions = useMemo(() => [...new Set((data ?? []).map((m) => m.region).filter((r): r is string => !!r))].sort(), [data]);
  const shown = useMemo(() => (data ?? []).filter((m) => (!century || centuryOf(m.year) === century) && (!region || m.region === region)), [data, century, region]);

  const renderCard = ({ item }: { item: HistoricalMapSummary }) => (
    <Pressable style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && styles.cardPressed]} onPress={() => router.push(`/historical-maps/${item.id}`)}>
      <Image source={{ uri: item.imageUrl }} style={styles.thumb} resizeMode="cover" />
      <View style={styles.cardBody}>
        <Text style={styles.cardYear}>{item.yearLabel ?? item.year}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardMaker} numberOfLines={1}>{item.mapmaker}{item.mapmakerNation ? ` · ${item.mapmakerNation}` : ''}</Text>
        <View style={styles.cardFooter}>
          {item.region ? <Text style={styles.cardRegion} numberOfLines={1}>{item.region}</Text> : <View />}
          {item.hasBounds ? (
            <View style={styles.overlayBadge}>
              <Layers size={11} color="white" />
              <Text style={styles.overlayBadgeText}>On the map</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Historic Maps', headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />
      <View style={styles.intro}>
        <MapIcon size={18} color={colors.earthBrown} />
        <Text style={styles.introText}>The maps that made the country, from the first charts of the Gulf to the surveys of the fur trade, with what each got right and wrong. Maps drawn by Indigenous people for explorers are here too, with the mapmaker named.</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipRow}>
        <Chip label="All" active={!century} onPress={() => setCentury(null)} />
        {centuries.map((c) => <Chip key={c} label={c} active={century === c} onPress={() => setCentury(century === c ? null : c)} />)}
      </ScrollView>
      {regions.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipRow}>
          {regions.map((r) => <Chip key={r} label={r} active={region === r} onPress={() => setRegion(region === r ? null : r)} />)}
        </ScrollView>
      ) : null}
      {isLoading ? <ActivityIndicator style={{ marginTop: 40 }} color={colors.forestGreen} /> : null}
      {isError ? <Text style={styles.empty}>The maps could not be loaded. Check your connection and try again.</Text> : null}
      {!isLoading && !isError ? (
        <FlatList data={shown} keyExtractor={(m) => m.id} renderItem={renderCard} numColumns={2} columnWrapperStyle={styles.row} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>No maps match this filter.</Text>} />
      ) : null}
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  intro: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 8, alignItems: 'flex-start' },
  introText: { flex: 1, fontSize: 13, color: '#4B5563', lineHeight: 19 },
  // Explicit height: a horizontal row above a FlatList was laid out at half height on its first
  // render and only settled after a tap.
  chipRow: { flexGrow: 0, height: 44 },
  chips: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'white' },
  chipActive: { backgroundColor: colors.forestGreen, borderColor: colors.forestGreen },
  chipText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  chipTextActive: { color: 'white' },
  list: { padding: 12, paddingBottom: 32 },
  row: { gap: 12, marginBottom: 12 },
  card: { backgroundColor: 'white', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  cardPressed: { opacity: 0.9 },
  thumb: { width: '100%', height: 130, backgroundColor: colors.parchment },
  cardBody: { padding: 10 },
  cardYear: { fontSize: 12, fontWeight: '700', color: colors.earthBrown, marginBottom: 2 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', lineHeight: 19 },
  cardMaker: { fontSize: 12, color: '#6B7280', marginTop: 3 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, gap: 6 },
  cardRegion: { fontSize: 11, color: '#9CA3AF', flex: 1 },
  overlayBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.forestGreen, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  overlayBadgeText: { color: 'white', fontSize: 10, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40, paddingHorizontal: 24 },
});
