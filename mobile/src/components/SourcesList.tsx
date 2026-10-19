// "Sources" card (roadmap item 14, 2026-10-19): the structured citations behind a record, from the
// Citation table through GET /api/citations/:targetType/:targetId. Each row opens its link; a long
// press copies the formatted reference; the footer shares the whole list as BibTeX, RIS or text and
// offers the citation for the app's own record.
import React, { useState } from 'react';
import { View, Text, Pressable, Linking, Share, StyleSheet, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { BookMarked, Copy, Check, ExternalLink, Share2 } from 'lucide-react-native';
import { useCitations } from '@/lib/api/citations-api';
import type { Citation, CitationTargetType } from '@/lib/types/citations';

const KIND_LABEL: Record<string, string> = {
  dcb: 'DCB', encyclopedia: 'Encyclopedia', edition: 'Edition', archive: 'Archive', place_name_record: 'Place name',
  parks_canada: 'Parks Canada', book: 'Book', article: 'Article', web: 'Web',
};
const KIND_COLOR: Record<string, string> = {
  dcb: '#7C2D12', encyclopedia: '#1D4ED8', edition: '#365314', archive: '#6B21A8', place_name_record: '#0F766E',
  parks_canada: '#166534', book: '#78350F', article: '#1E3A8A', web: '#374151',
};

interface Props {
  targetType: CitationTargetType;
  targetId: string;
  titleColor?: string;
  linkColor?: string;
}

function CopyButton({ text, color }: { text: string; color: string }) {
  const [done, setDone] = useState(false);
  return (
    <Pressable
      onPress={async () => { await Clipboard.setStringAsync(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      hitSlop={8}
      style={styles.copyButton}
      accessibilityLabel="Copy citation"
    >
      {done ? <Check size={16} color="#15803D" /> : <Copy size={16} color={color} />}
    </Pressable>
  );
}

export function SourcesList({ targetType, targetId, titleColor = '#8B5A2B', linkColor = '#3B82A3' }: Props) {
  const { data, isLoading } = useCitations(targetType, targetId);
  if (isLoading) return <ActivityIndicator style={{ marginVertical: 8 }} color={titleColor} />;
  if (!data) return null;
  const { citations, recordCitation, exports } = data;

  const share = async (format: 'bibtex' | 'ris' | 'text') => {
    const body = exports[format];
    try { await Share.share({ message: body, title: `Sources: ${recordCitation.title}` }); } catch { /* user dismissed */ }
  };

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <BookMarked size={18} color={titleColor} />
        <Text style={[styles.heading, { color: titleColor }]}>Sources</Text>
        <Text style={styles.count}>{citations.length}</Text>
      </View>
      {citations.length === 0 ? (
        <Text style={styles.empty}>No structured source is recorded for this entry yet.</Text>
      ) : (
        <View style={styles.list}>
          {citations.map((c: Citation, index: number) => (
            <Pressable
              key={c.id}
              onPress={() => (c.url ? Linking.openURL(c.url) : undefined)}
              onLongPress={() => Clipboard.setStringAsync(c.text)}
              style={[styles.row, { backgroundColor: index % 2 ? '#FAF3E8' : '#F0E6D9' }]}
            >
              <View style={styles.rowTop}>
                <View style={[styles.kindBadge, { backgroundColor: KIND_COLOR[c.kind] ?? '#374151' }]}>
                  <Text style={styles.kindText}>{KIND_LABEL[c.kind] ?? c.kind}</Text>
                </View>
                {c.year ? <Text style={styles.year}>{c.year}</Text> : null}
                <View style={{ flex: 1 }} />
                <CopyButton text={c.text} color={linkColor} />
              </View>
              {c.author ? <Text style={styles.author}>{c.author}</Text> : null}
              <Text style={styles.title}>{c.title}</Text>
              {c.container || c.publisher ? (
                <Text style={styles.container}>{[c.container, c.publisher].filter(Boolean).join(' · ')}{c.pages ? ` · ${c.pages}` : ''}</Text>
              ) : null}
              {c.note ? <Text style={styles.note}>{c.note}</Text> : null}
              {c.url ? (
                <View style={styles.linkRow}>
                  <ExternalLink size={13} color={linkColor} />
                  <Text style={[styles.linkText, { color: linkColor }]} numberOfLines={1}>{c.url.replace(/^https?:\/\/(www\.)?/, '')}</Text>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>
      )}

      {/* Cite this record */}
      <View style={styles.recordBox}>
        <View style={styles.rowTop}>
          <Text style={styles.recordLabel}>Cite this record</Text>
          <View style={{ flex: 1 }} />
          <CopyButton text={recordCitation.text} color={linkColor} />
        </View>
        <Text style={styles.recordText}>{recordCitation.text}</Text>
      </View>

      {/* Export */}
      <View style={styles.exportRow}>
        <Share2 size={14} color="#6B7280" />
        <Text style={styles.exportLabel}>Export</Text>
        {(['bibtex', 'ris', 'text'] as const).map((f) => (
          <Pressable key={f} onPress={() => share(f)} style={[styles.exportChip, { borderColor: linkColor }]}>
            <Text style={[styles.exportChipText, { color: linkColor }]}>{f === 'bibtex' ? 'BibTeX' : f === 'ris' ? 'RIS' : 'Text'}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 16 },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  heading: { fontSize: 18, fontWeight: '700' },
  count: { fontSize: 13, color: '#6B7280', backgroundColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 1, overflow: 'hidden' },
  empty: { fontSize: 13, color: '#6B7280', fontStyle: 'italic', marginBottom: 12 },
  list: { borderRadius: 12, overflow: 'hidden' },
  row: { paddingVertical: 12, paddingHorizontal: 16 },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  kindBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  kindText: { color: 'white', fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  year: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  copyButton: { padding: 4 },
  author: { fontSize: 14, fontWeight: '600', color: '#4B3621', marginBottom: 2 },
  title: { fontSize: 15, fontStyle: 'italic', lineHeight: 21, color: '#2A2520' },
  container: { fontSize: 13, color: '#666', marginTop: 3 },
  note: { fontSize: 12, color: '#777', marginTop: 4, lineHeight: 17 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  linkText: { fontSize: 12, textDecorationLine: 'underline', flex: 1 },
  recordBox: { marginTop: 12, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 12 },
  recordLabel: { fontSize: 12, fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.5 },
  recordText: { fontSize: 13, color: '#374151', lineHeight: 19 },
  exportRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  exportLabel: { fontSize: 13, color: '#6B7280', marginRight: 4 },
  exportChip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  exportChipText: { fontSize: 12, fontWeight: '600' },
});

export default SourcesList;
