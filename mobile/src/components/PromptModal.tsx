// Cross-platform text prompt. Alert.prompt exists only on iOS (it is undefined on
// Android and throws when called), so screens that need a typed reason use this
// instead:
//
//   const { prompt, promptElement } = usePromptModal();
//   ...
//   const reason = await prompt({ title: 'Reject', message: '…', minLength: 10 });
//   if (reason === null) return; // cancelled
//   ...
//   return (<View>{...}{promptElement}</View>);
import React, { useCallback, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export interface PromptOptions {
  title: string;
  message?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  /** Minimum trimmed length required to confirm (0 = optional text). */
  minLength?: number;
}

interface PromptState extends PromptOptions {
  resolve: (value: string | null) => void;
}

const colors = {
  forestGreen: '#2D5A3D',
  darkGreen: '#1A3A24',
  danger: '#EF4444',
};

export function usePromptModal() {
  const [state, setState] = useState<PromptState | null>(null);
  const [value, setValue] = useState('');

  const prompt = useCallback(
    (options: PromptOptions) =>
      new Promise<string | null>((resolve) => {
        setValue('');
        setState({ ...options, resolve });
      }),
    []
  );

  const finish = (result: string | null) => {
    state?.resolve(result);
    setState(null);
  };

  const minLength = state?.minLength ?? 0;
  const trimmed = value.trim();
  const canConfirm = trimmed.length >= minLength;

  const promptElement = state ? (
    <Modal transparent animationType="fade" visible onRequestClose={() => finish(null)}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{state.title}</Text>
          {state.message ? <Text style={styles.message}>{state.message}</Text> : null}
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder={state.placeholder ?? 'Type here…'}
            placeholderTextColor="#9CA3AF"
            multiline
            autoFocus
            textAlignVertical="top"
          />
          {minLength > 0 ? (
            <Text style={[styles.hint, !canConfirm && trimmed.length > 0 && styles.hintWarn]}>
              {minLength} characters minimum ({trimmed.length}/{minLength})
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancel]} onPress={() => finish(null)}>
              <Text style={styles.cancelText}>{state.cancelText ?? 'Cancel'}</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                state.destructive ? styles.destructive : styles.confirm,
                !canConfirm && styles.disabled,
              ]}
              onPress={() => canConfirm && finish(trimmed)}
              disabled={!canConfirm}
            >
              <Text style={styles.confirmText}>{state.confirmText ?? 'OK'}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  ) : null;

  return { prompt, promptElement };
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.darkGreen, marginBottom: 6 },
  message: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#374151',
    backgroundColor: '#F9FAFB',
  },
  hint: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },
  hintWarn: { color: colors.danger },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 },
  button: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  cancel: { backgroundColor: '#F3F4F6' },
  cancelText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  confirm: { backgroundColor: colors.forestGreen },
  destructive: { backgroundColor: colors.danger },
  disabled: { opacity: 0.4 },
  confirmText: { fontSize: 15, fontWeight: '700', color: 'white' },
});

export default usePromptModal;
