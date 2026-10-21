// "Read aloud" / "Stop" for a passage (roadmap item 5). Pairs with useReadAloud; `documentId`
// asks the server for the spoken copy in the reader's chosen narrator voice.
// Two looks: `outline` (the small pill used in the document page header) and `filled` (a solid
// button the width of its row, used on the voice cards; owner, 2026-10-21: the icon and the words
// must read as one button on one line, not as a link beside an icon).
//
// The style is one flattened object, never a function returning nested arrays: in the builds of
// 2026-10-21 that shape lost every style on the device, leaving white text on a cream card, so
// the button worked when tapped but could not be seen (owner, 2026-10-22). Pressed feedback is
// kept in state instead.
import React, { useState } from 'react';
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
  const [pressed, setPressed] = useState(false);
  const filled = variant === 'filled';
  // A filled button is part of its card's layout and stays visible even when there is nothing to
  // read (disabled); the outline pill, used beside a heading, disappears instead.
  if (!text && !filled) return null;
  const disabled = !text;
  const active = state !== 'idle';
  const label = state === 'loading' ? t('loading') : active ? t('stopReading') : t('readAloud');
  const ink = filled || active ? 'white' : color;
  const iconSize = compact ? 14 : filled ? 18 : 16;

  const buttonStyle = StyleSheet.flatten([
    styles.button,
    filled ? styles.filled : styles.outline,
    filled ? { backgroundColor: color } : { borderColor: color },
    !filled && active ? { backgroundColor: color } : null,
    filled && active ? styles.filledActive : null,
    compact ? styles.compact : null,
    disabled ? styles.disabled : null,
    pressed ? styles.pressed : null,
  ]);
  const labelStyle = StyleSheet.flatten([styles.label, { color: ink }, filled ? styles.labelFilled : null, compact ? styles.labelCompact : null]);

  return (
    <Pressable
      onPress={toggle}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={buttonStyle}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: state === 'loading', selected: active, disabled }}
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
      <Text style={labelStyle} numberOfLines={1}>
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
  disabled: { opacity: 0.45 },
  compact: { paddingVertical: 4, paddingHorizontal: 10, minHeight: 28 },
  pressed: { opacity: 0.75 },
  icon: { width: 20, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '700', includeFontPadding: false, textAlignVertical: 'center' },
  labelFilled: { fontSize: 15, letterSpacing: 0.2 },
  labelCompact: { fontSize: 12 },
});
