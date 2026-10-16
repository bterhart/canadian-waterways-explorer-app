// "Additional Study" list, shared by the detail sheet, the explorer modal and the
// notable-figure screen. Entries come from the ReadingGuide table through each
// record's detail route (decision 12, 2026-10-16).
import React from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';

export interface ReadingGuideListEntry {
  id?: string;
  title: string;
  authorSource?: string | null;
  publisher?: string | null;
  year?: string | null;
  url?: string | null;
  description?: string | null;
  gradeLevel?: string | null;
}

interface Props {
  entries: ReadingGuideListEntry[] | null | undefined;
  /** Section heading colour; defaults to the earth-brown used across the app. */
  titleColor?: string;
  linkColor?: string;
}

export function ReadingGuideList({ entries, titleColor = '#8B5A2B', linkColor = '#3B82A3' }: Props) {
  if (!entries || entries.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: titleColor }]}>Additional Study</Text>
      <View style={styles.list}>
        {entries.map((entry, index) => {
          const isOdd = index % 2 === 1;
          return (
            <View key={entry.id ?? index} style={[styles.entry, { backgroundColor: isOdd ? '#FAF3E8' : '#F0E6D9' }]}>
              <Text style={[styles.title, { color: isOdd ? '#333' : '#2A2520' }]}>{entry.title}</Text>
              {entry.authorSource ? (
                <Text style={[styles.author, { color: isOdd ? titleColor : '#6B4423' }]}>{entry.authorSource}</Text>
              ) : null}
              {entry.publisher || entry.year || entry.gradeLevel ? (
                <View style={styles.meta}>
                  {entry.publisher ? <Text style={styles.metaText}>{entry.publisher}</Text> : null}
                  {entry.publisher && entry.year ? <Text style={styles.metaSeparator}> · </Text> : null}
                  {entry.year ? <Text style={styles.metaText}>{entry.year}</Text> : null}
                  {entry.gradeLevel ? (
                    <View style={styles.gradeBadge}>
                      <Text style={styles.gradeText}>Grades {entry.gradeLevel}</Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
              {entry.description ? <Text style={styles.description}>{entry.description}</Text> : null}
              {entry.url ? (
                <Pressable onPress={() => Linking.openURL(entry.url!)} style={styles.link}>
                  <Text style={[styles.linkText, { color: linkColor }]}>View Resource</Text>
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 16 },
  heading: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  list: { borderRadius: 12, overflow: 'hidden' },
  entry: { paddingVertical: 12, paddingHorizontal: 16 },
  title: { fontSize: 15, fontStyle: 'italic', lineHeight: 22, marginBottom: 4 },
  author: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 8, gap: 2 },
  metaText: { fontSize: 13, color: '#666' },
  metaSeparator: { fontSize: 13, color: '#999' },
  gradeBadge: { marginLeft: 8, backgroundColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  gradeText: { fontSize: 11, color: '#374151', fontWeight: '600' },
  description: { fontSize: 13, color: '#555', lineHeight: 20 },
  link: { marginTop: 8, alignSelf: 'flex-start' },
  linkText: { fontSize: 13, textDecorationLine: 'underline' },
});

export default ReadingGuideList;
