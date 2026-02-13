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
  Shield,
  ShieldCheck,
  Mail,
  Building,
  Calendar,
  Crown,
  ChevronRight,
} from 'lucide-react-native';
import {
  useAllAdmins,
  useGrantSuperAdmin,
  adminApprovalKeys,
  type AdminUser,
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

// Status colors
const statusColors: Record<string, { bg: string; text: string }> = {
  approved: { bg: '#D1FAE5', text: colors.green600 },
  pending: { bg: `${colors.gold}20`, text: colors.gold },
  rejected: { bg: '#FEE2E2', text: colors.red600 },
  suspended: { bg: colors.gray100, text: colors.gray500 },
};

interface AdminUserCardProps {
  admin: AdminUser;
  onGrantSuperAdmin?: () => void;
}

function AdminUserCard({ admin, onGrantSuperAdmin }: AdminUserCardProps) {
  const statusStyle = statusColors[admin.status] ?? statusColors.pending;
  const isSuperAdmin = admin.role === 'super_admin';

  return (
    <View style={styles.adminCard}>
      {/* Role stripe */}
      <View style={[
        styles.roleStripe,
        { backgroundColor: isSuperAdmin ? colors.gold : colors.forestGreen }
      ]} />

      <View style={styles.cardContent}>
        {/* Badges row */}
        <View style={styles.badgesRow}>
          {/* Role badge */}
          <View style={[
            styles.roleBadge,
            { backgroundColor: isSuperAdmin ? `${colors.gold}20` : `${colors.forestGreen}15` }
          ]}>
            {isSuperAdmin ? (
              <Crown size={12} color={colors.gold} />
            ) : (
              <Shield size={12} color={colors.forestGreen} />
            )}
            <Text style={[
              styles.roleText,
              { color: isSuperAdmin ? colors.gold : colors.forestGreen }
            ]}>
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </Text>
          </View>

          {/* Status badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Admin info */}
        <Text style={styles.adminName}>{admin.name}</Text>

        <View style={styles.infoRow}>
          <Mail size={16} color={colors.gray500} />
          <Text style={styles.infoText}>{admin.email}</Text>
        </View>

        {admin.organization ? (
          <View style={styles.infoRow}>
            <Building size={16} color={colors.gray500} />
            <Text style={styles.infoText}>{admin.organization}</Text>
          </View>
        ) : null}

        <View style={styles.infoRow}>
          <Calendar size={16} color={colors.gray500} />
          <Text style={styles.infoText}>
            Joined {new Date(admin.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {admin.lastLoginAt ? (
          <View style={styles.infoRow}>
            <ShieldCheck size={16} color={colors.gray500} />
            <Text style={styles.infoText}>
              Last login {new Date(admin.lastLoginAt).toLocaleDateString()}
            </Text>
          </View>
        ) : null}

        {/* Grant super admin button (only for non-super-admins and approved admins) */}
        {!isSuperAdmin && admin.status === 'approved' && onGrantSuperAdmin ? (
          <View style={styles.actionsRow}>
            <Pressable style={styles.grantButton} onPress={onGrantSuperAdmin}>
              <Crown size={18} color={colors.white} />
              <Text style={styles.grantButtonText}>Grant Super Admin</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default function AdminUsersScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: admins, isLoading, error, refetch } = useAllAdmins();
  const grantSuperAdminMutation = useGrantSuperAdmin();

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleGrantSuperAdmin = (admin: AdminUser) => {
    Alert.alert(
      'Grant Super Admin',
      `Grant ${admin.name} super admin privileges? This will give them full control over all admin features.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Grant',
          style: 'default',
          onPress: async () => {
            setProcessingId(admin.id);
            try {
              await grantSuperAdminMutation.mutateAsync(admin.id);
              queryClient.invalidateQueries({ queryKey: adminApprovalKeys.all });
              Alert.alert('Success', `${admin.name} is now a super admin`);
            } catch (err) {
              Alert.alert('Error', 'Failed to grant super admin. Please try again.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Admin Users',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.forestGreen} />
          <Text style={styles.loadingText}>Loading admin users...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Admin Users',
            headerStyle: { backgroundColor: colors.forestGreen },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Admin Users</Text>
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
          title: 'Admin Users',
          headerStyle: { backgroundColor: colors.forestGreen },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.userCount}>
          {admins?.length ?? 0} admin{(admins?.length ?? 0) !== 1 ? 's' : ''} total
        </Text>
      </View>

      {/* Admin list */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {admins && admins.length > 0 ? (
          admins.map((admin) => (
            <View key={admin.id} style={processingId === admin.id ? styles.processingCard : undefined}>
              {processingId === admin.id ? (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              ) : null}
              <AdminUserCard
                admin={admin}
                onGrantSuperAdmin={() => handleGrantSuperAdmin(admin)}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Shield size={48} color={colors.gray200} />
            <Text style={styles.emptyTitle}>No Admin Users</Text>
            <Text style={styles.emptyText}>
              No admin users found in the system
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
  userCount: {
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

  // Admin card
  adminCard: {
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
  roleStripe: {
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
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Admin info
  adminName: {
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
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: 12,
    marginTop: 12,
  },
  grantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.gold,
  },
  grantButtonText: {
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
