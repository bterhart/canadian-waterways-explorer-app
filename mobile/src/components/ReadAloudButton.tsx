// "Read aloud" / "Stop" for a passage (roadmap item 5). Pairs with useReadAloud.
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Volume2, Square } from 'lucide-react-native';
import { useReadAloud } from '@/lib/speech';
import { useTranslation } from '@/lib/i18n';

interface Props {
  text: string | null | undefined;
  color?: string;
  compact?: boolean;
}

export function ReadAloudButton({ text, color = '#2D5A3D', compact }: Props) {
  const { t } = useTranslation();
  const { speaking, toggle } = useReadAloud(text);
  if (!text) return null;
  return (
    <Pressable
      onPress={toggle}
      style={({ pressed }) => [styles.button, { borderColor: color }, speaking && { backgroundColor: color }, compact && styles.compact, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={speaking ? t('stopReading') : t('readAloud')}
      hitSlop={6}
    >
      {speaking ? <Square size={compact ? 13 : 15} color="white" fill="white" /> : <Volume2 size={compact ? 14 : 16} color={color} />}
      <Text style={[styles.label, { color: speaking ? 'white' : color }, compact && styles.labelCompact]}>
        {speaking ? t('stopReading') : t('readAloud')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderRadius: 18, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'white', alignSelf: 'flex-start' },
  compact: { paddingVertical: 4, paddingHorizontal: 10 },
  pressed: { opacity: 0.75 },
  label: { fontSize: 13, fontWeight: '700' },
  labelCompact: { fontSize: 12 },
});
