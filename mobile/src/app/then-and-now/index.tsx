// Then and Now (roadmap item 7, 2026-10-20): period images paired with modern photographs of
// the same spots, oldest first. Slide each one; tap the title to open its page.
import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Images, ChevronRight } from 'lucide-react-native';
import { useThenAndNow } from '@/lib/api/then-and-now-api';
import { ThenAndNowCompare } from '@/components/ThenAndNowCompare';
import type { ThenAndNowPair } from '@/lib/types/then-and-now';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B' };

export default function ThenAndNowScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useThenAndNow();

  const renderPair = ({ item }: { item: ThenAndNowPair }) => (
    <View style={styles.card}>
      <Pressable style={styles.cardHeader} onPress={() => router.push(`/then-and-now/${item.id}`)} accessibilityRole="button">
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMeta} numberOfLines={1}>
            {[item.location?.name ?? item.waterway?.name, `${item.then.yearLabel ?? item.then.year ?? 'then'} · ${item.now.year ?? 'now'}`].filter(Boolean).join(' · ')}
          </Text>
        </View>
        <ChevronRight size={18} color="#9CA3AF" />
      </Pressable>
      <ThenAndNowCompare pair={item} height={220} bare />
      {item.note ? <Text style={styles.note} numberOfLines={3}>{item.note}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Then and Now', headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />
      <View style={styles.intro}>
        <Images size={20} color={colors.earthBrown} />
        <Text style={styles.introText}>The same spot, then and now. Drag the handle to slide between a period image and a photograph taken from near the same place.</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.forestGreen} style={{ marginTop: 40 }} />
      ) : isError ? (
        <Text style={styles.error}>Unable to load the pairs</Text>
      ) : (
        <FlatList data={data ?? []} keyExtractor={(p) => p.id} renderItem={renderPair} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  intro: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 16, paddingBottom: 8 },
  introText: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 20 },
  list: { padding: 16, paddingTop: 4, gap: 14, paddingBottom: 40 },
  card: { backgroundColor: 'white', borderRadius: 14, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  cardMeta: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  note: { fontSize: 13, color: '#4B5563', lineHeight: 19, marginTop: 10 },
  error: { textAlign: 'center', marginTop: 40, color: '#EF4444' },
});
