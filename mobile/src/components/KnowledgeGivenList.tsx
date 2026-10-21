// "Knowledge given" rows (roadmap item 16): what named Indigenous people gave the expeditions,
// shown on a figure's page, an explorer's modal and a water's or place's sheet. Each row opens
// the record.
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { HandHeart, ChevronRight } from 'lucide-react-native';
import { KNOWLEDGE_KIND_COLOR, type KnowledgeRecord } from '@/lib/types/knowledge';

interface Props {
  records: KnowledgeRecord[] | undefined | null;
  titleColor?: string;
  /** Called before leaving, e.g. to close a modal that would sit over the record page. */
  onBeforeNavigate?: () => void;
  /** Hide the person's name on rows (the figure's own page). */
  hidePerson?: boolean;
}

export function KnowledgeGivenList({ records, titleColor = '#2D5A3D', onBeforeNavigate, hidePerson }: Props) {
  const router = useRouter();
  if (!records || records.length === 0) return null;
  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <HandHeart size={18} color={titleColor} />
        <Text style={[styles.title, { color: titleColor }]}>Knowledge given</Text>
      </View>
      <View style={styles.list}>
        {records.map((r) => (
          <Pressable
            key={r.id}
            style={styles.row}
            onPress={() => { onBeforeNavigate?.(); router.push(`/knowledge/${r.id}`); }}
            accessibilityRole="button"
          >
            <View style={[styles.kind, { backgroundColor: KNOWLEDGE_KIND_COLOR[r.kind] }]}>
              <Text style={styles.kindText}>{r.kindLabel}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{r.title}</Text>
              <Text style={styles.rowMeta} numberOfLines={1}>
                {[hidePerson ? null : r.personName, r.yearLabel ?? (r.year ? String(r.year) : null), r.explorer?.name ?? r.explorerName].filter(Boolean).join(' · ')}
              </Text>
            </View>
            <ChevronRight size={16} color="#9CA3AF" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700' },
  list: { backgroundColor: '#F7F3EA', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  kind: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, maxWidth: 96 },
  kindText: { color: 'white', fontSize: 10, fontWeight: '700' },
  rowTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  rowMeta: { fontSize: 12, color: '#6B7280', marginTop: 1 },
});
