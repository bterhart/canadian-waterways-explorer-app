// One "knowledge given" record (roadmap item 16): who gave what to whom, where and when, what
// came of it, and the sources it rests on. The person, the explorer and the place each open.
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { User, Compass, MapPin, HandHeart } from 'lucide-react-native';
import { useKnowledgeRecord } from '@/lib/api/knowledge-api';
import { useExplorerDetail } from '@/lib/api/waterways-api';
import { KNOWLEDGE_KIND_COLOR } from '@/lib/types/knowledge';
import { SourcesList } from '@/components/SourcesList';
import ExplorerDetailModal from '@/components/ExplorerDetailModal';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B', waterBlue: '#3B82A3' };

export default function KnowledgeRecordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: record, isLoading, isError } = useKnowledgeRecord(id ?? null);
  const [explorerId, setExplorerId] = useState<string | null>(null);
  const { data: explorer } = useExplorerDetail(explorerId);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Loading…' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }
  if (isError || !record) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Knowledge Given' }} />
        <Text style={styles.error}>Unable to load the record</Text>
      </View>
    );
  }

  const place = record.location ?? record.waterway;
  const kindColor = KNOWLEDGE_KIND_COLOR[record.kind];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Knowledge Given', headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <View style={styles.kindRow}>
            <View style={[styles.kind, { backgroundColor: kindColor }]}>
              <HandHeart size={12} color="white" />
              <Text style={styles.kindText}>{record.kindLabel}</Text>
            </View>
            <Text style={styles.year}>{record.yearLabel ?? record.year ?? ''}</Text>
          </View>
          <Text style={styles.title}>{record.title}</Text>
        </View>

        {/* Who gave it, who received it, where */}
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [styles.who, pressed && record.figure && { opacity: 0.7 }]}
            disabled={!record.figure}
            onPress={() => record.figure && router.push(`/notable-figures/${record.figure.id}`)}
            accessibilityRole={record.figure ? 'button' : undefined}
          >
            {record.figure?.imageUrl ? (
              <Image source={{ uri: record.figure.imageUrl }} style={styles.portrait} resizeMode="cover" />
            ) : (
              <View style={[styles.portrait, styles.portraitEmpty]}><User size={24} color="#9CA3AF" /></View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.whoLabel}>Given by</Text>
              <Text style={styles.whoName}>{record.personName}</Text>
              {record.nation ? <Text style={styles.whoMeta}>{record.nation}</Text> : null}
              {record.figure ? <Text style={styles.link}>Open the biography</Text> : null}
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.who, pressed && record.explorer && { opacity: 0.7 }]}
            disabled={!record.explorer}
            onPress={() => record.explorer && setExplorerId(record.explorer.id)}
            accessibilityRole={record.explorer ? 'button' : undefined}
          >
            <View style={[styles.portrait, styles.portraitEmpty]}><Compass size={24} color={colors.earthBrown} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.whoLabel}>To</Text>
              <Text style={styles.whoName}>{record.explorer?.name ?? record.explorerName}</Text>
              {record.explorer ? <Text style={styles.link}>Open the explorer</Text> : null}
            </View>
          </Pressable>
          {place ? (
            <Pressable
              style={({ pressed }) => [styles.who, pressed && { opacity: 0.7 }]}
              onPress={() => router.push({ pathname: '/', params: { markerId: place.id, markerType: record.location ? 'location' : 'waterway' } })}
              accessibilityRole="button"
            >
              <View style={[styles.portrait, styles.portraitEmpty]}><MapPin size={24} color={colors.waterBlue} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.whoLabel}>Where</Text>
                <Text style={styles.whoName}>{record.location ? record.location.name : record.waterway!.name}</Text>
                {record.location && record.waterway ? <Text style={styles.whoMeta}>{record.waterway.name}</Text> : null}
                <Text style={styles.link}>Show on the map</Text>
              </View>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What was given</Text>
          <Text style={styles.body}>{record.given}</Text>
        </View>
        {record.outcome ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What came of it</Text>
            <Text style={styles.body}>{record.outcome}</Text>
          </View>
        ) : null}

        {/* Sources (Citation table, roadmap item 14) */}
        <View style={styles.section}>
          <SourcesList targetType="knowledge_given" targetId={record.id} titleColor={colors.forestGreen} />
        </View>
      </ScrollView>

      {explorerId && explorer ? <ExplorerDetailModal explorer={explorer} onClose={() => setExplorerId(null)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.creamWhite },
  error: { color: '#EF4444' },
  header: { backgroundColor: 'white', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  kindRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  kind: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  kindText: { color: 'white', fontSize: 12, fontWeight: '700' },
  year: { fontSize: 13, fontWeight: '700', color: colors.earthBrown },
  title: { fontSize: 22, fontWeight: '800', color: '#1A3A24', lineHeight: 29 },
  section: { backgroundColor: 'white', marginTop: 12, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A3A24', marginBottom: 10 },
  body: { fontSize: 15, color: '#374151', lineHeight: 24 },
  who: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  portrait: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F3F4F6' },
  portraitEmpty: { alignItems: 'center', justifyContent: 'center' },
  whoLabel: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5, textTransform: 'uppercase' },
  whoName: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginTop: 2 },
  whoMeta: { fontSize: 13, color: '#6B7280', marginTop: 1 },
  link: { fontSize: 13, fontWeight: '600', color: colors.waterBlue, textDecorationLine: 'underline', marginTop: 4 },
});
