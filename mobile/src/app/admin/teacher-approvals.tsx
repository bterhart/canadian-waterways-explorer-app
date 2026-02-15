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
  UserCheck,
  UserX,
  Mail,
  Building,
  Calendar,
  GraduationCap,
  MapPin,
} from 'lucide-react-native';
import {
  usePendingTeachers,
  useApproveTeacher,
  useRejectTeacher,
  teacherApprovalKeys,
  type Teacher,
} from '@/lib/api/admin-api';

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

interface TeacherApprovalCardProps {
  teacher: Teacher;
  onApprove: () => void;
  onReject: () => void;
}

function TeacherApprovalCard({ teacher, onApprove, onReject }: TeacherApprovalCardProps) {
  return (
    <View style={styles.teacherCard}>
      {/* Status stripe */}
      <View style={[styles.statusStripe, { backgroundColor: colors.waterBlue }]} />

      <View style={styles.cardContent}>
        {/* Status badge */}
        <View style={styles.badgesRow}>
          <View style={[styles.statusBadge, styles.pendingBadge]}>
            <GraduationCap size={12} color={colors.waterBlue} />
            <Text style={[styles.statusText, { color: colors.waterBlue }]}>Pending Approval</Text>
          </View>
        </View>

        {/* Teacher info */}
        <Text style={styles.teacherName}>{teacher.name}</Text>

        <View style={styles.infoRow}>
          <Mail size={16} color={colors.gray500} />
          <Text style={styles.infoText}>{teacher.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Building size={16} color={colors.gray500} />
          <Text style={styles.infoText}>{teacher.schoolName}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.gray500} />
          <Text style={styles.infoText}>{teacher.schoolDistrict}, {teacher.province}</Text>
        </View>

        <View style={styles.infoRow}>
          <Calendar size={16} color={colors.gray500} />
          <Text style={styles.infoText}>
            Applied {new Date(teacher.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Actions row */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.approveButton} onPress={onApprove}>
            <UserCheck size={18} color={colors.white} />
            <Text style={styles.approveButtonText}>Approve</Text>
          </Pressable>
          <Pressable style={styles.rejectButton} onPress={onReject}>
            <UserX size={18} color={colors.white} />
            <Text style={styles.rejectButtonText}>Reject</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function TeacherApprovalsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: pendingTeachers, isLoading, error, refetch } = usePendingTeachers(true);
  const approveMutation = useApproveTeacher();
  const rejectMutation = useRejectTeacher();

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = (teacher: Teacher) => {
    Alert.alert(
      'Approve Teacher',
      `Approve ${teacher.name} as a teacher?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            setProcessingId(teacher.id);
            try {
              await approveMutation.mutateAsync(teacher.id);
              queryClient.invalidateQueries({ queryKey: teacherApprovalKeys.pending() });
              Alert.alert('Success', `${teacher.name} has been approved`);
            } catch (err) {
              Alert.alert('Error', 'Failed to approve teacher. Please try again.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = (teacher: Teacher) => {
    Alert.prompt(
      'Reject Teacher',
      `Provide a reason for rejecting ${teacher.name}:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async (reason?: string) => {
            if (!reason?.trim()) {
              Alert.alert('Error', 'Please provide a rejection reason');
              return;
            }
            setProcessingId(teacher.id);
            try {
              await rejectMutation.mutateAsync({
                id: teacher.id,
                payload: { rejectionReason: reason },
              });
              queryClient.invalidateQueries({ queryKey: teacherApprovalKeys.pending() });
              Alert.alert('Success', `${teacher.name} has been rejected`);
            } catch (err) {
              Alert.alert('Error', 'Failed to reject teacher. Please try again.');
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
            title: 'Teacher Approvals',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading teacher approvals...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Teacher Approvals',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Approvals</Text>
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
          title: 'Teacher Approvals',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.approvalCount}>
          {pendingTeachers?.length ?? 0} pending approval{(pendingTeachers?.length ?? 0) !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Teacher list */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {pendingTeachers && pendingTeachers.length > 0 ? (
          pendingTeachers.map((teacher) => (
            <View key={teacher.id} style={processingId === teacher.id ? styles.processingCard : undefined}>
              {processingId === teacher.id ? (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              ) : null}
              <TeacherApprovalCard
                teacher={teacher}
                onApprove={() => handleApprove(teacher)}
                onReject={() => handleReject(teacher)}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <UserCheck size={48} color={colors.gray200} />
            <Text style={styles.emptyTitle}>No Pending Teacher Approvals</Text>
            <Text style={styles.emptyText}>
              All teacher requests have been processed
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
  approvalCount: {
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

  // Teacher card
  teacherCard: {
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
  statusStripe: {
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  pendingBadge: {
    backgroundColor: `${colors.waterBlue}20`,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Teacher info
  teacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray500,
  },

  // Actions row
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: 12,
    marginTop: 12,
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
