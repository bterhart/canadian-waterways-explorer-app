import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Map,
  FileText,
  FileStack,
  GraduationCap,
  Shield,
  Users,
  CheckCircle,
  ChevronRight,
} from 'lucide-react-native';
import {
  useAdminLogin,
  usePendingContributions,
  useReviewContribution,
  adminKeys,
  type PendingContribution,
} from '@/lib/api/waterways-api';
import {
  useAdminLessonPlans,
  useAdminFieldTrips,
  useAdminDocuments,
  useAdminPrintables,
  usePendingAdmins,
  usePendingTeachers,
} from '@/lib/api/admin-api';
import { useAdminQuizzes } from '@/lib/api/waterways-api';
import { setAuthToken } from '@/lib/api/api';

// Theme colors
const colors = {
  forestGreen: '#2D5A3D',
  waterBlue: '#3B82A3',
  earthBrown: '#8B5A2B',
  creamWhite: '#FFFEF7',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray500: '#6B7280',
  gray700: '#374151',
  red500: '#EF4444',
  red600: '#DC2626',
  green500: '#22C55E',
  green600: '#16A34A',
  gold: '#C9A227',
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  onPress: () => void;
  color?: string;
}

function MenuItem({ icon, label, count, onPress, color = colors.forestGreen }: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIconContainer, { backgroundColor: `${color}15` }]}>
        {icon}
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuLabel}>{label}</Text>
        {count !== undefined ? (
          <Text style={styles.menuCount}>{count} items</Text>
        ) : null}
      </View>
      <ChevronRight size={20} color={colors.gray500} />
    </Pressable>
  );
}

