// A source speaking from its spot (roadmap item 5, 2026-10-20): who, when, where, the opening
// of the checked transcription (or all of it), Read aloud, and the way to the document. Used
// docked on the map tab and inside a voyageur journey node.
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquareQuote, MapPin, X, FileText } from 'lucide-react-native';
import { ReadAloudButton } from '@/components/ReadAloudButton';
import { NarratorToggle } from '@/components/NarratorToggle';
import { useTranslation } from '@/lib/i18n';
import type { Voice } from '@/lib/types/voices';

export const VOICE_COLOR = '#7C2D12';

interface Props {
  voice: Voice;
  onClose?: () => void;
  /** Hide the document link (the document page itself). */
  hideOpen?: boolean;
  /** Show the whole transcription from the start, in a scrolling box. */
  full?: boolean;
  compact?: boolean;
}

export function VoiceCard({ voice, onClose, hideOpen, full, compact }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [expanded, setExpanded] = useState(!!full);
  const who = [voice.author, voice.dateLabel ?? (voice.year ? String(voice.year) : null)].filter(Boolean).join(' · ');
  const body = expanded ? voice.text : voice.excerpt;
  const canExpand = voice.text.length > voice.excerpt.length;

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.header}>
        <MessageSquareQuote size={16} color={VOICE_COLOR} />
        <Text style={styles.kicker} numberOfLines={1}>{t('inTheirOwnWords')}</Text>
        {onClose ? (
          <Pressable onPress={onClose} hitSlop={8} accessibilityLabel={t('close')} style={styles.close}>
            <X size={16} color="#6B7280" strokeWidth={2.5} />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={2}>{voice.title}</Text>
      {who ? <Text style={styles.who} numberOfLines={1}>{who}</Text> : null}
      {voice.spotName ? (
        <View style={styles.spotRow}>
          <MapPin size={12} color="#6B7280" />
          <Text style={styles.spot} numberOfLines={2}>{voice.spotName}</Text>
        </View>
      ) : null}
      {expanded && !compact ? (
        <ScrollView style={styles.fullBox} nestedScrollEnabled>
          <Text style={styles.quote}>{body}</Text>
        </ScrollView>
      ) : (
        <Text style={styles.quote} numberOfLines={expanded ? undefined : 4}>{body}</Text>
      )}
      <View style={styles.actions}>
        <ReadAloudButton text={voice.text} documentId={voice.id} color={VOICE_COLOR} compact />
        <NarratorToggle color={VOICE_COLOR} compact />
        {canExpand ? (
          <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={6}>
            <Text style={styles.link}>{expanded ? t('readLess') : t('readFull')}</Text>
          </Pressable>
        ) : null}
        {!hideOpen ? (
          <Pressable onPress={() => router.push(`/documents/${voice.id}`)} hitSlop={6} style={styles.openRow}>
            <FileText size={13} color="#3B82A3" />
            <Text style={styles.link}>{t('openDocument')}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFBF5', borderRadius: 14, borderWidth: 1, borderColor: '#F3E3D3', borderLeftWidth: 4, borderLeftColor: VOICE_COLOR, padding: 12, gap: 4 },
  cardCompact: { padding: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  kicker: { flex: 1, fontSize: 11, fontWeight: '800', color: VOICE_COLOR, letterSpacing: 0.6, textTransform: 'uppercase' },
  close: { padding: 2 },
  title: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  who: { fontSize: 12, color: '#6B7280' },
  spotRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  spot: { flex: 1, fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
  quote: { fontSize: 14, lineHeight: 21, color: '#374151', fontStyle: 'italic', marginTop: 4 },
  fullBox: { maxHeight: 260, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 8, flexWrap: 'wrap' },
  openRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  link: { fontSize: 12, fontWeight: '600', color: '#3B82A3', textDecorationLine: 'underline' },
});
