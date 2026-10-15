// Join Class — a student enters the teacher's 6-character join code and a display name.
// Membership is tied to the anonymous device identity (lib/identity.ts); no account needed.
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Users, KeyRound, User } from 'lucide-react-native';
import { useJoinClass } from '@/lib/api/education-api';
import { useDeviceId } from '@/lib/identity';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
};

export default function JoinClassScreen() {
  const router = useRouter();
  const userId = useDeviceId();
  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const joinClass = useJoinClass();

  const handleJoin = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 6) {
      Alert.alert('Join Code', 'Enter the 6-character code your teacher gave you.');
      return;
    }
    if (!displayName.trim()) {
      Alert.alert('Your Name', 'Enter the name your teacher should see.');
      return;
    }
    if (!userId) {
      Alert.alert('Please wait', 'Setting up your device identity…');
      return;
    }
    try {
      const result = await joinClass.mutateAsync({
        joinCode: code,
        displayName: displayName.trim(),
        userId,
      });
      Alert.alert('Welcome!', `You joined ${result.class.name}.`, [
        { text: 'OK', onPress: () => router.replace('/my-class') },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to join the class.';
      Alert.alert('Could Not Join', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          title: 'Join Class',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Users size={40} color={colors.forestGreen} />
          </View>
          <Text style={styles.title}>Join Your Class</Text>
          <Text style={styles.subtitle}>
            Ask your teacher for the class code. You will see the assignments they set for you.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Class Code *</Text>
            <View style={styles.inputWrapper}>
              <KeyRound size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.codeInput]}
                value={joinCode}
                onChangeText={(v) => setJoinCode(v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                placeholder="ABC123"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={6}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your Name *</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="How your teacher knows you"
                placeholderTextColor="#9CA3AF"
                autoCorrect={false}
              />
            </View>
            <Text style={styles.inputHint}>Only your teacher sees this name.</Text>
          </View>

          <Pressable
            style={[styles.joinButton, joinClass.isPending && styles.buttonDisabled]}
            onPress={handleJoin}
            disabled={joinClass.isPending}
          >
            {joinClass.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.joinButtonText}>Join Class</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamWhite },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.darkGreen, marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  form: { gap: 20 },
  inputGroup: {},
  inputLabel: { fontSize: 14, fontWeight: '600', color: colors.darkGreen, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  inputIcon: { marginLeft: 14 },
  input: { flex: 1, padding: 14, fontSize: 16, color: '#374151' },
  codeInput: { fontSize: 22, fontWeight: '700', letterSpacing: 6 },
  inputHint: { fontSize: 12, color: '#9CA3AF', marginTop: 4, marginLeft: 4 },
  joinButton: {
    backgroundColor: colors.forestGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.7 },
  joinButtonText: { fontSize: 16, fontWeight: '700', color: 'white' },
});
