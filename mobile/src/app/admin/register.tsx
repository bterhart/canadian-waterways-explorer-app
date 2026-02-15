// Admin Registration Screen
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
import { useRouter, Stack, Link } from 'expo-router';
import {
  Shield,
  Mail,
  Lock,
  User,
  Building,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react-native';
import { useRegisterAdmin } from '@/lib/api/admin-api';

const colors = {
  forestGreen: '#2D5A3D',
  creamWhite: '#FFFEF7',
  darkGreen: '#1A3A24',
  gold: '#C9A227',
  gray100: '#F3F4F6',
  gray500: '#6B7280',
};

export default function AdminRegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const registerMutation = useRegisterAdmin();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters long.'
      );
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        organization: organization.trim() || undefined,
      });

      // Show success state instead of navigating
      setRegistrationComplete(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to submit request. This email may already be registered.';
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  // Success screen after registration
  if (registrationComplete) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Request Submitted',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: 'white',
          }}
        />
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <CheckCircle size={64} color={colors.forestGreen} />
          </View>
          <Text style={styles.successTitle}>Request Submitted</Text>
          <Text style={styles.successMessage}>
            Your admin access request has been submitted successfully.
          </Text>
          <Text style={styles.successDetail}>
            A Super Admin will review your request and you will be notified once your account is approved. This process typically takes 1-2 business days.
          </Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <Text style={styles.infoText}>
              1. A Super Admin reviews your request{'\n'}
              2. You'll receive approval or feedback{'\n'}
              3. Once approved, sign in with your credentials
            </Text>
          </View>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace('/(tabs)/admin')}
          >
            <Text style={styles.backButtonText}>Return to Admin Login</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          title: 'Request Admin Access',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: 'white',
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={40} color={colors.gold} />
          </View>
          <Text style={styles.title}>Request Admin Access</Text>
          <Text style={styles.subtitle}>
            Submit your request to become a content administrator
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email *</Text>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Organization */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Organization (optional)</Text>
            <View style={styles.inputWrapper}>
              <Building size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={organization}
                onChangeText={setOrganization}
                placeholder="School, institution, or organization"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password *</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </Pressable>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password *</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          <Pressable
            style={[
              styles.registerButton,
              registerMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.registerButtonText}>Submit Request</Text>
            )}
          </Pressable>
        </View>

        {/* Login Link */}
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Already have admin access?</Text>
          <Link href="/(tabs)/admin" asChild>
            <Pressable>
              <Text style={styles.loginLink}>Sign In</Text>
            </Pressable>
          </Link>
        </View>

        {/* Note */}
        <View style={styles.noteSection}>
          <Text style={styles.noteText}>
            Admin access allows you to create and manage educational content for the Canadian Waterways Explorer platform. All requests are reviewed by Super Admins.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkGreen,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  inputIcon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#374151',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  registerButton: {
    backgroundColor: colors.forestGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.forestGreen,
  },
  noteSection: {
    backgroundColor: colors.gray100,
    padding: 16,
    borderRadius: 12,
  },
  noteText: {
    fontSize: 13,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 32,
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.forestGreen + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.darkGreen,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: colors.forestGreen,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  successDetail: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  infoBox: {
    backgroundColor: colors.gray100,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkGreen,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray500,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
