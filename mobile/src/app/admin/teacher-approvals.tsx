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
  useAllTeachers,
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
  const getStatusConfig = () => {
    switch (teacher.status) {
      case 'approved':
        return { color: colors.green500, label: 'Approved' };
      case 'rejected':
        return { color: colors.red500, label: 'Rejected' };
      case 'suspended':
        return { color: colors.gray500, label: 'Suspended' };
      default:
        return { color: colors.waterBlue, label: 'Pending Approval' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <View style={styles.teacherCard}>
      {/* Status stripe */}
      <View style={[styles.statusStripe, { backgroundColor: statusConfig.color }]} />

      <View style={styles.cardContent}>
        {/* Status badge */}
        <View style={styles.badgesRow}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
            <GraduationCap size={12} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
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
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  const { data: pendingTeachers, isLoading: pendingLoading, error: pendingError, refetch: refetchPending } = usePendingTeachers(true);
  const { data: allTeachers, isLoading: allLoading, error: allError, refetch: refetchAll } = useAllTeachers();
  const approveMutation = useApproveTeacher();
  const rejectMutation = useRejectTeacher();

  const [processingId, setProcessingId] = useState<string | null>(null);

  const teachers = activeTab === 'pending' ? pendingTeachers : allTeachers;
  const isLoading = activeTab === 'pending' ? pendingLoading : allLoading;
  const error = activeTab === 'pending' ? pendingError : allError;
  const refetch = activeTab === 'pending' ? refetchPending : refetchAll;

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

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending ({pendingTeachers?.length ?? 0})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Teachers ({allTeachers?.length ?? 0})
          </Text>
        </Pressable>
      </View>

      {/* Teacher list */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {teachers && teachers.length > 0 ? (
          teachers.map((teacher) => (
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

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.forestGreen,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray500,
  },
  activeTabText: {
    color: colors.forestGreen,
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
