// Male / Female narrator switch (roadmap item 5). The choice is per device and applies to every
// Read aloud at once; it names the xAI voices the server reads with (Settings explains).
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useNarratorVoice, type NarratorVoice } from '@/lib/narrator';
import { useTranslation } from '@/lib/i18n';

interface Props {
  color?: string;
  compact?: boolean;
}

export function NarratorToggle({ color = '#7C2D12', compact }: Props) {
  const { t } = useTranslation();
  const [voice, setVoice] = useNarratorVoice();
  const options: { value: NarratorVoice; label: string }[] = [
    { value: 'male', label: t('voiceMale') },
    { value: 'female', label: t('voiceFemale') },
  ];
  return (
    <View style={[styles.row, { borderColor: color }, compact && styles.rowCompact]} accessibilityRole="radiogroup" accessibilityLabel={t('narratorVoice')}>
      {options.map((o) => {
        const on = o.value === voice;
        return (
          <Pressable
            key={o.value}
            onPress={() => setVoice(o.value)}
            style={[styles.option, on && { backgroundColor: color }]}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            hitSlop={4}
          >
            <Text style={[styles.label, { color: on ? 'white' : color }, compact && styles.labelCompact]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderWidth: 1.5, borderRadius: 18, overflow: 'hidden', alignSelf: 'flex-start' },
  rowCompact: { borderRadius: 14 },
  option: { paddingVertical: 5, paddingHorizontal: 10 },
  label: { fontSize: 12, fontWeight: '700' },
  labelCompact: { fontSize: 11 },
});
