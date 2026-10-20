// In Their Own Words (housekeeping, 2026-10-20): every checked transcription, oldest first, each
// with Read aloud, the whole passage, and the way to its document and its spot on the map. The
// fourth People in History card on Discover; also the one place to find every narration.
import React, { useMemo } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MessageSquareQuote, MapPin } from 'lucide-react-native';
import { useVoices } from '@/lib/api/voices-api';
import { VoiceCard, VOICE_COLOR } from '@/components/VoiceCard';
import { useTranslation } from '@/lib/i18n';
import type { Voice } from '@/lib/types/voices';

const colors = { forestGreen: '#2D5A3D', creamWhite: '#FFFEF7', waterBlue: '#3B82A3' };

export default function VoicesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data, isLoading, isError } = useVoices(true);
  const voices = useMemo(() => [...(data ?? [])].sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.title.localeCompare(b.title)), [data]);

  const renderVoice = ({ item }: { item: Voice }) => (
    <View style={styles.item}>
      <VoiceCard voice={item} />
      <Pressable
        style={styles.placeRow}
        onPress={() => router.push({ pathname: '/', params: { voiceId: item.id } })}
        accessibilityRole="link"
        hitSlop={6}
      >
        <MapPin size={13} color={colors.waterBlue} />
        <Text style={styles.placeText} numberOfLines={1}>
          {[item.waterway?.name ?? item.location?.name, t('showOnMap')].filter(Boolean).join(' · ')}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t('inTheirOwnWordsTitle'), headerStyle: { backgroundColor: colors.forestGreen }, headerTintColor: 'white' }} />
      <View style={styles.intro}>
        <MessageSquareQuote size={20} color={VOICE_COLOR} />
        <Text style={styles.introText}>{t('voicesIntro')}</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.forestGreen} style={{ marginTop: 40 }} />
      ) : isError ? (
        <Text style={styles.error}>{t('error')}</Text>
      ) : (
        <FlatList data={voices} keyExtractor={(v) => v.id} renderItem={renderVoice} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  intro: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 16, paddingBottom: 8 },
  introText: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 20 },
  list: { padding: 16, paddingTop: 4, gap: 14, paddingBottom: 40 },
  item: { gap: 6 },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 4 },
  placeText: { flex: 1, fontSize: 12, fontWeight: '600', color: colors.waterBlue },
  error: { textAlign: 'center', marginTop: 40, color: '#EF4444' },
});
