import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAdminLogin,
  usePendingContributions,
  useReviewContribution,
  adminKeys,
  type PendingContribution,
} from '@/lib/api/waterways-api';

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
};

// Contribution type badge colors
const typeBadgeColors: Record<string, { bg: string; text: string }> = {
  photo: { bg: '#DBEAFE', text: '#1E40AF' },
  description: { bg: '#D1FAE5', text: '#065F46' },
  historical_fact: { bg: '#FEF3C7', text: '#92400E' },
  story: { bg: '#EDE9FE', text: '#5B21B6' },
};

export default function AdminScreen() {
  const queryClient = useQueryClient();

  // Admin auth state (local component state)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Review modal state
  const [reviewingContribution, setReviewingContribution] = useState<PendingContribution | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | null>(null);

  // Feedback state
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // API hooks
  const loginMutation = useAdminLogin();
  const { data: pendingContributions, isLoading: isLoadingContributions, refetch } = usePendingContributions(isLoggedIn);
  const reviewMutation = useReviewContribution();

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
        setIsLoggedIn(true);
        setPassword('');
        showFeedback('success', 'Login successful');
      } else {
        showFeedback('error', result?.message || 'Login failed');
      }
    } catch (error) {
      showFeedback('error', 'Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  const handleReviewAction = (contribution: PendingContribution, action: 'approved' | 'rejected') => {
    setReviewingContribution(contribution);
    setReviewAction(action);
    setAdminNotes('');
  };

  const confirmReview = async () => {
    if (!reviewingContribution || !reviewAction) return;

    try {
      await reviewMutation.mutateAsync({
        id: reviewingContribution.id,
        status: reviewAction,
        adminNotes: adminNotes.trim() || undefined,
      });

      showFeedback('success', `Contribution ${reviewAction} successfully`);
      queryClient.invalidateQueries({ queryKey: adminKeys.pendingContributions() });
      setReviewingContribution(null);
      setReviewAction(null);
      setAdminNotes('');
    } catch (error) {
      showFeedback('error', `Failed to ${reviewAction} contribution`);
    }
  };

  const cancelReview = () => {
    setReviewingContribution(null);
    setReviewAction(null);
    setAdminNotes('');
  };

  const formatContributionType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
            <Text style={styles.loginSubtitle}>Sign in to review contributions</Text>

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
      {/* Header with logout */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Pending Contributions</Text>
          <Text style={styles.headerSubtitle}>
            {pendingContributions?.length ?? 0} items to review
          </Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>

      {/* Feedback banner */}
      {feedbackMessage ? (
        <View style={[
          styles.feedbackBanner,
          feedbackMessage.type === 'success' ? styles.feedbackSuccess : styles.feedbackError
        ]}>
          <Text style={styles.feedbackText}>{feedbackMessage.message}</Text>
        </View>
      ) : null}

      {/* Review confirmation modal */}
      {reviewingContribution && reviewAction ? (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {reviewAction === 'approved' ? 'Approve' : 'Reject'} Contribution
            </Text>
            <Text style={styles.modalSubtitle}>
              {reviewingContribution.title}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Admin Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={adminNotes}
                onChangeText={setAdminNotes}
                placeholder="Add notes about this decision..."
                placeholderTextColor={colors.gray500}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={cancelReview}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.confirmButton,
                  reviewAction === 'approved' ? styles.approveButton : styles.rejectButton
                ]}
                onPress={confirmReview}
                disabled={reviewMutation.isPending}
              >
                {reviewMutation.isPending ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {reviewAction === 'approved' ? 'Approve' : 'Reject'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}

      {/* Contributions list */}
      {isLoadingContributions ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading contributions...</Text>
        </View>
      ) : (
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {pendingContributions && pendingContributions.length > 0 ? (
            pendingContributions.map((contribution) => (
              <View key={contribution.id} style={styles.contributionCard}>
                {/* Type badge */}
                <View style={[
                  styles.typeBadge,
                  { backgroundColor: typeBadgeColors[contribution.contributionType]?.bg ?? colors.gray200 }
                ]}>
                  <Text style={[
                    styles.typeBadgeText,
                    { color: typeBadgeColors[contribution.contributionType]?.text ?? colors.gray700 }
                  ]}>
                    {formatContributionType(contribution.contributionType)}
                  </Text>
                </View>

                {/* Title */}
                <Text style={styles.contributionTitle}>{contribution.title}</Text>

                {/* Content preview */}
                <Text style={styles.contentPreview} numberOfLines={3}>
                  {contribution.content}
                </Text>

                {/* Contributor info */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Contributor:</Text>
                  <Text style={styles.infoValue}>
                    {contribution.contributorName ?? 'Anonymous'}
                    {contribution.contributorEmail ? ` (${contribution.contributorEmail})` : null}
                  </Text>
                </View>

                {/* Location info */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location:</Text>
                  <Text style={styles.infoValue}>
                    {contribution.waterway?.name ?? contribution.location?.name ?? 'Not specified'}
                  </Text>
                </View>

                {/* Action buttons */}
                <View style={styles.actionButtons}>
                  <Pressable
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleReviewAction(contribution, 'approved')}
                  >
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReviewAction(contribution, 'rejected')}
                  >
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Pending Contributions</Text>
              <Text style={styles.emptySubtitle}>All contributions have been reviewed</Text>
            </View>
          )}
        </ScrollView>
      )}
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  headerSubtitle: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
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
    marginHorizontal: 16,
    marginTop: 12,
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

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 12,
  },

  // List styles
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Card styles
  contributionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contributionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 8,
  },
  contentPreview: {
    fontSize: 14,
    color: colors.gray500,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray700,
    width: 90,
  },
  infoValue: {
    fontSize: 13,
    color: colors.gray500,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: colors.green600,
  },
  rejectButton: {
    backgroundColor: colors.red600,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray500,
  },

  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.gray500,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.gray100,
  },
  cancelButtonText: {
    color: colors.gray700,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
