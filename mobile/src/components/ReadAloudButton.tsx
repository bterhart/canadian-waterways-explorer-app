// "Read aloud" / "Stop" for a passage (roadmap item 5). Pairs with useReadAloud; `documentId`
// asks the server for the spoken copy in the reader's chosen narrator voice.
// Two looks: `outline` (the small pill used in the document page header) and `filled` (a solid
// button the width of its row, used on the voice cards; owner, 2026-10-21: the icon and the words
// must read as one button on one line, not as a link beside an icon).
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Volume2, Square } from 'lucide-react-native';
import { useReadAloud } from '@/lib/speech';
import { useTranslation } from '@/lib/i18n';

interface Props {
  text: string | null | undefined;
  documentId?: string | null;
  color?: string;
  compact?: boolean;
  variant?: 'outline' | 'filled';
}

export function ReadAloudButton({ text, documentId, color = '#2D5A3D', compact, variant = 'outline' }: Props) {
  const { t } = useTranslation();
  const { state, toggle } = useReadAloud(text, documentId);
  if (!text) return null;
  const active = state !== 'idle';
  const label = state === 'loading' ? t('loading') : active ? t('stopReading') : t('readAloud');
  const filled = variant === 'filled';
  const inkOnFill = 'white';
  const ink = filled || active ? inkOnFill : color;
  const iconSize = compact ? 14 : filled ? 18 : 16;
  return (
    <Pressable
      onPress={toggle}
      style={({ pressed }) => [
        styles.button,
        filled ? [styles.filled, { backgroundColor: color }] : [styles.outline, { borderColor: color }, active && { backgroundColor: color }],
        filled && active && styles.filledActive,
        compact && styles.compact,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: state === 'loading', selected: active }}
      hitSlop={6}
    >
      <View style={styles.icon}>
        {state === 'loading' ? (
          <ActivityIndicator size="small" color={ink} />
        ) : active ? (
          <Square size={iconSize - 2} color={ink} fill={ink} />
        ) : (
          <Volume2 size={iconSize} color={ink} />
        )}
      </View>
      <Text style={[styles.label, { color: ink }, filled && styles.labelFilled, compact && styles.labelCompact]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 18, paddingVertical: 6, paddingHorizontal: 12, minHeight: 32 },
  outline: { borderWidth: 1.5, backgroundColor: 'white', alignSelf: 'flex-start' },
  filled: { alignSelf: 'stretch', borderRadius: 10, minHeight: 42, paddingVertical: 10, paddingHorizontal: 16 },
  filledActive: { opacity: 0.88 },
  compact: { paddingVertical: 4, paddingHorizontal: 10, minHeight: 28 },
  pressed: { opacity: 0.75 },
  icon: { width: 20, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '700', includeFontPadding: false, textAlignVertical: 'center' },
  labelFilled: { fontSize: 15, letterSpacing: 0.2 },
  labelCompact: { fontSize: 12 },
});
