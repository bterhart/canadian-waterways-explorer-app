// One pair (roadmap item 10): the passage as the app first carried it, the sentences as published,
// the edition and page, what changed, and the student's task. Both texts are shown whole and as
// they are; the first column is labelled for what it is and is never presented as the author's words.
import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, ExternalLink, FileText } from 'lucide-react-native';
import { useSourcePair } from '@/lib/api/source-pairs-api';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', earthBrown: '#8B5A2B', waterBlue: '#3B82A3', darkGreen: '#1A3A24' };

export default function SourcePairScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: pair, isLoading, isError } = useSourcePair(id ?? null);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Loading…' }} />
        <ActivityIndicator size="large" color={colors.forestGreen} />
      </View>
    );
  }
  if (isError || !pair) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Checking the Record' }} />
        <Text style={styles.error}>Unable to load the pair</Text>
      </View>
    );
  }
  const doc = pair.document;
  const unchecked = pair.kind === 'unverifiable' || pair.kind === 'no_such_document';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Checking the Record', headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.kindBadge, pair.kind === 'confirmed' ? styles.kindConfirmed : unchecked ? styles.kindUnverifiable : styles.kindChanged]}>
            <Text style={styles.kindBadgeText}>{pair.kindLabel}</Text>
          </View>
          <Text style={styles.title}>{doc?.title ?? pair.seedTitle}</Text>
          <Text style={styles.meta}>{[doc?.author, doc?.originalDate ?? (doc?.originalYear ? String(doc.originalYear) : null)].filter(Boolean).join(' · ')}</Text>
          {pair.seedTitle !== doc?.title ? <Text style={styles.seedTitle}>First carried as: {pair.seedTitle}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.columnLabel}>As the app first carried it</Text>
          <Text style={styles.columnNote}>Quoted in the original seed data; never checked against a published edition. Not the author's words until proven so.</Text>
          <View style={[styles.textBox, styles.seedBox]}>
            <Text style={styles.passage}>{pair.seedText}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.columnLabel}>As published</Text>
          {pair.publishedText ? (
            <>
              <Text style={styles.columnNote}>{pair.edition ? `Checked against ${pair.edition.title}${pair.edition.year ? ` (${pair.edition.year})` : ''}.` : 'From the edition named on the document.'}</Text>
              <View style={[styles.textBox, styles.publishedBox]}>
                <Text style={styles.passage}>{pair.publishedText}</Text>
              </View>
              {pair.publishedOriginalText ? (
                <View style={[styles.textBox, styles.originalBox]}>
                  <Text style={styles.originalLabel}>In the original language, as printed</Text>
                  <Text style={styles.passage}>{pair.publishedOriginalText}</Text>
                </View>
              ) : null}
            </>
          ) : (
            <View style={[styles.textBox, styles.unverifiableBox]}>
              <Text style={styles.passage}>{pair.kind === 'no_such_document' ? 'No document of this kind exists. There is nothing to put beside the first column.' : 'No published edition of this text could be found, so there is nothing to check the first column against. The document stays as a pointer to where the record is held.'}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What changed</Text>
          <Text style={styles.body}>{pair.whatChanged}</Text>
          {pair.checkedNote ? <Text style={styles.checkedNote}>{pair.checkedNote}</Text> : null}
        </View>

        <View style={[styles.section, styles.taskSection]}>
          <Text style={styles.sectionTitle}>Your task</Text>
          <Text style={styles.body}>{pair.task}</Text>
        </View>

        <View style={styles.links}>
          {pair.edition?.url ? (
            <Pressable style={styles.linkRow} onPress={() => Linking.openURL(pair.edition!.url!)} accessibilityRole="link">
              <ExternalLink size={16} color={colors.waterBlue} />
              <Text style={styles.linkText}>Open the edition</Text>
            </Pressable>
          ) : null}
          {doc ? (
            <Pressable style={styles.linkRow} onPress={() => router.push(`/documents/${doc.id}`)} accessibilityRole="button">
              <FileText size={16} color={colors.waterBlue} />
              <Text style={styles.linkText}>Open the document</Text>
            </Pressable>
          ) : null}
          <Pressable style={styles.linkRow} onPress={() => router.push('/source-pairs')} accessibilityRole="button">
            <BookOpen size={16} color={colors.waterBlue} />
            <Text style={styles.linkText}>All the pairs</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.creamWhite },
  error: { color: '#EF4444' },
  header: { padding: 16, paddingBottom: 4, gap: 6 },
  kindBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  kindChanged: { backgroundColor: '#FEF3C7' },
  kindConfirmed: { backgroundColor: '#D1FAE5' },
  kindUnverifiable: { backgroundColor: '#E5E7EB' },
  kindBadgeText: { fontSize: 11, fontWeight: '700', color: '#374151' },
  title: { fontSize: 20, fontWeight: '800', color: colors.darkGreen },
  meta: { fontSize: 13, color: '#6B7280' },
  seedTitle: { fontSize: 12, color: '#92400E', fontStyle: 'italic' },
  section: { paddingHorizontal: 16, paddingTop: 14 },
  columnLabel: { fontSize: 12, fontWeight: '800', color: colors.earthBrown, letterSpacing: 0.6, textTransform: 'uppercase' },
  columnNote: { fontSize: 12, color: '#6B7280', marginTop: 2, marginBottom: 8, lineHeight: 17 },
  textBox: { borderRadius: 12, padding: 14, borderWidth: 1 },
  seedBox: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  publishedBox: { backgroundColor: 'white', borderColor: '#D1FAE5' },
  originalBox: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', marginTop: 8 },
  unverifiableBox: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  originalLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginBottom: 6 },
  passage: { fontSize: 15, lineHeight: 23, color: '#1F2937' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.darkGreen, marginBottom: 6 },
  body: { fontSize: 15, lineHeight: 22, color: '#374151' },
  checkedNote: { fontSize: 13, lineHeight: 19, color: '#4B5563', marginTop: 10, fontStyle: 'italic' },
  taskSection: { backgroundColor: '#ECFDF5', marginHorizontal: 16, marginTop: 14, borderRadius: 12, paddingBottom: 14 },
  links: { padding: 16, gap: 10 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  linkText: { fontSize: 14, fontWeight: '600', color: colors.waterBlue },
});
