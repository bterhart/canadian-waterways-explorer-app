import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  MessageSquare,
  AlertCircle,
} from 'lucide-react-native';
import {
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
  gold: '#C9A227',
};

// Contribution type colors
const typeColors: Record<string, string> = {
  'story': colors.waterBlue,
  'photo': colors.earthBrown,
  'fact': colors.forestGreen,
  'correction': colors.gold,
};

interface ContributionCardProps {
  contribution: PendingContribution;
  onApprove: () => void;
  onReject: () => void;
}

function ContributionCard({ contribution, onApprove, onReject }: ContributionCardProps) {
  const typeColor = typeColors[contribution.contributionType] ?? colors.waterBlue;

  return (
    <View style={styles.contributionCard}>
      {/* Type stripe */}
      <View style={[styles.typeStripe, { backgroundColor: typeColor }]} />

      <View style={styles.cardContent}>
        {/* Type and status badges */}
        <View style={styles.badgesRow}>
          <View style={[styles.typeBadge, { backgroundColor: `${typeColor}20` }]}>
            <Text style={[styles.typeText, { color: typeColor }]}>
              {contribution.contributionType}
            </Text>
          </View>

          <View style={[styles.statusBadge, styles.pendingBadge]}>
            <AlertCircle size={12} color={colors.gold} />
            <Text style={[styles.statusText, { color: colors.gold }]}>
              Pending Review
            </Text>
          </View>
        </View>

        {/* Contribution content */}
        <Text style={styles.contributionContent} numberOfLines={3}>
          {contribution.content}
        </Text>

        {/* Meta info */}
        <View style={styles.metaRow}>
          {contribution.contributorEmail ? (
            <View style={styles.metaItem}>
              <Mail size={14} color={colors.gray500} />
              <Text style={styles.metaText} numberOfLines={1}>
                {contribution.contributorEmail}
              </Text>
            </View>
          ) : null}
          <View style={styles.metaItem}>
            <Calendar size={14} color={colors.gray500} />
            <Text style={styles.metaText}>
              {new Date(contribution.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Related info */}
        {contribution.waterway || contribution.location ? (
          <View style={styles.relatedRow}>
            <Text style={styles.relatedLabel}>Related to:</Text>
            <Text style={styles.relatedText}>
              {contribution.waterway?.name || contribution.location?.name}
            </Text>
          </View>
        ) : null}

        {/* Actions row */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.approveButton} onPress={onApprove}>
            <CheckCircle size={18} color={colors.white} />
            <Text style={styles.approveButtonText}>Approve</Text>
          </Pressable>
          <Pressable style={styles.rejectButton} onPress={onReject}>
            <XCircle size={18} color={colors.white} />
            <Text style={styles.rejectButtonText}>Reject</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function AdminContributionsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: contributions, isLoading, error, refetch } = usePendingContributions(true);
  const reviewMutation = useReviewContribution();

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = (contribution: PendingContribution) => {
    Alert.alert(
      'Approve Contribution',
      'Approve this contribution and add it to the public content?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            setProcessingId(contribution.id);
            try {
              await reviewMutation.mutateAsync({
                id: contribution.id,
                status: 'approved',
              });
              queryClient.invalidateQueries({ queryKey: adminKeys.pendingContributions() });
              Alert.alert('Success', 'Contribution has been approved');
            } catch (err) {
              Alert.alert('Error', 'Failed to approve contribution. Please try again.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = (contribution: PendingContribution) => {
    Alert.prompt(
      'Reject Contribution',
      'Provide a reason for rejecting this contribution (optional):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async (reason?: string) => {
            setProcessingId(contribution.id);
            try {
              await reviewMutation.mutateAsync({
                id: contribution.id,
                status: 'rejected',
                adminNotes: reason,
              });
              queryClient.invalidateQueries({ queryKey: adminKeys.pendingContributions() });
              Alert.alert('Success', 'Contribution has been rejected');
            } catch (err) {
              Alert.alert('Error', 'Failed to reject contribution. Please try again.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Review Contributions',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading contributions...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Review Contributions',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Contributions</Text>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'An error occurred'}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Review Contributions',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.contributionCount}>
          {contributions?.length ?? 0} pending review{(contributions?.length ?? 0) !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Contribution list */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {contributions && contributions.length > 0 ? (
          contributions.map((contribution) => (
            <View key={contribution.id} style={processingId === contribution.id ? styles.processingCard : undefined}>
              {processingId === contribution.id ? (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              ) : null}
              <ContributionCard
                contribution={contribution}
                onApprove={() => handleApprove(contribution)}
                onReject={() => handleReject(contribution)}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MessageSquare size={48} color={colors.gray200} />
            <Text style={styles.emptyTitle}>No Pending Contributions</Text>
            <Text style={styles.emptyText}>
              All user contributions have been reviewed
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamWhite,
  },

  // Header section
  headerSection: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  contributionCount: {
    fontSize: 13,
    color: colors.gray500,
    textAlign: 'center',
  },

  // Loading state
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

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.forestGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Contribution card
  contributionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typeStripe: {
    height: 4,
  },
  cardContent: {
    padding: 16,
  },

  // Badges row
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  pendingBadge: {
    backgroundColor: `${colors.gold}20`,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Contribution content
  contributionContent: {
    fontSize: 14,
    color: colors.gray700,
    lineHeight: 20,
    marginBottom: 12,
  },

  // Meta info
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 120,
  },
  metaText: {
    fontSize: 13,
    color: colors.gray500,
  },

  // Related info
  relatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  relatedLabel: {
    fontSize: 13,
    color: colors.gray500,
  },
  relatedText: {
    fontSize: 13,
    color: colors.waterBlue,
    fontWeight: '600',
  },

  // Actions row
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: 12,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.green600,
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.red600,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },

  // Processing state
  processingCard: {
    opacity: 0.5,
    position: 'relative',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  processingText: {
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
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
  },
});
