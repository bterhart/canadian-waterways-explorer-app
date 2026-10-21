// Knowledge given (roadmap item 16, 2026-10-20): what named Indigenous people gave the
// expeditions, as records, oldest first, filtered by kind. Each opens the record.
import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { HandHeart, User } from 'lucide-react-native';
import { useKnowledge, useKnowledgeKinds } from '@/lib/api/knowledge-api';
import { KNOWLEDGE_KIND_COLOR, type KnowledgeRecord } from '@/lib/types/knowledge';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B' };

export default function KnowledgeScreen() {
  const router = useRouter();
  const [kind, setKind] = useState<string | null>(null);
  const { data, isLoading, isError } = useKnowledge({});
  const { data: kinds } = useKnowledgeKinds();
  const shown = useMemo(() => (data ?? []).filter((r) => !kind || r.kind === kind), [data, kind]);

  const renderRow = ({ item }: { item: KnowledgeRecord }) => (
    <Pressable style={styles.card} onPress={() => router.push(`/knowledge/${item.id}`)}>
      {item.figure?.imageUrl ? (
        <Image source={{ uri: item.figure.imageUrl }} style={styles.portrait} resizeMode="cover" />
      ) : (
        <View style={[styles.portrait, styles.portraitEmpty]}><User size={22} color="#9CA3AF" /></View>
      )}
      <View style={{ flex: 1 }}>
        <View style={styles.cardTop}>
          <View style={[styles.kind, { backgroundColor: KNOWLEDGE_KIND_COLOR[item.kind] }]}>
            <Text style={styles.kindText}>{item.kindLabel}</Text>
          </View>
          <Text style={styles.year}>{item.yearLabel ?? item.year ?? ''}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.person} numberOfLines={1}>{item.personName}{item.nation ? ` · ${item.nation}` : ''}</Text>
        <Text style={styles.given} numberOfLines={3}>{item.given}</Text>
        <Text style={styles.to} numberOfLines={1}>To {item.explorer?.name ?? item.explorerName}{item.location ? ` · ${item.location.name}` : item.waterway ? ` · ${item.waterway.name}` : ''}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Knowledge Given', headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />
      <View style={styles.intro}>
        <HandHeart size={20} color={colors.earthBrown} />
        <Text style={styles.introText}>
          The routes shown, maps drawn, words interpreted, testimony given, cures, rescues and discoveries the expeditions owed to named Indigenous people, each with its source.
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipBar}>
        <Pressable style={[styles.chip, !kind && styles.chipOn]} onPress={() => setKind(null)}>
          <Text style={[styles.chipText, !kind && styles.chipTextOn]}>All{data ? ` (${data.length})` : ''}</Text>
        </Pressable>
        {(kinds ?? []).filter((k) => k.count > 0).map((k) => (
          <Pressable key={k.kind} style={[styles.chip, kind === k.kind && { backgroundColor: KNOWLEDGE_KIND_COLOR[k.kind], borderColor: KNOWLEDGE_KIND_COLOR[k.kind] }]} onPress={() => setKind(kind === k.kind ? null : k.kind)}>
            <Text style={[styles.chipText, kind === k.kind && styles.chipTextOn]}>{k.label} ({k.count})</Text>
          </Pressable>
        ))}
      </ScrollView>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.forestGreen} style={{ marginTop: 40 }} />
      ) : isError ? (
        <Text style={styles.error}>Unable to load the records</Text>
      ) : (
        <FlatList data={shown} keyExtractor={(r) => r.id} renderItem={renderRow} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  intro: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 16, paddingBottom: 8 },
  introText: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 20 },
  // A horizontal ScrollView in a column collapses to nothing without a height (the historic maps
  // chips did the same on first render, 10.12); fixed height and centred chips, as there.
  chipBar: { flexGrow: 0, height: 44 },
  chips: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'white' },
  chipOn: { backgroundColor: colors.forestGreen, borderColor: colors.forestGreen },
  chipText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  chipTextOn: { color: 'white' },
  list: { padding: 16, paddingTop: 4, gap: 12, paddingBottom: 40 },
  card: { flexDirection: 'row', gap: 12, backgroundColor: 'white', borderRadius: 14, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardPressed: { opacity: 0.8 },
  portrait: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E5E7EB' },
  portraitEmpty: { alignItems: 'center', justifyContent: 'center' },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  kind: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  kindText: { color: 'white', fontSize: 11, fontWeight: '700' },
  year: { fontSize: 12, fontWeight: '700', color: colors.earthBrown },
  title: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  person: { fontSize: 13, color: colors.forestGreen, fontWeight: '600', marginTop: 2 },
  given: { fontSize: 13, color: '#4B5563', lineHeight: 19, marginTop: 4 },
  to: { fontSize: 12, color: '#6B7280', marginTop: 6 },
  error: { textAlign: 'center', marginTop: 40, color: '#EF4444' },
});