export default function AdminScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Admin auth state (local component state)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [adminRole, setAdminRole] = useState<'super_admin' | 'moderator'>('moderator');

  // Feedback state
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // API hooks
  const loginMutation = useAdminLogin();

  // Content counts
  const { data: lessonPlans } = useAdminLessonPlans();
  const { data: fieldTrips } = useAdminFieldTrips();
  const { data: documents } = useAdminDocuments();
  const { data: printables } = useAdminPrintables();
  const { data: quizzes } = useAdminQuizzes();
  const { data: pendingAdmins } = usePendingAdmins(isLoggedIn && adminRole === 'super_admin');
  const { data: pendingTeachers } = usePendingTeachers(isLoggedIn && adminRole === 'super_admin');
  const { data: pendingContributions } = usePendingContributions(isLoggedIn);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedbackMessage({ type, message });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showFeedback('error', 'Please enter email and password');
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({ email: email.trim(), password });
      if (result?.success) {
        // Store the auth token for authenticated API requests
        if (result.accessToken) {
          setAuthToken(result.accessToken);
        }
        setIsLoggedIn(true);
        setPassword('');
        // Get the role from the API response
        setAdminRole(result.admin?.role ?? 'moderator');
        showFeedback('success', 'Login successful');
        // Invalidate queries to refetch with auth token
        queryClient.invalidateQueries();
      } else {
        showFeedback('error', result?.message || 'Login failed');
      }
    } catch (error) {
      showFeedback('error', 'Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    // Clear auth token on logout
    setAuthToken(null);
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    // Clear cached data
    queryClient.clear();
  };

  // Login form
  if (!isLoggedIn) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.loginContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Admin Login</Text>
            <Text style={styles.loginSubtitle}>Sign in to manage content</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="admin@example.com"
                placeholderTextColor={colors.gray500}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor={colors.gray500}
                secureTextEntry
              />
            </View>

            {feedbackMessage ? (
              <View style={[
                styles.feedbackBanner,
                feedbackMessage.type === 'success' ? styles.feedbackSuccess : styles.feedbackError
              ]}>
                <Text style={styles.feedbackText}>{feedbackMessage.message}</Text>
              </View>
            ) : null}

            <Pressable
              style={[styles.loginButton, loginMutation.isPending && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Admin panel
  return (
    <View style={styles.container}>
      {/* Header with role badge and logout */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <View style={styles.roleBadge}>
            <Shield size={14} color={adminRole === 'super_admin' ? colors.gold : colors.forestGreen} />
            <Text style={[
              styles.roleBadgeText,
              { color: adminRole === 'super_admin' ? colors.gold : colors.forestGreen }
            ]}>
              {adminRole === 'super_admin' ? 'Super Admin' : 'Admin'}
            </Text>
          </View>
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {/* Super Admin Only Section */}
        {adminRole === 'super_admin' ? (
          <>
            <Text style={styles.sectionTitle}>Super Admin</Text>
            <View style={styles.section}>
              <MenuItem
                icon={<Users size={24} color={colors.gold} />}
                label="Pending Admin Approvals"
                count={pendingAdmins?.length ?? 0}
                onPress={() => router.push('/admin/approvals')}
                color={colors.gold}
              />
              <View style={styles.divider} />
              <MenuItem
                icon={<GraduationCap size={24} color={colors.waterBlue} />}
                label="Pending Teacher Approvals"
                count={pendingTeachers?.length ?? 0}
                onPress={() => router.push('/admin/teacher-approvals')}
                color={colors.waterBlue}
              />
              <View style={styles.divider} />
              <MenuItem
                icon={<CheckCircle size={24} color={colors.forestGreen} />}
                label="All Admin Users"
                onPress={() => router.push('/admin/users')}
                color={colors.forestGreen}
              />
            </View>
          </>
        ) : null}

        {/* Content Management */}
        <Text style={styles.sectionTitle}>Content Management</Text>
        <View style={styles.section}>
          <MenuItem
            icon={<BookOpen size={24} color={colors.forestGreen} />}
            label="Lesson Plans"
            count={lessonPlans?.length ?? 0}
            onPress={() => router.push('/admin/lesson-plans')}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<Map size={24} color={colors.waterBlue} />}
            label="Virtual Field Trips"
            count={fieldTrips?.length ?? 0}
            onPress={() => router.push('/admin/field-trips')}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<FileText size={24} color={colors.earthBrown} />}
            label="Primary Source Documents"
            count={documents?.length ?? 0}
            onPress={() => router.push('/admin/documents')}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<FileStack size={24} color={colors.green600} />}
            label="Printable Resources"
            count={printables?.length ?? 0}
            onPress={() => router.push('/admin/printables')}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<GraduationCap size={24} color={colors.forestGreen} />}
            label="Quizzes"
            count={quizzes?.length ?? 0}
            onPress={() => router.push('/admin/quizzes')}
          />
        </View>

        {/* User Contributions */}
        <Text style={styles.sectionTitle}>User Contributions</Text>
        <View style={styles.section}>
          <MenuItem
            icon={<CheckCircle size={24} color={colors.waterBlue} />}
            label="Pending Reviews"
            count={pendingContributions?.length ?? 0}
            onPress={() => router.push('/admin/contributions')}
            color={colors.waterBlue}
          />
        </View>

        {/* My Content */}
        <Text style={styles.sectionTitle}>My Content</Text>
        <View style={styles.section}>
          <MenuItem
            icon={<FileText size={24} color={colors.forestGreen} />}
            label="My Created Content"
            onPress={() => router.push('/admin/my-content')}
          />
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{lessonPlans?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Lesson Plans</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{fieldTrips?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Field Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{documents?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Documents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{printables?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Printables</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{quizzes?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.waterBlue }]}>
              {pendingContributions?.length ?? 0}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },

  // Login styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  loginCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.forestGreen,
    textAlign: 'center',
    marginBottom: 4,
  },
  loginSubtitle: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.gray100,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: colors.gray700,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  loginButton: {
    backgroundColor: colors.forestGreen,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.forestGreen,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray700,
  },

  // Feedback styles
  feedbackBanner: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  feedbackSuccess: {
    backgroundColor: '#D1FAE5',
  },
  feedbackError: {
    backgroundColor: '#FEE2E2',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },

  // List styles
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Section styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray700,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Menu item styles
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 2,
  },
  menuCount: {
    fontSize: 13,
    color: colors.gray500,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginLeft: 76,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.forestGreen,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray500,
    textAlign: 'center',
  },
});
