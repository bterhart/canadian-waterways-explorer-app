// "Read aloud" / "Stop" for a passage (roadmap item 5). Pairs with useReadAloud; `documentId`
// asks the server for the spoken copy in the reader's chosen narrator voice.
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Volume2, Square } from 'lucide-react-native';
import { useReadAloud } from '@/lib/speech';
import { useTranslation } from '@/lib/i18n';

interface Props {
  text: string | null | undefined;
  documentId?: string | null;
  color?: string;
  compact?: boolean;
}

export function ReadAloudButton({ text, documentId, color = '#2D5A3D', compact }: Props) {
  const { t } = useTranslation();
  const { state, toggle } = useReadAloud(text, documentId);
  if (!text) return null;
  const active = state !== 'idle';
  const label = state === 'loading' ? t('loading') : active ? t('stopReading') : t('readAloud');
  return (
    <Pressable
      onPress={toggle}
      style={({ pressed }) => [styles.button, { borderColor: color }, active && { backgroundColor: color }, compact && styles.compact, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
    >
      {state === 'loading' ? (
        <ActivityIndicator size="small" color="white" />
      ) : active ? (
        <Square size={compact ? 13 : 15} color="white" fill="white" />
      ) : (
        <Volume2 size={compact ? 14 : 16} color={color} />
      )}
      <Text style={[styles.label, { color: active ? 'white' : color }, compact && styles.labelCompact]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderRadius: 18, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: 'white', alignSelf: 'flex-start', minHeight: 32 },
  compact: { paddingVertical: 4, paddingHorizontal: 10, minHeight: 28 },
  pressed: { opacity: 0.75 },
  label: { fontSize: 13, fontWeight: '700' },
  labelCompact: { fontSize: 12 },
});
